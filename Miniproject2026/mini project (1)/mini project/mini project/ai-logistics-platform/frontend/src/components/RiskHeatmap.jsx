import React, { useState } from 'react';
import DataBadge from './DataBadge';

/**
 * RiskHeatmap Component (Phase 3 Requirement 6.2)
 * Matrix of Rainfall Intensity (X-axis) × Soil Saturation (Y-axis) -> Disruption Risk (%)
 */
const RiskHeatmap = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const rainLevels = [
    { label: '0-10 mm/h', val: 5 },
    { label: '10-25 mm/h', val: 18 },
    { label: '25-50 mm/h', val: 38 },
    { label: '50-80 mm/h', val: 65 },
    { label: '80-120 mm/h', val: 100 }
  ];

  const soilLevels = [
    { label: '90-100% (Saturated)', val: 95 },
    { label: '70-90% (Wet)', val: 80 },
    { label: '50-70% (Damp)', val: 60 },
    { label: '30-50% (Normal)', val: 40 },
    { label: '10-30% (Dry)', val: 20 }
  ];

  // Disruption probability calculation: f(rain, soil)
  const calculateRisk = (rain, soil) => {
    // Non-linear interaction between rainfall and ground saturation
    const base = (rain * 0.55) + (soil * 0.45);
    const multiplier = (rain > 50 && soil > 70) ? 1.25 : 1.0;
    return Math.min(99, Math.round(base * multiplier * 0.85));
  };

  const getRiskColor = (risk) => {
    if (risk < 35) return { bg: 'var(--accent-emerald-subtle)', border: 'var(--accent-emerald)', text: 'var(--accent-emerald)', level: 'LOW' };
    if (risk < 60) return { bg: 'var(--accent-amber-subtle)', border: 'var(--accent-amber)', text: 'var(--accent-amber)', level: 'MODERATE' };
    if (risk < 75) return { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', text: 'var(--accent-amber)', level: 'HIGH' };
    return { bg: 'var(--accent-rose-subtle)', border: 'var(--accent-rose)', text: 'var(--accent-rose)', level: 'CRITICAL' };
  };

  const getProtocol = (risk) => {
    if (risk < 35) return 'Standard road convoys operational. Normal routing active.';
    if (risk < 60) return 'Precautionary transit. 4WD vehicles required; heavy 3-axle trucks restricted.';
    if (risk < 75) return 'Ground corridor standby. Escorted single-file transit only; drone recon alert.';
    return 'GROUND PASS SUSPENDED. High risk of debris flow/landslide. Activate UAV airlift.';
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Terrain Vulnerability Matrix: Rainfall × Soil Saturation
            </h3>
            <DataBadge isReal={false} label="Simulated ML Matrix" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            2D Disruption Probability surface modeled via Random Forest interaction terms.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }} /> Low (&lt;35%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '2px' }} /> Moderate (35-60%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#f97316', borderRadius: '2px' }} /> High (60-75%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', background: '#f43f5e', borderRadius: '2px' }} /> Critical (75%+)
          </span>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: '580px' }}>
          {/* Top Label for X-Axis */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '6px' }}>
            Precipitation Intensity (mm/h) →
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(5, 1fr)', gap: '4px' }}>
            {/* Header row */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              Soil Saturation ↓
            </div>
            {rainLevels.map((r, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '4px' }}>
                {r.label}
              </div>
            ))}

            {/* Matrix rows */}
            {soilLevels.map((s, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingRight: '6px'
                }}>
                  {s.label}
                </div>
                {rainLevels.map((r, colIdx) => {
                  const risk = calculateRisk(r.val, s.val);
                  const color = getRiskColor(risk);
                  const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;

                  return (
                    <div
                      key={colIdx}
                      onClick={() => setSelectedCell({ row: rowIdx, col: colIdx, rain: r.label, soil: s.label, risk, color, protocol: getProtocol(risk) })}
                      onMouseEnter={() => setSelectedCell({ row: rowIdx, col: colIdx, rain: r.label, soil: s.label, risk, color, protocol: getProtocol(risk) })}
                      style={{
                        height: '52px',
                        background: color.bg,
                        border: isSelected ? `2px solid ${color.border}` : `1px solid ${color.border}44`,
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                        boxShadow: isSelected ? `0 4px 12px ${color.border}66` : 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: color.text }}>
                        {risk}%
                      </span>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                        {color.level}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Cell Detail Panel */}
      <div style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Selected Scenario: <strong>{selectedCell ? `${selectedCell.rain} at ${selectedCell.soil}` : 'Click any matrix cell above'}</strong>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '3px' }}>
            Operational Protocol: <strong>{selectedCell ? selectedCell.protocol : 'Select a cell to view dispatch protocol'}</strong>
          </div>
        </div>

        {selectedCell && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: selectedCell.color.bg,
              border: `1px solid ${selectedCell.color.border}`,
              color: selectedCell.color.text,
              padding: '4px 10px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.82rem'
            }}>
              {selectedCell.risk}% Disruption Probability ({selectedCell.color.level})
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: At high soil moisture (&gt;70%), even moderate rain (&gt;25 mm/h) triggers landslide risk exceeding the 70% critical safety threshold.
      </div>
    </div>
  );
};

export default RiskHeatmap;
