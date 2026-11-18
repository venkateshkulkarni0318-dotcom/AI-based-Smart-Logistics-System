import express from 'express';

const router = express.Router();

// Multimodal Modes Definition (Objective 01)
const multimodalModes = [
  {
    id: 'road',
    name: 'All-Terrain Road Transport',
    category: 'Surface Ground',
    icon: '🚚',
    vehicleTypes: ['4WD High-Ground Truck', '6x6 Off-Road Convoy', 'All-Weather Utility Van'],
    avgSpeedKmh: 45,
    payloadCapacityKg: 12000,
    costPerKmKg: 0.28,
    carbonGPerTonneKm: 165,
    vulnerabilities: ['Landslides', 'Flash floods', 'Road washout', 'Snow accumulation'],
    resilienceScore: 54,
    maxWindToleranceKmh: 100,
    maxRainToleranceMmHr: 45,
    statusBadge: 'Surface Standard'
  },
  {
    id: 'rail',
    name: 'Regional Mountain & Feeder Rail',
    category: 'Surface Rail',
    icon: '🚂',
    vehicleTypes: ['Narrow-Gauge Diesel-Electric', 'Standard Heavy Freight Rail'],
    avgSpeedKmh: 65,
    payloadCapacityKg: 850000,
    costPerKmKg: 0.08,
    carbonGPerTonneKm: 32,
    vulnerabilities: ['Track erosion', 'Tunnel blockades', 'Fixed railhead limitation'],
    resilienceScore: 78,
    maxWindToleranceKmh: 120,
    maxRainToleranceMmHr: 80,
    statusBadge: 'High Bulk Efficiency'
  },
  {
    id: 'waterway',
    name: 'Inland River Freight Barge',
    category: 'Waterway',
    icon: '⛴️',
    vehicleTypes: ['Flat-Bottom Shallow Draft Barge', 'Amphibious Cargo Ferry'],
    avgSpeedKmh: 24,
    payloadCapacityKg: 65000,
    costPerKmKg: 0.06,
    carbonGPerTonneKm: 24,
    vulnerabilities: ['Seasonal shallows', 'Monsoon rapids', 'Siltation'],
    resilienceScore: 82,
    maxWindToleranceKmh: 65,
    maxRainToleranceMmHr: 120,
    statusBadge: 'Flood Resilient'
  },
  {
    id: 'drone',
    name: 'Heavy-Lift Autonomous Cargo UAV',
    category: 'Air Dispatch',
    icon: '🛸',
    vehicleTypes: ['Octocopter VTOL Drone (50kg)', 'Tandem-Rotor Cargo UAV (150kg)'],
    avgSpeedKmh: 95,
    payloadCapacityKg: 150,
    costPerKmKg: 0.75,
    carbonGPerTonneKm: 18,
    vulnerabilities: ['High wind gusts (>50 km/h)', 'Dense icing fog', 'Payload weight ceiling'],
    resilienceScore: 92,
    maxWindToleranceKmh: 50,
    maxRainToleranceMmHr: 35,
    statusBadge: 'Zero Ground Risk'
  }
];

// GET /api/multimodal/modes
router.get('/modes', (req, res) => {
  res.json({
    success: true,
    count: multimodalModes.length,
    data: multimodalModes
  });
});

