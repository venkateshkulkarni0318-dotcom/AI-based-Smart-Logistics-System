/**
 * Settlement & Village Accessibility Registry (Objective 03)
 * Provides unified access to border outposts, corridor villages,
 * dynamic accessibility scoring, and SHRUG database lookups.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../data/shrug_keys.db');
let sqliteDb = null;

try {
  if (fs.existsSync(dbPath)) {
    sqliteDb = new DatabaseSync(dbPath, { open: true, readOnly: true });
  }
} catch (err) {
  console.warn('Notice: SHRUG SQLite DB initialized in fallback mode:', err.message);
}

// Canonical settlements unified across corridors and border zones
export const canonicalVillages = [
  // Western Himalayan Corridor (High Altitude Mountain & Border Passes)
  {
    id: 'v-h1',
    shrid: '11-01-001-00001-000001',
    name: 'Zanskar Outpost',
    corridorId: 'corridor-himalaya',
    corridorName: 'Western Himalayan Highland',
    district: 'Kargil',
    state: 'Ladakh (UT)',
    population: 640,
    terrain: 'High Alpine / Glacial Moraine',
    elevationMeters: 4120,
    coordinates: { lat: 33.512, lng: 76.883 },
    borderZone: true,
    seasonalCutoffDays: 140,
    accessScore: 28,
    riskStatus: 'High',
    primaryHazards: ['Snow Avalanches', 'Landslides', 'Bridge Washouts', 'Freezing Temperatures'],
    recommendedMode: 'Heavy Cargo UAV Drone + Mountain Feeder Rail',
    droneLandingPad: true,
    medicalCachesStaged: true
  },
  {
    id: 'v-h2',
    shrid: '11-01-001-00001-000002',
    name: 'Kargi Valley Settlement',
    corridorId: 'corridor-himalaya',
    corridorName: 'Western Himalayan Highland',
    district: 'Kargil',
    state: 'Ladakh (UT)',
    population: 1420,
    terrain: 'Steep Gorge / Switchbacks',
    elevationMeters: 3280,
    coordinates: { lat: 34.120, lng: 76.995 },
    borderZone: true,
    seasonalCutoffDays: 90,
    accessScore: 46,
    riskStatus: 'High',
    primaryHazards: ['Debris Flows', 'Rockfall Overwash', 'Slippery Pass Ice'],
    recommendedMode: 'Heavy 6x6 Off-Road Convoy + Drone Lift',
    droneLandingPad: true,
    medicalCachesStaged: true
  },
  {
    id: 'v-h3',
    shrid: '11-02-004-00002-000015',
    name: 'Spiti Base Feeder',
    corridorId: 'corridor-himalaya',
    corridorName: 'Western Himalayan Highland',
    district: 'Lahaul & Spiti',
    state: 'Himachal Pradesh',
    population: 2100,
    terrain: 'High Valley Basin',
    elevationMeters: 2450,
    coordinates: { lat: 32.246, lng: 78.034 },
    borderZone: false,
    seasonalCutoffDays: 45,
    accessScore: 68,
    riskStatus: 'Moderate',
    primaryHazards: ['Flash Snowmelt', 'Tunnel Frost Blockades'],
    recommendedMode: 'Mountain Rail Feeder + 4WD Utility',
    droneLandingPad: false,
    medicalCachesStaged: true
  },
  // Brahmaputra Riverine & Delta Corridor (Monsoon Floodplain & Island Chars)
  {
    id: 'v-d1',
    shrid: '11-18-012-00004-000108',
    name: 'Majuli Island Char #4',
    corridorId: 'corridor-delta',
    corridorName: 'Brahmaputra Riverine & Delta',
    district: 'Majuli',
    state: 'Assam',
    population: 2800,
    terrain: 'River Island / Marshland',
    elevationMeters: 58,
    coordinates: { lat: 26.950, lng: 94.210 },
    borderZone: false,
    seasonalCutoffDays: 75,
    accessScore: 35,
    riskStatus: 'High',
    primaryHazards: ['Annual Monsoon Inundation', 'Riverbank Erosion', 'Submerged Roads'],
    recommendedMode: 'Inland River Freight Barge',
    droneLandingPad: true,
    medicalCachesStaged: true
  },
  {
    id: 'v-d2',
    shrid: '11-18-012-00004-000109',
    name: 'Dhemaji River Bank',
    corridorId: 'corridor-delta',
    corridorName: 'Brahmaputra Riverine & Delta',
    district: 'Dhemaji',
    state: 'Assam',
    population: 3900,
    terrain: 'Alluvial Floodplain',
    elevationMeters: 84,
    coordinates: { lat: 27.480, lng: 94.580 },
    borderZone: false,
    seasonalCutoffDays: 40,
    accessScore: 58,
    riskStatus: 'Moderate',
    primaryHazards: ['Embankment Breach', 'Mud Siltation'],
    recommendedMode: 'Amphibious Cargo Ferry + 4WD Truck',
    droneLandingPad: false,
    medicalCachesStaged: false
  },
  {
    id: 'v-d3',
    shrid: '11-18-014-00001-000030',
    name: 'Sadiya Junction Depot',
    corridorId: 'corridor-delta',
    corridorName: 'Brahmaputra Riverine & Delta',
    district: 'Tinsukia',
    state: 'Assam',
    population: 5100,
    terrain: 'Elevated Riverine Basin',
    elevationMeters: 120,
    coordinates: { lat: 27.830, lng: 95.660 },
    borderZone: true,
    seasonalCutoffDays: 15,
    accessScore: 82,
    riskStatus: 'Low',
    primaryHazards: ['Occasional Flash Silt'],
    recommendedMode: 'All-Terrain Road + Freight Railhead',
    droneLandingPad: true,
    medicalCachesStaged: true
  },
  // Western Thar Arid Border Corridor (Desert Dunes & Frontier Outposts)
  {
    id: 'v-b1',
    shrid: '11-08-015-00002-000042',
    name: 'Tanot Border Settlement',
    corridorId: 'corridor-desert',
    corridorName: 'Western Thar Arid Border',
    district: 'Jaisalmer',
    state: 'Rajasthan',
    population: 890,
    terrain: 'Shifting Sand Dunes',
    elevationMeters: 210,
    coordinates: { lat: 27.800, lng: 70.350 },
    borderZone: true,
    seasonalCutoffDays: 20,
    accessScore: 42,
    riskStatus: 'Moderate',
    primaryHazards: ['Sandstorm Blindouts', 'Soft Sand Traps', 'Thermal Stress (48°C)'],
    recommendedMode: 'Heavy 6x6 Off-Road Convoy + Drone Recon',
    droneLandingPad: true,
    medicalCachesStaged: true
  },
  {
    id: 'v-b2',
    shrid: '11-08-015-00002-000043',
    name: 'Longewala Frontier Hamlets',
    corridorId: 'corridor-desert',
    corridorName: 'Western Thar Arid Border',
    district: 'Jaisalmer',
    state: 'Rajasthan',
    population: 520,
    terrain: 'Desert Arid Plain',
    elevationMeters: 185,
    coordinates: { lat: 27.520, lng: 70.150 },
    borderZone: true,
    seasonalCutoffDays: 30,
    accessScore: 38,
    riskStatus: 'Moderate',
    primaryHazards: ['Track Loss in Sand Drifts', 'Extreme Water Scarcity'],
    recommendedMode: 'Heavy 6x6 Off-Road Convoy',
    droneLandingPad: false,
    medicalCachesStaged: true
  },
  {
    id: 'v-b3',
    shrid: '11-08-015-00003-000010',
    name: 'Ramgarh Feeder Hub',
    corridorId: 'corridor-desert',
    corridorName: 'Western Thar Arid Border',
    district: 'Jaisalmer',
    state: 'Rajasthan',
    population: 4300,
    terrain: 'Semi-Arid Scrubland',
    elevationMeters: 165,
    coordinates: { lat: 27.360, lng: 70.500 },
    borderZone: false,
    seasonalCutoffDays: 5,
    accessScore: 76,
    riskStatus: 'Low',
    primaryHazards: ['Localized Dust Storms'],
    recommendedMode: 'All-Terrain Road + Feeder Rail Line',
    droneLandingPad: true,
    medicalCachesStaged: false
  },
  // Additional Tribal & Forest Outposts
  {
    id: 'v-t1',
    shrid: '11-02-001-00005-000022',
    name: 'Dharampur Forest Hamlet',
    corridorId: 'corridor-himalaya',
    corridorName: 'Foothill Forest Belt',
    district: 'Mandi',
    state: 'Himachal Pradesh',
    population: 1150,
    terrain: 'Dense Forest / Ridge Track',
    elevationMeters: 1480,
    coordinates: { lat: 31.850, lng: 76.920 },
    borderZone: false,
    seasonalCutoffDays: 25,
    accessScore: 61,
    riskStatus: 'Moderate',
    primaryHazards: ['Monsoon Tree Fall', 'Landslip on Unpaved Road'],
    recommendedMode: '4WD Utility Van',
    droneLandingPad: false,
    medicalCachesStaged: false
  }
];

/**
 * Filter & query settlement database with pagination
 */
