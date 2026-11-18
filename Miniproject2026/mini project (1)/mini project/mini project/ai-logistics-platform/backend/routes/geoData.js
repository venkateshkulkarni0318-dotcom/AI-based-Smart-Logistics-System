import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const dataDir = path.resolve(__dirname, '../../data');
const srtmPath = path.join(dataDir, 'srtm.geojson');
const shrugDbPath = path.join(dataDir, 'shrug_keys.db');

let srtmData = null;
let db = null;

// Safe init function
function initData() {
  if (fs.existsSync(srtmPath)) {
    try {
      srtmData = JSON.parse(fs.readFileSync(srtmPath, 'utf8'));
    } catch (err) {
      console.warn('Notice: Failed reading srtm.geojson:', err.message);
    }
  }

  if (fs.existsSync(shrugDbPath)) {
    try {
      db = new DatabaseSync(shrugDbPath, { open: true, readOnly: true });
    } catch (err) {
      console.warn('Notice: Failed opening shrug_keys.db:', err.message);
    }
  }
}

initData();

// GET /api/geo/status - Check dataset presence & statistics
router.get('/status', (req, res) => {
  let shrugInfo = { loaded: false, path: 'data/shrug_keys.db' };
  if (db) {
    try {
      const ac07Count = db.prepare('SELECT count(*) as count FROM ac07_name_key').get()?.count || 0;
      const shridCount = db.prepare('SELECT count(*) as count FROM shrid_frag_con07_key').get()?.count || 0;
      shrugInfo = {
        loaded: true,
        path: 'data/shrug_keys.db',
        totalConstituencies: ac07Count,
        totalVillageShrugKeys: shridCount
      };
    } catch (err) {
      shrugInfo = { loaded: false, error: err.message };
    }
  }

  res.json({
    success: true,
    data: {
      srtm: {
        loaded: !!srtmData,
        path: 'data/srtm.geojson',
        featureCount: srtmData?.features?.length || 0,
        metadata: srtmData?.metadata || null
      },
      shrug: shrugInfo
    }
  });
});

// GET /api/geo/srtm - Fetch SRTM DEM elevation dataset or filter by corridor
router.get('/srtm', (req, res) => {
  if (!srtmData) {
    return res.status(404).json({ success: false, message: 'SRTM GeoJSON not loaded' });
  }

  const { corridor_id } = req.query;
  if (corridor_id) {
    const filtered = srtmData.features.filter(
      f => f.properties && f.properties.corridor_id === corridor_id
    );
    return res.json({
      success: true,
      corridor_id,
      count: filtered.length,
      features: filtered
    });
  }

  res.json({ success: true, ...srtmData });
});

