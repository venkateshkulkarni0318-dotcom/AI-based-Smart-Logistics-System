import React, { useState, useEffect } from 'react';
import { Layers, Zap, Truck, Navigation, Ship, Train } from 'lucide-react';
import { recommendMode } from '../services/api';

const MODE_ICONS = {
  road: Truck,
  drone: Navigation,
  waterway: Ship,
  rail: Train
};

const MultimodalPanel = ({ modes = [], activeMode, onSelectMode }) => {
  const [distanceKm, setDistanceKm] = useState(85);
  const [payloadKg, setPayloadKg] = useState(60);
  const [urgency, setUrgency] = useState('STANDARD');
  const [weather, setWeather] = useState('Clear');
  const [terrain, setTerrain] = useState('Mountain');
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Compute live recommendation whenever inputs change
  useEffect(() => {
    let isMounted = true;
    setCalculating(true);

    recommendMode({
      distanceKm,
      payloadWeightKg: payloadKg,
      urgencyLevel: urgency,
      weatherCondition: weather,
      terrainType: terrain
    })
      .then(res => {
        if (isMounted && res?.success) {
          setRecommendationResult(res);
          if (res.recommendedModeId && onSelectMode) {
            onSelectMode(res.recommendedModeId);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setCalculating(false);
      });

    return () => { isMounted = false; };
  }, [distanceKm, payloadKg, urgency, weather, terrain]);

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--apple-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Unified Multi-Modal Transport Architecture
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Integrated data schema across Road, Rail, Waterway &amp; Autonomous Air Cargo
          </span>
        </div>

        <span className="badge badge-info">
          4 Transport Channels Integrated
        </span>
      </div>

      {/* Mode Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        {modes.map((mode) => {
          const isSelected = activeMode === mode.id;
          const ModeIcon = MODE_ICONS[mode.id] || Truck;
          return (
            <div
              key={mode.id}
              onClick={() => onSelectMode && onSelectMode(mode.id)}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: isSelected ? 'var(--accent-primary-subtle)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              tabIndex="0"
              role="button"
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectMode && onSelectMode(mode.id);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--apple-radius-sm)',
                  background: 'var(--apple-blue-subtle)',
                  color: 'var(--apple-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ModeIcon size={18} />
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                  {mode.statusBadge || mode.category}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {mode.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Avg Speed: <strong style={{ color: 'var(--text-primary)' }}>{mode.avgSpeedKmh} km/h</strong></div>
                <div>Payload: <strong style={{ color: 'var(--text-primary)' }}>{mode.payloadCapacityKg?.toLocaleString()} kg</strong></div>
                <div>Unit Cost: <strong style={{ color: 'var(--accent-primary)' }}>₹{mode.costPerKmKg}/km-kg</strong></div>
                <div>Resilience: <strong style={{ color: mode.resilienceScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>{mode.resilienceScore}%</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Mode Decision Simulator */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-canvas)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="var(--apple-blue)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Interactive Mode Decision &amp; Trade-off Engine (Objective 04)
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Simulate route constraints to calculate comparative time, carbon, cost, and risk scores across modes
            </p>
          </div>
          {calculating && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evaluating options...</span>}
        </div>

        {/* Inputs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Transit Distance: <strong>{distanceKm} km</strong>
            </label>
            <input
              type="range"
              min="10"
              max="350"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Transit distance slider in kilometers"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Cargo Weight: <strong>{payloadKg} kg</strong>
            </label>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={payloadKg}
              onChange={(e) => setPayloadKg(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              aria-label="Cargo weight slider in kilograms"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Urgency Level
            </label>
            <select
              className="input-control"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              aria-label="Urgency level selector"
            >
              <option value="STANDARD">Standard Logistics</option>
              <option value="HIGH_URGENCY">High Urgency</option>
              <option value="CRITICAL_EMERGENCY">Critical Emergency (SOS)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Weather Scenario
            </label>
            <select
              className="input-control"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              aria-label="Weather scenario selector"
            >
              <option value="Clear">Clear Skies</option>
              <option value="Moderate Rain">Moderate Rain (15 mm/h)</option>
              <option value="Severe Rain / Landslide">Severe Rain / Landslide Alert</option>
              <option value="Gale Winds">Gale-Force Ridge Winds</option>
            </select>
          </div>
        </div>

        {/* Live Recommendation Result Banner */}
        {recommendationResult?.recommended && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: '6px',
            background: 'var(--bg-surface-elevated)',
            borderLeft: '4px solid var(--accent-primary)',
            border: '1px solid var(--border-subtle)',
            borderLeftWidth: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recommended: {recommendationResult.recommended.name}
              </span>
              <span className="badge badge-success">
                Confidence: {Math.round((recommendationResult.recommended.confidenceScore || 0.94) * 100)}%
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '2px 0 8px' }}>
              {recommendationResult.recommended.rationale}
            </p>

            {/* Quick Metrics Comparison */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              <div>Est. Duration: <strong style={{ color: 'var(--text-primary)' }}>{recommendationResult.recommended.durationFormatted}</strong></div>
              <div>Est. Transit Cost: <strong style={{ color: 'var(--accent-primary)' }}>₹{recommendationResult.recommended.estimatedCostInr}</strong></div>
              <div>Carbon Footprint: <strong style={{ color: 'var(--text-primary)' }}>{recommendationResult.recommended.carbonKg} kg CO₂</strong></div>
              <div>Risk Index: <strong style={{ color: recommendationResult.recommended.riskScore > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>{recommendationResult.recommended.riskScore}/100</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultimodalPanel;