export function queryVillages({
  search = '',
  corridor = '',
  borderZone = null,
  riskStatus = '',
  minAccess = 0,
  maxAccess = 100,
  page = 1,
  limit = 20
}) {
  let results = [...canonicalVillages];

  if (search) {
    const term = search.trim().toLowerCase();
    results = results.filter(v =>
      v.name.toLowerCase().includes(term) ||
      v.district.toLowerCase().includes(term) ||
      v.state.toLowerCase().includes(term) ||
      v.terrain.toLowerCase().includes(term)
    );
  }

  if (corridor) {
    results = results.filter(v => v.corridorId === corridor);
  }

  if (borderZone !== null && borderZone !== undefined && borderZone !== '') {
    const isBorder = String(borderZone).toLowerCase() === 'true';
    results = results.filter(v => v.borderZone === isBorder);
  }

  if (riskStatus && riskStatus.toUpperCase() !== 'ALL') {
    results = results.filter(v => v.riskStatus.toUpperCase() === riskStatus.toUpperCase());
  }

  results = results.filter(v => v.accessScore >= minAccess && v.accessScore <= maxAccess);

  const total = results.length;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const totalPages = Math.ceil(total / pageSize) || 1;
  const paginatedData = results.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  return {
    total,
    page: pageNum,
    limit: pageSize,
    totalPages,
    data: paginatedData
  };
}