// GET /api/geo/elevation-profile - Generate elevation points and cross-sectional transect
router.get('/elevation-profile', (req, res) => {
  const { corridor_id = 'corridor-himalaya' } = req.query;
  
  if (!srtmData) {
    return res.status(404).json({ success: false, message: 'SRTM data not available' });
  }

  const features = srtmData.features.filter(
    f => !corridor_id || corridor_id === 'all' || (f.properties && f.properties.corridor_id === corridor_id)
  );

  const rawPoints = features
    .filter(f => f.geometry.type === 'Point')
    .map(f => ({
      id: f.properties.id,
      name: f.properties.name,
      elevationM: f.properties.elevation_m,
      slopeDeg: f.properties.slope_gradient_deg,
      terrain: f.properties.terrain_classification,
      coordinates: f.geometry.coordinates,
      avalancheRisk: f.properties.avalanche_risk_index || 0,
      floodRisk: f.properties.flood_submergence_risk || 0,
      sandTrapRisk: f.properties.sand_trap_index || 0,
      corridorId: f.properties.corridor_id
    }));

  if (rawPoints.length === 0) {
    return res.json({
      success: true,
      corridorId: corridor_id,
      pointCount: 0,
      profile: [],
      metrics: null
    });
  }

  // Calculate cumulative distance using Haversine
  const toRad = deg => (deg * Math.PI) / 180;
  const haversineDist = (c1, c2) => {
    const lat1 = toRad(c1[1]);
    const lon1 = toRad(c1[0]);
    const lat2 = toRad(c2[1]);
    const lon2 = toRad(c2[0]);
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  let cumulativeKm = 0;
  const profileWithDistance = rawPoints.map((pt, idx) => {
    if (idx > 0) {
      const segDist = haversineDist(rawPoints[idx - 1].coordinates, pt.coordinates);
      cumulativeKm += Number(segDist.toFixed(1));
    }
    return {
      ...pt,
      distanceKm: Number(cumulativeKm.toFixed(1)),
      gradientPercent: Number((Math.tan((pt.slopeDeg * Math.PI) / 180) * 100).toFixed(1))
    };
  });

  // Calculate high-resolution interpolated transect (12 sample points across total distance)
  const totalTransectKm = Math.max(cumulativeKm, 25);
  const interpolatedTransect = [];
  const steps = 15;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const dist = Number((t * totalTransectKm).toFixed(1));
    
    // Find enclosing raw points
    let pA = profileWithDistance[0];
    let pB = profileWithDistance[profileWithDistance.length - 1];
    for (let j = 0; j < profileWithDistance.length - 1; j++) {
      if (dist >= profileWithDistance[j].distanceKm && dist <= profileWithDistance[j + 1].distanceKm) {
        pA = profileWithDistance[j];
        pB = profileWithDistance[j + 1];
        break;
      }
    }

    const segSpan = Math.max(pB.distanceKm - pA.distanceKm, 0.001);
    const localT = Math.min(Math.max((dist - pA.distanceKm) / segSpan, 0), 1);
    const elev = Math.round(pA.elevationM + (pB.elevationM - pA.elevationM) * localT);
    const slope = Number((pA.slopeDeg + (pB.slopeDeg - pA.slopeDeg) * localT).toFixed(1));

    interpolatedTransect.push({
      stationIndex: i,
      distanceKm: dist,
      elevationM: elev,
      slopeDeg: slope,
      nearestWaypoint: localT < 0.5 ? pA.name : pB.name,
      dronePermitted: elev <= 4200,
      heavyConvoyPermitted: slope <= 14.0
    });
  }

  const elevations = rawPoints.map(p => p.elevationM);
  const slopes = rawPoints.map(p => p.slopeDeg);
  const maxElev = Math.max(...elevations);
  const minElev = Math.min(...elevations);
  const maxSlope = Math.max(...slopes);

  // Compute cumulative ascent across transect points
  let cumulativeAscentM = 0;
  for (let i = 1; i < profileWithDistance.length; i++) {
    const diff = profileWithDistance[i].elevationM - profileWithDistance[i - 1].elevationM;
    if (diff > 0) cumulativeAscentM += diff;
  }
  const elevationGainM = cumulativeAscentM > 0 ? cumulativeAscentM : Math.max(0, maxElev - minElev);
  const isNearlyFlat = (maxElev - minElev) < 120;

  const metrics = {
    totalTransectKm: Number(totalTransectKm.toFixed(1)),
    maxElevationM: maxElev,
    minElevationM: minElev,
    elevationGainM,
    maxSlopeDeg: maxSlope,
    isNearlyFlat,
    droneCeilingM: 4200,
    droneFlightClear: maxElev <= 4200,
    heavyTruckMaxSlopeDeg: 12.0,
    heavyTruckSafe: maxSlope <= 12.0,
    avalancheHazardDetected: rawPoints.some(p => p.avalancheRisk > 0.6),
    floodHazardDetected: rawPoints.some(p => p.floodRisk > 0.6)
  };

  res.json({
    success: true,
    corridorId: corridor_id,
    pointCount: profileWithDistance.length,
    profile: profileWithDistance,
    transectCurve: interpolatedTransect,
    metrics
  });
});

// GET /api/geo/shrug/constituencies - Search SHRUG ACs by query string
router.get('/shrug/constituencies', (req, res) => {
  if (!db) {
    return res.status(503).json({ success: false, message: 'SHRUG SQLite database not accessible' });
  }

  const query = (req.query.q || '').trim().toLowerCase();
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  try {
    let rows;
    if (query) {
      rows = db.prepare(
        `SELECT ac07_id, ac07_name, pc01_state_name, pc01_district_name 
         FROM ac07_name_key 
         WHERE lower(ac07_name) LIKE ? OR lower(pc01_state_name) LIKE ? 
         LIMIT ?`
      ).all(`%${query}%`, `%${query}%`, limit);
    } else {
      rows = db.prepare(
        `SELECT ac07_id, ac07_name, pc01_state_name, pc01_district_name 
         FROM ac07_name_key 
         LIMIT ?`
      ).all(limit);
    }

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
