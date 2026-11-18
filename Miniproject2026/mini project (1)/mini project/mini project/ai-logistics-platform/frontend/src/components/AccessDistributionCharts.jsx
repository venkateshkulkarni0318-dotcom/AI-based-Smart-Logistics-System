import React, { useState } from 'react';
import { Info } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * AccessDistributionCharts Component (Phase 3 Requirement 6.2)
 * Dual Visualizations:
 * 1. Histogram: Settlement count by annual isolation duration (days/year).
 * 2. Scatter Plot: Settlement Population vs Annual Cutoff Days (Quadrant vulnerability mapping).
 */
const AccessDistributionCharts = () => {
  const [hoveredScatter, setHoveredScatter] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Histogram buckets
  const histogramBuckets = [
    { range: '0-30 days', count: 18, pct: '45%', color: '#10b981', label: 'Minimal Cutoff', note: 'All-weather national highways' },
    { range: '31-60 days', count: 10, pct: '25%', color: '#38bdf8', label: 'Moderate Cutoff', note: 'Seasonal monsoon washouts' },
    { range: '61-120 days', count: 6, pct: '15%', color: '#f59e0b', label: 'Substantial Cutoff', note: 'Precipitous gorge roads & floodplains' },
    { range: '121-180 days', count: 4, pct: '10%', color: '#f97316', label: 'Severe Cutoff', note: 'High Himalayan passes (Spiti/Kaza)' },
    { range: '180+ days', count: 2, pct: '5%', color: '#f43f5e', label: 'Extreme Cutoff', note: 'Zanskar valley (Padum/Kibber)' }
  ];

  // Scatter plot points (Population vs Cutoff Days)
  const scatterPoints = [
    { name: 'Padum (Zanskar)', pop: 13200, days: 175, access: 24, hazard: 'Snow & Avalanche', category: 'Extreme Risk' },
    { name: 'Kaza (Spiti)', pop: 3200, days: 150, access: 32, hazard: 'Snowpack >4m', category: 'High Risk' },
    { name: 'Kibber', pop: 450, days: 185, access: 18, hazard: 'High Altitude Blizzard', category: 'Extreme Risk' },
    { name: 'Majuli Island', pop: 168000, days: 75, access: 42, hazard: 'Monsoon Flood Inundation', category: 'High Humanitarian Load' },
    { name: 'Dharchula / Gunji', pop: 2400, days: 110, access: 38, hazard: 'Gorge Debris Flows', category: 'Moderate Risk' },
    { name: 'Malana', pop: 1720, days: 95, access: 40, hazard: 'Steep Gorge Rockfalls', category: 'Moderate Risk' },
    { name: 'Tawang', pop: 11200, days: 45, access: 68, hazard: 'Sela Pass Snow Slush', category: 'Low-Moderate Risk' },
    { name: 'Lachung (Sikkim)', pop: 2800, days: 60, access: 52, hazard: 'Flash Flood Washout', category: 'Moderate Risk' },
    { name: 'Pithoragarh Outpost', pop: 5400, days: 25, access: 78, hazard: 'Occasional Landslip', category: 'Minimal Cutoff' },
    { name: 'Leh District Hub', pop: 31000, days: 20, access: 82, hazard: 'Highway Clearing Active', category: 'Strategic Logistics Base' }
  ];

  // Scatter plot SVG dimensions
  const scatterWidth = 520;
  const scatterHeight = 240;
  const pScatter = { top: 25, right: 30, bottom: 40, left: 55 };
  const graphW = scatterWidth - pScatter.left - pScatter.right;
  const graphH = scatterHeight - pScatter.top - pScatter.bottom;

  const maxPop = 35000; // clamp for normalized display (Majuli indicated on edge)
  const maxDays = 200;

  const getScatterX = (pop) => {
    const clamped = Math.min(pop, maxPop);
    return pScatter.left + (clamped / maxPop) * graphW;
  };
  const getScatterY = (days) => {
    return pScatter.top + (1 - days / maxDays) * graphH;
  };

  const getColorByDays = (days) => {
    if (days >= 150) return '#f43f5e';
    if (days >= 90) return '#f97316';
    if (days >= 40) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.25rem'
    }}>
      {/* Chart 1: Isolation Duration Histogram */}
      <div className="card-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Cutoff Duration Frequency
              </h3>
              <DataBadge isReal={false} label="Simulated Census" />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Distribution of 40 monitored settlements across annual isolation brackets.
            </p>
          </div>
        </div>

        {/* Histogram Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
          {histogramBuckets.map((b, i) => {
            const isHovered = hoveredBar === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: isHovered ? b.color : 'var(--text-primary)' }}>
                    {b.range} ({b.label})
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <strong>{b.count} settlements</strong> ({b.pct})
                  </span>
                </div>
                <div style={{ width: '100%', height: '18px', background: 'var(--bg-surface-elevated)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                  <div style={{
                    width: `${(b.count / 20) * 100}%`,
                    height: '100%',
                    background: b.color,
                    transition: 'width 0.4s ease',
                    borderRadius: '3px'
                  }} />
                  {isHovered && (
                    <span style={{ position: 'absolute', right: '6px', top: '2px', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {b.note}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={12} color="var(--apple-blue)" />
          <span>15% of settlements endure over 120 days of total ground transit severance every single year.</span>
        </div>
      </div>

      {/* Chart 2: Population vs Seasonal Cutoff Days Scatter Plot */}
      <div className="card-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Population vs Annual Cutoff Days
              </h3>
              <DataBadge isReal={false} label="Simulated Scatter" />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Vulnerability quadrant: High population + Long cutoff = Priority prepositioning hub.
            </p>
          </div>
        </div>

        {/* SVG Scatter Plot */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <svg viewBox={`0 0 ${scatterWidth} ${scatterHeight}`} style={{ width: '100%', minWidth: '380px', height: 'auto', display: 'block' }}>
            {/* Grid Lines */}
            {[0, 50, 100, 150, 200].map((days) => {
              const y = getScatterY(days);
              return (
                <g key={days}>
                  <line x1={pScatter.left} y1={y} x2={scatterWidth - pScatter.right} y2={y} stroke="var(--border-subtle)" strokeDasharray="2 2" />
                  <text x={pScatter.left - 6} y={y + 3} fill="var(--text-muted)" fontSize="9" textAnchor="end">
                    {days}d
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {[0, 10000, 20000, 30000].map((pop) => {
              const x = getScatterX(pop);
              return (
                <g key={pop}>
                  <line x1={x} y1={pScatter.top} x2={x} y2={scatterHeight - pScatter.bottom} stroke="var(--border-subtle)" strokeDasharray="2 2" />
                  <text x={x} y={scatterHeight - pScatter.bottom + 14} fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                    {pop === 0 ? '0' : `${pop / 1000}k`}
                  </text>
                </g>
              );
            })}

            {/* Axis Title */}
            <text x={scatterWidth / 2} y={scatterHeight - 8} fill="var(--text-secondary)" fontSize="9.5" textAnchor="middle" fontWeight={600}>
              Settlement Population →
            </text>
            <text x="12" y={scatterHeight / 2} fill="var(--text-secondary)" fontSize="9" textAnchor="middle" transform={`rotate(-90 12 ${scatterHeight / 2})`} fontWeight={600}>
              Annual Cutoff Days ↑
            </text>

            {/* High-Risk Critical Quadrant Shading (Top Right) */}
            <rect
              x={getScatterX(8000)}
              y={getScatterY(200)}
              width={scatterWidth - pScatter.right - getScatterX(8000)}
              height={getScatterY(100) - getScatterY(200)}
              fill="rgba(244, 63, 94, 0.08)"
              stroke="rgba(244, 63, 94, 0.3)"
              strokeDasharray="3 3"
            />
            <text x={scatterWidth - pScatter.right - 8} y={pScatter.top + 16} fill="#f43f5e" fontSize="8.5" textAnchor="end" fontWeight={700}>
              CRITICAL QUADRANT (High Pop + Long Cutoff)
            </text>

            {/* Scatter Points */}
            {scatterPoints.map((pt, i) => {
              const cx = getScatterX(pt.pop);
              const cy = getScatterY(pt.days);
              const color = getColorByDays(pt.days);
              const isHovered = hoveredScatter?.name === pt.name;

              return (
                <g
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredScatter(pt)}
                  onMouseLeave={() => setHoveredScatter(null)}
                >
                  <circle cx={cx} cy={cy} r="12" fill="transparent" />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 5}
                    fill={color}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx + 8}
                    y={cy + 3}
                    fill={isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
                    fontSize={isHovered ? '9.5' : '8'}
                    fontWeight={isHovered ? 700 : 500}
                  >
                    {pt.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Scatter Hover Tooltip */}
          {hoveredScatter && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '60px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '0.72rem',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              zIndex: 10
            }}>
              <strong>{hoveredScatter.name}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Pop: {hoveredScatter.pop.toLocaleString()} | Cutoff: <strong style={{ color: getColorByDays(hoveredScatter.days) }}>{hoveredScatter.days} days/yr</strong>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Access Score: {hoveredScatter.access}% | Hazard: {hoveredScatter.hazard}
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={12} color="var(--apple-blue)" />
          <span>Settlements in the top-right quadrant (like Padum) require priority multi-month medical and ration stockpiling before pass closures.</span>
        </div>
      </div>
    </div>
  );
};

export default AccessDistributionCharts;