/**
 * Dynamically compute an accessibility score (0 - 100) based on real multi-factor metrics
 */
export function calculateAccessibilityScore({
  seasonalCutoffDays = 0,
  distanceToPavedRoadKm = 0,
  terrainElevationM = 500,
  slopeGradientDeg = 5,
  hasAllWeatherBridge = true,
  hasMobileTowerConnectivity = true,
  healthSubcenterDistanceKm = 10
}) {
  // Base score 100 with deduction weights
  let score = 100;

  // 1. Cutoff penalty: each 10 days cutoff deducts 3 points (up to 35 pts)
  const cutoffPenalty = Math.min(35, (seasonalCutoffDays / 10) * 2.8);
  score -= cutoffPenalty;

  // 2. Unpaved track distance penalty: each km of unpaved track deducts 1.5 points (up to 25 pts)
  const roadPenalty = Math.min(25, distanceToPavedRoadKm * 1.5);
  score -= roadPenalty;

  // 3. Slope & Elevation penalty (high altitude and steep gorge friction)
  let terrainPenalty = 0;
  if (terrainElevationM > 3000) terrainPenalty += 10;
  else if (terrainElevationM > 1800) terrainPenalty += 5;
  if (slopeGradientDeg > 20) terrainPenalty += 10;
  else if (slopeGradientDeg > 12) terrainPenalty += 5;
  score -= Math.min(20, terrainPenalty);

  // 4. Infrastructure penalties
  if (!hasAllWeatherBridge) score -= 12;
  if (!hasMobileTowerConnectivity) score -= 8;
  if (healthSubcenterDistanceKm > 25) score -= 8;

  const accessScore = Math.max(5, Math.min(100, Math.round(score)));

  let riskCategory = 'Low';
  let rating = 'Well-Connected';
  if (accessScore < 40) {
    riskCategory = 'High';
    rating = 'Critically Isolated';
  } else if (accessScore < 65) {
    riskCategory = 'Moderate';
    rating = 'Vulnerable';
  }

  return {
    accessScore,
    riskCategory,
    rating,
    penalties: {
      seasonalCutoff: Math.round(cutoffPenalty),
      roadRemoteness: Math.round(roadPenalty),
      terrainGradient: terrainPenalty,
      infrastructureGaps: (hasAllWeatherBridge ? 0 : 12) + (hasMobileTowerConnectivity ? 0 : 8) + (healthSubcenterDistanceKm > 25 ? 8 : 0)
    },
    recommendation: accessScore < 40
      ? 'Requires pre-positioned medical stocks, satellite comms terminal, and designated UAV heli-drop zone.'
      : accessScore < 65
      ? 'Seasonal 4WD convoy escort required during monsoon/snow periods.'
      : 'Standard multi-modal supply line sufficient.'
  };
}

/**
 * Look up SHRUG key metadata for a settlement
 */
export function lookupShrugKey(acNameOrId) {
  if (!sqliteDb) {
    return {
      connected: false,
      message: 'SHRUG SQLite database offline or in read-only lock'
    };
  }

  try {
    const ac = sqliteDb.prepare(
      `SELECT ac07_id, ac07_name, pc01_state_name, pc01_district_name 
       FROM ac07_name_key 
       WHERE lower(ac07_name) = ? OR ac07_id = ?
       LIMIT 1`
    ).get(acNameOrId.toLowerCase(), acNameOrId);

    if (!ac) return { found: false };

    const fragments = sqliteDb.prepare(
      `SELECT shrid2, fragment_wt_con07_norm, match_source 
       FROM shrid_frag_con07_key 
       WHERE ac07_id = ? 
       LIMIT 5`
    ).all(ac.ac07_id);

    return {
      found: true,
      constituency: ac,
      sampleVillageShrids: fragments
    };
  } catch (err) {
    return { found: false, error: err.message };
  }
}
