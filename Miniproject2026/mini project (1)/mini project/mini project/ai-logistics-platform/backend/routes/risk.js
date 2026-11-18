import express from 'express';
import { calculateDisruptionRisk } from '../services/riskEngine.js';
import { canonicalVillages } from '../services/settlementRegistry.js';

const router = express.Router();

// GET /api/risk/assessment - Disruption risk overview across all active sectors
router.get('/assessment', (req, res) => {
  try {
    const highRiskVillages = canonicalVillages.filter(v => v.riskStatus === 'High');
    const moderateRiskVillages = canonicalVillages.filter(v => v.riskStatus === 'Moderate');

    // Aggregate environmental indicators
    const assessment = {
      overallRiskLevel: highRiskVillages.length > 3 ? 'High' : 'Moderate',
      totalMonitoredSettlements: canonicalVillages.length,
      highRiskCount: highRiskVillages.length,
      moderateRiskCount: moderateRiskVillages.length,
      weatherRiskFactor: 0.68,
      terrainRiskFactor: 0.74,
      criticalSectors: [
        {
          name: 'Zanskar Pass (Western Himalaya)',
          riskScore: 84,
          hazard: 'Snow avalanche & glacial drift',
          directive: 'Ground transit blocked • UAV airlift authorized'
        },
        {
          name: 'Majuli Floodplain (Brahmaputra Delta)',
          riskScore: 78,
          hazard: 'Seasonal monsoon inundation',
          directive: 'Roads submerged • River barge priority'
        },
        {
          name: 'Longewala Dune Track (Western Thar)',
          riskScore: 42,
          hazard: 'Sand drift & heat strain',
          directive: '6x6 Off-Road Convoy with GPS escort'
        }
      ],
      systemTimestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to compute risk assessment', error: error.message });
  }
});

// POST /api/risk/evaluate - Dynamic ML risk evaluation with live feature weighting & FastAPI fallback (Fixes Issue A6)
router.post('/evaluate', async (req, res) => {
  try {
    const {
      rainfallMmHr = 65,
      windSpeedKmh = 38,
      soilSaturationPct = 72,
      slopeGradientDeg = 24,
      pastIncidentsScale = 6,
      terrainType = 'Mountain',
      villageId
    } = req.body;

    const rain = Number(rainfallMmHr);
    const wind = Number(windSpeedKmh);
    const soil = Number(soilSaturationPct);
    const slope = Number(slopeGradientDeg);
    const incidents = Number(pastIncidentsScale);

    // Input Validation (Issue A6 & T29)
    if (isNaN(rain) || rain < 0 || rain > 300) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', field: 'rainfallMmHr', message: 'Rainfall must be between 0 and 300 mm/h' }
      });
    }
    if (isNaN(slope) || slope < 0 || slope > 90) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', field: 'slopeGradientDeg', message: 'Slope gradient must be between 0° and 90°' }
      });
    }
    if (isNaN(soil) || soil < 0 || soil > 100) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', field: 'soilSaturationPct', message: 'Soil saturation must be between 0% and 100%' }
      });
    }

    // Optional: if villageId provided, pull village context
    let targetVillage = null;
    if (villageId) {
      targetVillage = canonicalVillages.find(v => v.id === villageId);
    }

    const payload = {
      rainfallMmHr: rain,
      windSpeedKmh: wind,
      soilSaturationPct: soil,
      slopeGradientDeg: slope,
      pastIncidentsScale: incidents,
      terrainType: targetVillage?.terrain || terrainType
    };

    let evaluation = null;
    let engineUsed = 'node-fallback-rule-based';
    let isFallback = true;

    // Attempt FastAPI on port 8000 first with timeout
    try {
      const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600); // 600ms timeout

      const fastRes = await fetch(`${fastApiUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (fastRes.ok) {
        evaluation = await fastRes.json();
        engineUsed = 'fastapi-random-forest';
        isFallback = false;
      }
    } catch {
      // FastAPI is offline or timed out; execute node gateway fallback
    }

    // Node Gateway Fallback
    if (!evaluation) {
      evaluation = calculateDisruptionRisk(payload);
      engineUsed = 'node-fallback-rule-based';
      isFallback = true;
    }

    res.json({
      success: true,
      village: targetVillage ? { id: targetVillage.id, name: targetVillage.name } : null,
      evaluation,
      metadata: {
        engine: engineUsed,
        isFallback,
        fallbackNotice: isFallback ? 'FastAPI service offline. Running local deterministic rule-based model.' : null,
        timestampIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error evaluating risk parameters', error: error.message });
  }
});

export default router;
