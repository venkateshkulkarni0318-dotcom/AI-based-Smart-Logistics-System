import express from 'express';
import { optimizeRoutePath, calculateHaversineKm } from '../services/routingEngine.js';
import { canonicalVillages } from '../services/settlementRegistry.js';

const router = express.Router();

// Active delivery routes with real waypoints across corridors
const activeRoutesList = [
  {
    id: 'route-himalaya-01',
    name: 'High-Altitude Leh-Zanskar Relief Line',
    corridorId: 'corridor-himalaya',
    status: 'In Transit',
    mode: 'Hybrid Rail + Drone Parachute Drop',
    totalStops: 3,
    startLocation: { name: 'Leh Depot', lat: 34.152, lng: 77.577 },
    waypoints: [
      { id: 'v-h3', name: 'Spiti Base Feeder', lat: 32.246, lng: 78.034, status: 'Clear' },
      { id: 'v-h2', name: 'Kargi Valley Settlement', lat: 34.120, lng: 76.995, status: 'Advisory (Debris)' },
      { id: 'v-h1', name: 'Zanskar Outpost', lat: 33.512, lng: 76.883, status: 'Blocked (Air-Drop Active)' }
    ],
    estimatedDuration: '4h 15m',
    totalDistanceKm: 184.2,
    riskLevel: 'High',
    currentLocation: { lat: 33.850, lng: 77.100, label: 'En route Kargi gorge' },
    telemetry: { speedKmh: 42, fuelOrBatteryPct: 78, weatherStatus: 'Snow Flurries (-4°C)' }
  },
  {
    id: 'route-delta-02',
    name: 'Brahmaputra Char Lifeline Route',
    corridorId: 'corridor-delta',
    status: 'Scheduled',
    mode: 'Inland River Freight Barge',
    totalStops: 3,
    startLocation: { name: 'Guwahati Port Hub', lat: 26.185, lng: 91.747 },
    waypoints: [
      { id: 'v-d3', name: 'Sadiya Junction Depot', lat: 27.830, lng: 95.660, status: 'Clear' },
      { id: 'v-d2', name: 'Dhemaji River Bank', lat: 27.480, lng: 94.580, status: 'High Siltation' },
      { id: 'v-d1', name: 'Majuli Island Char #4', lat: 26.950, lng: 94.210, status: 'Submerged Road' }
    ],
    estimatedDuration: '3h 30m',
    totalDistanceKm: 142.0,
    riskLevel: 'Moderate',
    currentLocation: { lat: 27.200, lng: 94.400, label: 'Docking Dhemaji Embankment' },
    telemetry: { speedKmh: 24, fuelOrBatteryPct: 92, weatherStatus: 'Moderate Rain (18 mm/h)' }
  },
  {
    id: 'route-desert-03',
    name: 'Thar Desert Border Outpost Circuit',
    corridorId: 'corridor-desert',
    status: 'In Transit',
    mode: '6x6 Off-Road Convoy + Drone Recon',
    totalStops: 3,
    startLocation: { name: 'Jaisalmer Base Depot', lat: 26.915, lng: 70.908 },
    waypoints: [
      { id: 'v-b3', name: 'Ramgarh Feeder Hub', lat: 27.360, lng: 70.500, status: 'Clear' },
      { id: 'v-b2', name: 'Longewala Frontier Hamlets', lat: 27.520, lng: 70.150, status: 'Sand Drifts' },
      { id: 'v-b1', name: 'Tanot Border Settlement', lat: 27.800, lng: 70.350, status: 'Extreme Heat (46°C)' }
    ],
    estimatedDuration: '4h 45m',
    totalDistanceKm: 168.5,
    riskLevel: 'Moderate',
    currentLocation: { lat: 27.450, lng: 70.300, label: 'Traversing Ramgarh-Longewala track' },
    telemetry: { speedKmh: 35, fuelOrBatteryPct: 64, weatherStatus: 'Sand Haze (46°C)' }
  }
];

// GET /api/routing/active - Active delivery missions & route states
router.get('/active', (req, res) => {
  try {
    const { corridorId } = req.query;
    let list = activeRoutesList;
    if (corridorId) {
      list = list.filter(r => r.corridorId === corridorId);
    }
    res.json({
      success: true,
      count: list.length,
      routes: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active routes', error: error.message });
  }
});

// POST /api/routing/optimize - Real multi-modal route path optimization (Objective 04)
router.post('/optimize', (req, res) => {
  try {
    const {
      destinationVillageIds = [],
      startLocation,
      preferredMode = 'hybrid',
      riskThreshold = 60,
      payloadWeightKg = 500
    } = req.body;

    let targetVillages = [];

    if (destinationVillageIds.length > 0) {
      targetVillages = destinationVillageIds
        .map(id => canonicalVillages.find(v => v.id === id || v.name.toLowerCase() === String(id).toLowerCase()))
        .filter(Boolean);
    }

    // Default fallback: take top 4 villages across the active corridor
    if (targetVillages.length === 0) {
      targetVillages = canonicalVillages.slice(0, 4);
    }

    const startHub = startLocation || {
      name: 'Regional Tactical Supply Depot',
      lat: targetVillages[0].coordinates.lat - 0.25,
      lng: targetVillages[0].coordinates.lng - 0.25
    };

    const optimizationResult = optimizeRoutePath({
      waypoints: targetVillages,
      startHub,
      preferredMode,
      riskThreshold: Number(riskThreshold) || 60,
      payloadKg: Number(payloadWeightKg) || 500
    });

    res.json(optimizationResult);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Route optimization calculation failed', error: error.message });
  }
});

// GET /api/routing/distance - Quick Haversine distance calculator between 2 points
router.get('/distance', (req, res) => {
  const { lat1, lng1, lat2, lng2 } = req.query;
  if (!lat1 || !lng1 || !lat2 || !lng2) {
    return res.status(400).json({ success: false, message: 'Missing lat1, lng1, lat2, or lng2' });
  }

  const distanceKm = calculateHaversineKm(
    { lat: parseFloat(lat1), lng: parseFloat(lng1) },
    { lat: parseFloat(lat2), lng: parseFloat(lng2) }
  );

  res.json({
    success: true,
    distanceKm
  });
});

export default router;
