import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * CostVsTimeBubbleChart Component (Phase 3 Requirement 6.2 - Decluttered & Adaptive)
 * Compares Cost vs Time vs Carbon Intensity, where bubble area represents payload capacity.
 */
const CostVsTimeBubbleChart = () => {
  const [hoveredMode, setHoveredMode] = useState(null);

  // Normalized operational profiles for 100 km transit
  const data = [
    {
      id: 'road',
      name: 'Road Convoy (6x6 All-Terrain)',
      timeHours: 4.8,
      costInr: 1800,
      payloadKg: 8500,
      bubbleRadius: 18,
      carbonGPerTonneKm: 145,
      color: 'var(--mode-road)'
    },
    {
      id: 'rail',
      name: 'Mountain Feeder Rail',
      timeHours: 3.2,
      costInr: 650,
      payloadKg: 180000,
      bubbleRadius: 28,
      carbonGPerTonneKm: 28,
      color: 'var(--mode-rail)'
    },
    {
      id: 'waterway',
      name: 'Inland River Barge (Brahmaputra)',
      timeHours: 6.5,
      costInr: 420,
      payloadKg: 250000,
      bubbleRadius: 32,
      carbonGPerTonneKm: 34,
      color: 'var(--mode-water)'
    },
    {
      id: 'drone',
      name: 'Heavy-Lift Cargo UAV',
      timeHours: 1.2,
      costInr: 3250,
      payloadKg: 150,
      bubbleRadius: 12,
      carbonGPerTonneKm: 18,
      color: 'var(--mode-drone)'
    }
  ];

  // Dimensions
  const svgWidth = 540;
  const svgHeight = 220;
  const pad = { top: 25, right: 35, bottom: 40, left: 60 };
  const chartW = svgWidth - pad.left - pad.right;
  const chartH = svgHeight - pad.top - pad.bottom;

  const maxTime = 8.0; // Hours
  const maxCost = 4000; // INR

  const getX = (t) => pad.left + (t / maxTime) * chartW;
  const getY = (c) => pad.top + chartH - (c / maxCost) * chartH;

  return (
    <div className="card-panel" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Activity size={18} color="var(--apple-blue)" />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Cost vs Time vs Carbon Bubble Matrix
              </h4>
              <DataBadge isReal={true} label="Multi-Modal Specs" />
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Transit duration (X) vs Cost (Y); bubble size indicates payload; color indicates mode
            </p>
          </div>

          <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>100 km Corridor Standard</span>
        </div>

        {/* SVG Bubble Chart */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Grid Lines */}
            {[0, 1000, 2000, 3000, 4000].map((c) => {
              const y = getY(c);
              return (
                <g key={c}>
                  <line x1={pad.left} y1={y} x2={pad.left + chartW} y2={y} stroke="var(--border-subtle)" strokeWidth="0.8" strokeDasharray="3,3" />
                  <text x={pad.left - 8} y={y + 3} textAnchor="end" fill="var(--text-tertiary)" fontSize="8.5" fontWeight="600">₹{c}</text>
                </g>
              );
            })}

            {/* X-Axis Ticks (Hours) */}
            {[0, 2, 4, 6, 8].map((t) => {
              const x = getX(t);
              return (
                <g key={t}>
                  <line x1={x} y1={pad.top} x2={x} y2={pad.top + chartH} stroke="var(--border-subtle)" strokeWidth="0.8" strokeDasharray="3,3" />
                  <text x={x} y={pad.top + chartH + 15} textAnchor="middle" fill="var(--text-tertiary)" fontSize="8.5" fontWeight="600">{t}h</text>
                </g>
              );
            })}

            {/* Axis Titles */}
            <text x={pad.left + chartW / 2} y={svgHeight - 6} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="700">
              Transit Duration (Hours)
            </text>
            <text transform={`rotate(-90)`} x={-(pad.top + chartH / 2)} y={16} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="700">
              Total Transit Cost (₹ / 100km)
            </text>

            {/* Bubble Rendering */}
            {data.map((m) => {
              const cx = getX(m.timeHours);
              const cy = getY(m.costInr);
              const isHovered = hoveredMode?.id === m.id;

              return (
                <g
                  key={m.id}
                  style={{ cursor: 'pointer', transition: 'all 200ms ease' }}
                  onMouseEnter={() => setHoveredMode(m)}
                  onMouseLeave={() => setHoveredMode(null)}
                >
                  {/* Outer glow on hover */}
                  {isHovered && (
                    <circle cx={cx} cy={cy} r={m.bubbleRadius + 5} fill="none" stroke={m.color} strokeWidth="2" strokeDasharray="3,3" />
                  )}
                  {/* Main Bubble */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={m.bubbleRadius}
                    fill={m.color}
                    fillOpacity={isHovered ? 0.55 : 0.25}
                    stroke={m.color}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                  />
                  {/* Center marker */}
                  <circle cx={cx} cy={cy} r="3" fill="var(--bg-surface)" stroke={m.color} strokeWidth="1.5" />
                  {/* Label */}
                  <text
                    x={cx}
                    y={cy - m.bubbleRadius - 6}
                    textAnchor="middle"
                    fill={isHovered ? m.color : 'var(--text-primary)'}
                    fontSize="9"
                    fontWeight={isHovered ? 800 : 600}
                  >
                    {m.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.74rem' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {data.map((m) => (
              <span key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{m.name.split(' ')[0]}: <strong style={{ color: 'var(--text-primary)' }}>{m.carbonGPerTonneKm}g</strong> CO₂/t-km</span>
              </span>
            ))}
          </div>

          {hoveredMode && (
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
              <strong>{hoveredMode.name.split(' ')[0]}:</strong> {hoveredMode.timeHours}h | ₹{hoveredMode.costInr} | {hoveredMode.payloadKg.toLocaleString()} kg
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Caption */}
      <div style={{
        marginTop: '0.75rem',
        padding: '6px 10px',
        borderRadius: '4px',
        background: 'var(--bg-surface-elevated)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        borderLeft: '3px solid var(--accent-primary)',
        lineHeight: 1.45
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Efficiency Frontier:</strong> UAVs provide minimum latency for life-critical medicine (1.2h), whereas Waterway and Rail optimize unit bulk economics (₹420-₹650 per 100km).
      </div>
    </div>
  );
};

export default CostVsTimeBubbleChart;
