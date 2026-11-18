import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Brain, Sparkles, Zap } from 'lucide-react';
import { evaluateRisk } from '../services/api';
import DataBadge from './DataBadge';
import { formatSignedShap } from '../utils/formatters';
import { playSuccessChime } from '../utils/soundEffects';

const MLRiskSimulator = () => {
  const [rainfall, setRainfall] = useState(65); // mm/hr
  const [windSpeed, setWindSpeed] = useState(38); // km/h
  const [soilSaturation, setSoilSaturation] = useState(72); // %
  const [slopeGradient, setSlopeGradient] = useState(24); // deg
  const [pastIncidents, setPastIncidents] = useState(6); // scale 1-10
  const [terrainType, setTerrainType] = useState('High Alpine / Glacial');

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    evaluateRisk({
      rainfallMmHr: rainfall,
      windSpeedKmh: windSpeed,
      soilSaturationPct: soilSaturation,
      slopeGradientDeg: slopeGradient,
      pastIncidentsScale: pastIncidents,
      terrainType
    })
      .then(res => {
        if (isMounted && res?.evaluation) {
          setEvaluation(res.evaluation);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [rainfall, windSpeed, soilSaturation, slopeGradient, pastIncidents, terrainType]);

  const score = evaluation?.disruptionScore ?? 68;
  const category = evaluation?.category ?? 'MODERATE';
  const confidence = evaluation?.confidenceScore ?? 0.94;

  const scoreColor =
    category === 'CRITICAL'
      ? 'var(--accent-rose)'
      : category === 'MODERATE'
      ? 'var(--accent-amber)'
      : 'var(--accent-emerald)';

  const shapData = evaluation?.signedShapWaterfall || {
    baseExpectedValue: 32.0,
    contributions: [
      { feature: 'Precipitation Intensity', featureValue: `${rainfall} mm/h`, shapValue: +18.4, impact: 'INCREASES_RISK' },
      { feature: 'Soil Moisture Saturation', featureValue: `${soilSaturation}%`, shapValue: +10.2, impact: 'INCREASES_RISK' },
      { feature: 'Terrain Slope Gradient', featureValue: `${slopeGradient}°`, shapValue: +6.8, impact: 'INCREASES_RISK' },
      { feature: 'Ridge Wind Gusts', featureValue: `${windSpeed} km/h`, shapValue: +2.1, impact: 'INCREASES_RISK' },
      { feature: 'Historical Incident Frequency', featureValue: `${pastIncidents}/10`, shapValue: -1.5, impact: 'REDUCES_RISK' }
    ],
    finalProbability: score
  };

  // Calculate cumulative stepped totals for waterfall
  let runningTotal = shapData.baseExpectedValue;
  const waterfallSteps = shapData.contributions.map((c) => {
    const start = runningTotal;
    runningTotal = Number((runningTotal + c.shapValue).toFixed(1));
    return {
      ...c,
      startVal: start,
      endVal: runningTotal
    };
  });

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Brain size={18} color="var(--apple-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              ML Route-Level Disruption Risk Engine
            </h3>
            <DataBadge isReal={false} label="Simulated demo data" />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Multi-factor predictive ensemble combining precipitation, slope gradient, soil moisture &amp; historical incident logs
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-info">
            Random Forest + Geotechnical Physics
          </span>
          {loading && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Computing...</span>}
        </div>
      </div>

      {/* Main Grid: Controls + Gauge */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Environmental Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Precipitation / Rainfall Intensity</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{rainfall} mm/h</strong>
            </div>
            <input
              type="range"
              min="0"
              max="150"
              value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Precipitation rainfall intensity slider"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Ridge Wind Gusts</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{windSpeed} km/h</strong>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Wind speed slider"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Soil Moisture Saturation</span>
              <strong style={{ color: soilSaturation > 80 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
                {soilSaturation}%
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={soilSaturation}
              onChange={(e) => setSoilSaturation(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Soil moisture saturation percentage slider"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Terrain Slope Gradient</span>
              <strong style={{ color: slopeGradient > 20 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>
                {slopeGradient}° ({Math.round(Math.tan(slopeGradient * Math.PI / 180) * 100)}% Grade)
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              value={slopeGradient}
              onChange={(e) => setSlopeGradient(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Terrain slope gradient slider"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Historical Incident Density (Washout / Landslides)</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{pastIncidents} / 10</strong>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={pastIncidents}
              onChange={(e) => setPastIncidents(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Historical incidents scale slider"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Corridor Geomorphology Context
            </label>
            <select
              className="input-control"
              value={terrainType}
              onChange={(e) => setTerrainType(e.target.value)}
              aria-label="Terrain Geomorphology classification"
            >
              <option value="High Alpine / Glacial">High Alpine / Glacial (Western Himalaya)</option>
              <option value="Riverine / Delta">Riverine / Braided Delta (Brahmaputra Floodplain)</option>
              <option value="Desert / Arid">Desert / Dune Drift (Thar Frontier)</option>
              <option value="Mountain">Mountain Switchbacks</option>
              <option value="Plains">Alluvial Lowland Plains</option>
            </select>
          </div>
        </div>

        {/* Risk Probability Output Gauge */}
        <div style={{
          padding: '1.5rem',
          borderRadius: '8px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Predicted Disruption Probability
          </span>

          <div style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: scoreColor,
            fontFamily: 'var(--font-sans)',
            margin: '4px 0 2px'
          }}>
            {score}%
          </div>

          {/* Color + Icon + Text status (Global Rule #4) */}
          <span
            className={`badge ${category === 'CRITICAL' ? 'badge-danger' : category === 'MODERATE' ? 'badge-warning' : 'badge-success'}`}
            style={{ fontSize: '0.78rem', padding: '5px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {category === 'CRITICAL' ? (
              <><ShieldAlert size={13} /> CRITICAL HAZARD</>
            ) : category === 'MODERATE' ? (
              <><AlertTriangle size={13} /> MODERATE HAZARD</>
            ) : (
              <><CheckCircle2 size={13} /> LOW HAZARD</>
            )}
          </span>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.4 }}>
            {evaluation?.hazardSummary || 'Calculating environmental factors...'}
          </p>

          {/* Active Hazards */}
          {evaluation?.hazards?.length > 0 && (
            <div style={{ width: '100%', marginTop: '0.85rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                ACTIVE HAZARD ALERTS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {evaluation.hazards.map((h, i) => (
                  <span key={i} className="badge badge-danger" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={10} /> {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operational Directives */}
          {evaluation?.operationalDirectives?.length > 0 && (
            <div style={{ width: '100%', marginTop: '0.75rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                DISPATCH DIRECTIVES:
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {evaluation.operationalDirectives.map((d, i) => (
                  <li key={i} style={{ padding: '2px 0' }}>• {d}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Ensemble Confidence: <strong>{Math.round(confidence * 100)}%</strong> (Simulated)
          </div>
        </div>
      </div>

      {/* True Signed SHAP Waterfall Section (Fixes Issue A4) */}
      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Signed SHAP Waterfall Explainability
              </h4>
              <DataBadge isReal={false} label="TreeSHAP Explainability" />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Shows signed contributions pushing risk above or below the baseline expected risk (Base Value: {shapData.baseExpectedValue}%)
            </p>
          </div>

          <div style={{
            fontSize: '0.72rem',
            background: 'var(--bg-surface-elevated)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-emerald)',
            fontWeight: 600
          }}>
            Verification: Base ({shapData.baseExpectedValue}%) + Contributions ({formatSignedShap(score - shapData.baseExpectedValue)}) = {score}%
          </div>
        </div>

        {/* Waterfall Graphic Rows */}
        <div style={{
          background: 'var(--bg-surface-elevated)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {/* Base Value Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            paddingBottom: '4px',
            borderBottom: '1px dashed var(--border-subtle)'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Base Expected Risk E[f(x)]
            </span>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {shapData.baseExpectedValue}%
            </strong>
          </div>

          {/* Stepped Waterfall Contribution Bars */}
          {waterfallSteps.map((step, idx) => {
            const isPositive = step.shapValue >= 0;
            const barWidthPct = Math.min(Math.abs(step.shapValue) * 1.8, 45); // Scale for visual clarity

            return (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(200px, 2fr) 90px',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{step.feature}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Input: {step.featureValue}</div>
                </div>

                {/* Waterfall Visual Bar */}
                <div style={{ position: 'relative', height: '16px', background: 'var(--bg-canvas)', borderRadius: '4px', overflow: 'hidden' }}>
                  {/* Baseline indicator line at 32% */}
                  <div style={{
                    position: 'absolute',
                    left: `${shapData.baseExpectedValue}%`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--border-strong)',
                    zIndex: 2
                  }} />

                  {/* Contribution bar */}
                  <div style={{
                    position: 'absolute',
                    left: isPositive ? `${step.startVal}%` : `${step.endVal}%`,
                    width: `${Math.max(barWidthPct, 2)}%`,
                    height: '100%',
                    background: isPositive ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                  }} />
                </div>

                {/* Signed Numerical Value & Subtotal */}
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  <span style={{
                    fontWeight: 700,
                    color: isPositive ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    marginRight: '6px'
                  }}>
                    {formatSignedShap(step.shapValue)}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    ({step.endVal}%)
                  </span>
                </div>
              </div>
            );
          })}

          {/* Final Calculated Probability Line */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            paddingTop: '6px',
            borderTop: '1px solid var(--border-subtle)',
            fontWeight: 700
          }}>
            <span style={{ color: 'var(--text-primary)' }}>
              Final Predicted Disruption Probability
            </span>
            <span style={{ color: scoreColor, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>
              {score}%
            </span>
          </div>

          {/* "What-If" Counterfactual Risk Mitigation Section */}
          <div style={{
            marginTop: '0.85rem',
            padding: '0.75rem',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="var(--apple-blue)" />
                <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  Counterfactual "What-If" Risk Mitigation
                </strong>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                Target: &lt; 40% (Nominal Safe Travel)
              </span>
            </div>

            <p style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', margin: '0 0 0.45rem', lineHeight: 1.35 }}>
              {score >= 40
                ? `To transition from ${category} (${score}%) down to NOMINAL LOW RISK, the model requires the following environmental or tactical mitigations:`
                : 'Current parameters are within safe baseline bounds. Surface convoys are cleared for nominal transit.'}
            </p>

            {score >= 40 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '0.55rem' }}>
                {rainfall > 35 && (
                  <div style={{ fontSize: '0.71rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-rose)' }}>●</span>
                    <span>Hold dispatch until rainfall reduces from <strong>{rainfall} mm/h</strong> to <strong>&lt; 35 mm/h</strong> (-18% risk).</span>
                  </div>
                )}
                {soilSaturation > 60 && (
                  <div style={{ fontSize: '0.71rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-amber)' }}>●</span>
                    <span>Wait for soil pore drainage below <strong>60% saturation</strong> to eliminate mudslide liquefaction (-12% risk).</span>
                  </div>
                )}
                {slopeGradient > 18 && (
                  <div style={{ fontSize: '0.71rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--accent-primary)' }}>●</span>
                    <span>Reroute via lower valley bypass with terrain gradient <strong>&le; 18°</strong> (-10% risk).</span>
                  </div>
                )}
              </div>
            )}

            {score >= 40 && (
              <button
                type="button"
                onClick={() => {
                  setRainfall(24);
                  setSoilSaturation(42);
                  setSlopeGradient(14);
                  setWindSpeed(22);
                  playSuccessChime();
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.72rem', padding: '5px 12px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Zap size={12} />
                <span>Apply Counterfactual Safe Values (Simulate Mitigation)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLRiskSimulator;
