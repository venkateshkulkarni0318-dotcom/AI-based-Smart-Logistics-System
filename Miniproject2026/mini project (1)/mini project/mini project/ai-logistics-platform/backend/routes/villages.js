import express from 'express';
import { queryVillages, canonicalVillages, calculateAccessibilityScore, lookupShrugKey } from '../services/settlementRegistry.js';

const router = express.Router();

// GET /api/villages - Filterable and searchable settlement database
router.get('/', (req, res) => {
  try {
    const { search, corridor, borderZone, riskStatus, minAccess, maxAccess, page, limit } = req.query;

    const result = queryVillages({
      search,
      corridor,
      borderZone,
      riskStatus,
      minAccess: minAccess !== undefined ? Number(minAccess) : 0,
      maxAccess: maxAccess !== undefined ? Number(maxAccess) : 100,
      page,
      limit
    });

    const all = canonicalVillages;
    const stats = {
      totalSettlements: all.length,
      highRiskCount: all.filter(v => v.riskStatus === 'High').length,
      borderPostCount: all.filter(v => v.borderZone).length,
      averageAccessScore: Math.round(all.reduce((s, v) => s + v.accessScore, 0) / all.length)
    };

    res.json({
      success: true,
      stats,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve settlements', error: error.message });
  }
});

// GET /api/villages/:id - Specific village details
router.get('/:id', (req, res) => {
  try {
    const village = canonicalVillages.find(v => v.id === req.params.id);
    if (!village) {
      return res.status(404).json({ success: false, message: `Village '${req.params.id}' not found` });
    }

    // Attempt SHRUG key lookup if available
    let shrugInfo = null;
    if (village.district) {
      shrugInfo = lookupShrugKey(village.district);
    }

    res.json({
      success: true,
      data: {
        ...village,
        shrugMetadata: shrugInfo?.found ? shrugInfo : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get village profile', error: error.message });
  }
});

// POST /api/villages/score - Dynamic accessibility scoring model (Objective 03)
router.post('/score', (req, res) => {
  try {
    const {
      seasonalCutoffDays,
      distanceToPavedRoadKm,
      terrainElevationM,
      slopeGradientDeg,
      hasAllWeatherBridge,
      hasMobileTowerConnectivity,
      healthSubcenterDistanceKm
    } = req.body;

    const evaluation = calculateAccessibilityScore({
      seasonalCutoffDays: Number(seasonalCutoffDays) || 0,
      distanceToPavedRoadKm: Number(distanceToPavedRoadKm) || 0,
      terrainElevationM: Number(terrainElevationM) || 500,
      slopeGradientDeg: Number(slopeGradientDeg) || 5,
      hasAllWeatherBridge: hasAllWeatherBridge !== false,
      hasMobileTowerConnectivity: hasMobileTowerConnectivity !== false,
      healthSubcenterDistanceKm: Number(healthSubcenterDistanceKm) || 10
    });

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid scoring parameters', error: error.message });
  }
});

export default router;