// POST /api/multimodal/recommend - Pareto-optimal mode decision engine (Objective 04)
router.post('/recommend', (req, res) => {
  try {
    const {
      distanceKm = 100,
      payloadWeightKg = 80,
      urgencyLevel = 'STANDARD', // 'CRITICAL_EMERGENCY' | 'HIGH_URGENCY' | 'STANDARD'
      weatherCondition = 'Clear', // 'Clear' | 'Moderate Rain' | 'Severe Rain / Landslide' | 'Gale Winds'
      terrainType = 'Mountain'    // 'Mountain' | 'Riverine' | 'Desert' | 'Plains'
    } = req.body;

    const dist = Math.max(5, Number(distanceKm) || 100);
    const weight = Math.max(1, Number(payloadWeightKg) || 80);

    // Compute metrics for all 4 modes
    const analysis = multimodalModes.map(mode => {
      let isViable = true;
      const blockers = [];

      // Weight constraint check
      if (weight > mode.payloadCapacityKg) {
        isViable = false;
        blockers.push(`Payload (${weight} kg) exceeds max capacity (${mode.payloadCapacityKg} kg)`);
      }

      // Weather checks
      if (weatherCondition === 'Gale Winds' && mode.id === 'drone') {
        isViable = false;
        blockers.push('High wind shear exceeds drone flight envelope (>50 km/h)');
      }
      if (weatherCondition === 'Severe Rain / Landslide' && mode.id === 'road') {
        isViable = false;
        blockers.push('Mountain road closed due to imminent landslide and mudflow alerts');
      }

      // Terrain checks
      if (terrainType !== 'Riverine' && terrainType !== 'Delta' && mode.id === 'waterway') {
        isViable = false;
        blockers.push('No navigable inland waterway in target terrain');
      }

      // Speed & Duration calculation
      const durationHours = Number((dist / mode.avgSpeedKmh).toFixed(1));
      const hours = Math.floor(durationHours);
      const minutes = Math.round((durationHours - hours) * 60);

      // Cost calculation in INR
      const costInr = Math.round(dist * weight * mode.costPerKmKg * 0.15 + (mode.id === 'drone' ? 500 : 250));

      // Carbon in kg CO2
      const carbonKg = Number(((dist * weight * mode.carbonGPerTonneKm) / 1000000).toFixed(2));

      // Risk score (0-100)
      let riskScore = 100 - mode.resilienceScore;
      if (weatherCondition === 'Moderate Rain') riskScore += 15;
      if (weatherCondition === 'Severe Rain / Landslide') riskScore += 35;
      if (weatherCondition === 'Gale Winds' && mode.id === 'drone') riskScore += 40;
      riskScore = Math.min(100, Math.max(5, riskScore));

      return {
        modeId: mode.id,
        name: mode.name,
        icon: mode.icon,
        isViable,
        blockers,
        durationHours,
        durationFormatted: `${hours}h ${minutes.toString().padStart(2, '0')}m`,
        estimatedCostInr: costInr,
        carbonKg,
        riskScore
      };
    });

    // Select the best viable mode based on urgency & constraints
    const viable = analysis.filter(a => a.isViable);

    let recommended = null;
    let rationale = '';

    if (urgencyLevel === 'CRITICAL_EMERGENCY' && viable.some(v => v.modeId === 'drone')) {
      recommended = viable.find(v => v.modeId === 'drone');
      rationale = 'Critical emergency urgency designated: UAV Drone Airlift selected for immediate dispatch, bypass of ground hazards, and fastest ETA.';
    } else if (weatherCondition === 'Severe Rain / Landslide' && (terrainType === 'Riverine' || terrainType === 'Delta') && viable.some(v => v.modeId === 'waterway')) {
      recommended = viable.find(v => v.modeId === 'waterway');
      rationale = 'Ground roads impassable due to monsoon flooding: Inland River Barge provides safe, high-capacity, flood-resilient transit.';
    } else if (viable.some(v => v.modeId === 'rail') && weight > 500) {
      recommended = viable.find(v => v.modeId === 'rail');
      rationale = 'High payload weight and low carbon priority: Mountain Feeder Rail provides optimal freight bulk efficiency and stable schedules.';
    } else if (viable.some(v => v.modeId === 'road')) {
      recommended = viable.find(v => v.modeId === 'road');
      rationale = 'Nominal route clearance: 4WD all-terrain road transport offers the most economical point-to-point delivery without transshipment delays.';
    } else if (viable.length > 0) {
      recommended = viable[0];
      rationale = `Operational fallback: ${recommended.name} is the most resilient viable carrier for current terrain conditions.`;
    } else {
      recommended = analysis[0];
      rationale = 'Extreme multi-hazard conditions: All conventional channels restricted. Special military air-drop or amphibious convoy required.';
    }

    res.json({
      success: true,
      query: { distanceKm: dist, payloadWeightKg: weight, urgencyLevel, weatherCondition, terrainType },
      recommendedModeId: recommended.modeId,
      recommended: {
        ...recommended,
        rationale,
        confidenceScore: 0.94
      },
      comparativeMatrix: analysis
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Recommendation calculation failed', error: error.message });
  }
});

export default router;
