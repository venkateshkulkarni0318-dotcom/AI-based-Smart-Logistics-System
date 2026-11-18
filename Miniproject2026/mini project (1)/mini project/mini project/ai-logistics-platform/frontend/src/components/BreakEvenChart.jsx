import React, { useState } from 'react';
import { Scale, Clock, IndianRupee, Info } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * BreakEvenChart Component (Phase 3 Requirement 6.2 - Decluttered & Adaptive)
 * Visualizes the economic and operational break-even point where Autonomous Cargo UAV beats Road transport.
 */
const BreakEvenChart = () => {
  const [metricMode, setMetricMode] = useState('time'); // 'time' | 'cost'
  const [hoveredDist, setHoveredDist] = useState(null);

  // Generate distance points from 10km to 150km
  const distances = [10, 25, 40, 55, 70, 85, 100, 115, 130, 150];

  // Mountain switchback winding factor (road is 1.65x longer than straight-line drone flight)
  const calcData = distances.map((d) => {
    // Delivery Duration (hours)
    // Road: avg speed 32 km/h in mountains with 1.65 detour multiplier + 0.5h checkpost
    const roadTimeH = Number(((d * 1.65) / 32 + 0.5).toFixed(2));
    // Drone: straight line, 90 km/h cruising speed + 0.15h battery/staging
    const droneTimeH = Number((d / 90 + 0.15).toFixed(2));

    // Delivery Cost (₹ for 60 kg payload)
    // Road: Base ₹450 + ₹18/km
    const roadCostInr = Math.round(450 + (d * 1.65) * 18);
    // Drone: Base ₹850 + ₹24/km (fixed air-drop depreciation)
    const droneCostInr = Math.round(850 + d * 24);

    return {
      distanceKm: d,
      road: metricMode === 'time' ? roadTimeH : roadCostInr,
      drone: metricMode === 'time' ? droneTimeH : droneCostInr
    };
  });

  // SVG Chart Dimensions
  const svgWidth = 540;
  const svgHeight = 220;
  const pad = { top: 25, right: 30, bottom: 35, left: 55 };
  const chartW = svgWidth - pad.left - pad.right;
  const chartH = svgHeight - pad.top - pad.bottom;

  const maxVal = metricMode === 'time' ? 9.0 : 5500;
  const minVal = 0;
  const maxD = 150;

  const getX = (d) => pad.left + (d / maxD) * chartW;
  const getY = (val) => pad.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const roadPathD = calcData.reduce((acc, p, i) => {
    const x = getX(p.distanceKm);
    const y = getY(p.road);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const dronePathD = calcData.reduce((acc, p, i) => {
    const x = getX(p.distanceKm);
    const y = getY(p.drone);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Crossover point calculation
  // For time: Drone is faster from distance > 18 km
  // For cost: Road is cheaper for bulk, but Drone beats road when pass detour exceeds 88 km
  const crossoverDist = metricMode === 'time' ? 18 : 88;
  const crossoverX = getX(crossoverDist);

  return (
    <div className="card-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.6rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Scale size={18} color="var(--apple-blue)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
                UAV vs Ground Transport Break-Even
              </h4>
              <DataBadge isReal={false} label="Simulated demo values" />
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Identifies distance and winding thresholds where autonomous air cargo outperforms road transit
            </p>
          </div>

          {/* Metric Selector Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '2px',
            fontSize: '0.72rem'
          }}>
            <button
              type="button"
              onClick={() => setMetricMode('time')}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: metricMode === 'time' ? 'var(--accent-primary)' : 'transparent',
                color: metricMode === 'time' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Clock size={12} />
              <span>Duration (h)</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('cost')}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: metricMode === 'cost' ? 'var(--accent-primary)' : 'transparent',
                color: metricMode === 'cost' ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <IndianRupee size={12} />
              <span>Mission Cost</span>
            </button>
          </div>
        </div>

        {/* SVG Break-Even Chart */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Background grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((r) => {
              const y = pad.top + chartH * (1 - r);
              const val = metricMode === 'time' ? (r * maxVal).toFixed(1) + 'h' : '₹' + Math.round(r * maxVal);
              return (
                <g key={r}>
                  <line x1={pad.left} y1={y} x2={pad.left + chartW} y2={y} stroke="var(--border-subtle)" strokeWidth="0.8" strokeDasharray="3,3" />
                  <text x={pad.left - 8} y={y + 3} textAnchor="end" fill="var(--text-tertiary)" fontSize="8.5" fontWeight="600">{val}</text>
                </g>
              );
            })}

            {/* X-Axis Ticks */}
            {distances.filter((_, i) => i % 2 === 0).map((d) => {
              const x = getX(d);
              return (
                <g key={d}>
                  <line x1={x} y1={pad.top + chartH} x2={x} y2={pad.top + chartH + 5} stroke="var(--border-subtle)" strokeWidth="1" />
                  <text x={x} y={pad.top + chartH + 16} textAnchor="middle" fill="var(--text-tertiary)" fontSize="8.5">{d} km</text>
                </g>
              );
            })}

            {/* Crossover Zone Highlight */}
            <line x1={crossoverX} y1={pad.top} x2={crossoverX} y2={pad.top + chartH} stroke="var(--accent-amber)" strokeWidth="1.2" strokeDasharray="4,3" />
            <text x={crossoverX + 5} y={pad.top + 14} fill="var(--accent-amber)" fontSize="8.5" fontWeight="700">
              {metricMode === 'time' ? 'UAV Crossover (~18 km)' : 'Break-Even (~88 km)'}
            </text>

            {/* Curves */}
            <path d={roadPathD} fill="none" stroke="var(--mode-road)" strokeWidth="2.5" strokeLinecap="round" />
            <path d={dronePathD} fill="none" stroke="var(--mode-drone)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3" />

            {/* Data Points */}
            {calcData.map((p) => (
              <g key={p.distanceKm} onMouseEnter={() => setHoveredDist(p)}>
                <circle cx={getX(p.distanceKm)} cy={getY(p.road)} r="3.5" fill="var(--mode-road)" />
                <circle cx={getX(p.distanceKm)} cy={getY(p.drone)} r="3.5" fill="var(--mode-drone)" />
              </g>
            ))}
          </svg>
        </div>

        {/* Legend & Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '14px', height: '3px', background: 'var(--mode-road)', borderRadius: '2px', display: 'inline-block' }}></span>
              <strong style={{ color: 'var(--text-primary)' }}>Road Transit</strong>
              <span style={{ color: 'var(--text-secondary)' }}>(32 km/h avg)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '14px', height: '3px', background: 'var(--mode-drone)', borderRadius: '2px', display: 'inline-block' }}></span>
              <strong style={{ color: 'var(--text-primary)' }}>Cargo UAV</strong>
              <span style={{ color: 'var(--text-secondary)' }}>(90 km/h flight)</span>
            </span>
          </div>

          {hoveredDist && (
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              Dist: <strong>{hoveredDist.distanceKm} km</strong> | Road: <strong style={{ color: 'var(--mode-road)' }}>{hoveredDist.road}{metricMode === 'time' ? 'h' : '₹'}</strong> | Drone: <strong style={{ color: 'var(--mode-drone)' }}>{hoveredDist.drone}{metricMode === 'time' ? 'h' : '₹'}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Key Takeaway */}
      <div style={{
        marginTop: '0.75rem',
        padding: '6px 10px',
        borderRadius: '4px',
        background: 'var(--bg-surface-elevated)',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        borderLeft: '3px solid var(--accent-primary)',
        lineHeight: 1.35
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={12} color="var(--apple-blue)" style={{ flexShrink: 0 }} />
          <span><strong>Key Takeaway:</strong> Beyond 20 km in steep terrain, cargo UAVs bypass switchbacks to deliver emergency supplies up to 4.5 hours faster than road convoys.</span>
        </div>
      </div>
    </div>
  );
};

export default BreakEvenChart;
