import React, { useState } from 'react';
import { Truck, Train, Ship, Navigation, Compass, Check } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * MultiModalRadarChart Component (Phase 3 Requirement 6.2 - Decluttered & Adaptive)
 * Compares Road, Rail, Waterway, and UAV across Speed, Payload, Cost, Carbon, and Resilience.
 * Fully responsive without clipping axis labels in both Dark and Light themes.
 */
const MultiModalRadarChart = ({ modes = [] }) => {
  const [activeModeId, setActiveModeId] = useState(null);

  // 5 Normalized axes (0 - 100)
  const axes = [
    { key: 'speed', label: 'Cruising Speed', unit: 'km/h' },
    { key: 'payload', label: 'Payload Ceiling', unit: 'kg' },
    { key: 'costEfficiency', label: 'Cost Efficiency (1/₹)', unit: 'Score' },
    { key: 'carbonCleanliness', label: 'Low Carbon Footprint', unit: 'Score' },
    { key: 'resilience', label: 'Climate Resilience', unit: '%' }
  ];

  // Default mode normalization with CSS variable references for 100% theme contrast
  const modeData = [
    {
      id: 'road',
      name: 'High-Clearance Road Convoy',
      colorVar: 'var(--mode-road)',
      Icon: Truck,
      category: 'Highway & Pass',
      values: { speed: 55, payload: 75, costEfficiency: 70, carbonCleanliness: 45, resilience: 45 },
      caption: 'High versatility on open highways; highly vulnerable to mountain landslides and washouts.'
    },
    {
      id: 'rail',
      name: 'Mountain Feeder Rail',
      colorVar: 'var(--mode-rail)',
      Icon: Train,
      category: 'Bulk Corridor',
      values: { speed: 65, payload: 95, costEfficiency: 90, carbonCleanliness: 85, resilience: 65 },
      caption: 'Lowest cost per bulk tonne-km with minimal emissions; requires intact track ballast.'
    },
    {
      id: 'waterway',
      name: 'Inland River Freight Barge',
      colorVar: 'var(--mode-water)',
      Icon: Ship,
      category: 'Delta Lifeline',
      values: { speed: 25, payload: 90, costEfficiency: 85, carbonCleanliness: 80, resilience: 75 },
      caption: 'Crucial delta lifeline during road submergence; constrained by seasonal water draft.'
    },
    {
      id: 'drone',
      name: 'Heavy-Lift Cargo UAV',
      colorVar: 'var(--mode-drone)',
      Icon: Navigation,
      category: 'Autonomous Air',
      values: { speed: 95, payload: 30, costEfficiency: 40, carbonCleanliness: 90, resilience: 92 },
      caption: 'Rapid point-to-point transit over cut-off terrain; optimal for urgent medical supplies.'
    }
  ];

  // SVG Geometry - Generous 440 x 330 viewBox prevents text clipping on all 5 vertices
  const svgWidth = 440;
  const svgHeight = 330;
  const centerX = svgWidth / 2;
  const centerY = 165;
  const radius = 108;
  const totalAxes = axes.length;

  // Calculate polygon points for each mode
  const getCoordinates = (value, index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  const getAxisEnd = (index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Directional text anchor ensures labels on left/right edges never bleed out of viewBox
  const getLabelAnchor = (index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const cosVal = Math.cos(angle);
    if (cosVal > 0.3) return 'start';
    if (cosVal < -0.3) return 'end';
    return 'middle';
  };

  const getLabelCoords = (index) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);

    // Dynamic radius offset depending on orientation
    let labelRadius = radius + 14;
    let offsetX = 0;
    let offsetY = 0;

    if (Math.abs(cosVal) < 0.2) {
      // Top vertex (Cruising Speed)
      offsetY = -8;
    } else if (cosVal > 0.3) {
      // Right vertices (Payload Ceiling, Cost Efficiency)
      offsetX = 6;
      offsetY = sinVal > 0 ? 4 : -2;
    } else {
      // Left vertices (Low Carbon Footprint, Climate Resilience)
      offsetX = -6;
      offsetY = sinVal > 0 ? 4 : -2;
    }

    return {
      x: centerX + labelRadius * cosVal + offsetX,
      y: centerY + labelRadius * sinVal + offsetY
    };
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="var(--apple-blue)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Multi-Modal Capability Radar
            </h4>
            <DataBadge isReal={true} label="Multi-Modal Specs" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Comparative spider polygon across speed, bulk payload, unit cost, emissions &amp; resilience
          </p>
        </div>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {modeData.map((m) => {
            const isSelected = activeModeId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModeId(isSelected ? null : m.id)}
                style={{
                  fontSize: '0.74rem',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: `1.5px solid ${m.colorVar}`,
                  background: isSelected || !activeModeId ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: isSelected || !activeModeId ? m.colorVar : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                {m.Icon && <m.Icon size={12} />}
                <span>{m.name.split(' ')[0]}</span>
                {isSelected && <Check size={11} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Radar SVG + 2x2 Metric Detail Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {/* SVG Radar with generous viewBox and zero text truncation */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', maxWidth: '440px', height: 'auto', display: 'block' }}
          >
            {/* Concentric rings: 20%, 40%, 60%, 80%, 100% */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={radius * level}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth="1"
                strokeDasharray="2,3"
              />
            ))}

            {/* Concentric percentage tags */}
            {[0.4, 0.7, 1.0].map((level) => (
              <text
                key={level}
                x={centerX + 4}
                y={centerY - radius * level + 9}
                fill="var(--text-muted)"
                fontSize="7.5"
                fontWeight="500"
              >
                {Math.round(level * 100)}%
              </text>
            ))}

            {/* Axis spokes */}
            {axes.map((_, i) => {
              const pt = getAxisEnd(i);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="var(--border-subtle)"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Mode Polygons */}
            {modeData.map((m) => {
              if (activeModeId && activeModeId !== m.id) return null;
              const pointsStr = axes
                .map((a, i) => {
                  const pt = getCoordinates(m.values[a.key], i);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ');

              const isHighlighted = activeModeId === m.id;

              return (
                <g key={m.id} style={{ transition: 'all var(--transition-fast)' }}>
                  <polygon
                    points={pointsStr}
                    fill={m.colorVar}
                    fillOpacity={isHighlighted ? 0.32 : 0.18}
                    stroke={m.colorVar}
                    strokeWidth={isHighlighted ? 2.5 : 1.8}
                    strokeLinejoin="round"
                  />
                  {axes.map((a, i) => {
                    const pt = getCoordinates(m.values[a.key], i);
                    return (
                      <circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={isHighlighted ? 4.5 : 3.5}
                        fill={m.colorVar}
                        stroke="var(--bg-surface)"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Axis Labels with directional textAnchor (Zero clipping guaranteed) */}
            {axes.map((a, i) => {
              const pt = getLabelCoords(i);
              const anchor = getLabelAnchor(i);
              return (
                <text
                  key={i}
                  x={pt.x}
                  y={pt.y}
                  textAnchor={anchor}
                  fill="var(--text-secondary)"
                  fontSize="9.5"
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {a.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend & Detail List (Clean 2x2 Grid on desktop, 1 col on mobile) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '0.65rem'
        }}>
          {modeData.map((m) => {
            const isDimmed = activeModeId && activeModeId !== m.id;
            const isSelected = activeModeId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setActiveModeId(isSelected ? null : m.id)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md, 14px)',
                  background: isSelected ? 'var(--bg-surface)' : 'var(--bg-card)',
                  border: `1.5px solid ${isSelected ? m.colorVar : 'var(--border-subtle)'}`,
                  borderLeft: `4px solid ${m.colorVar}`,
                  opacity: isDimmed ? 0.38 : 1,
                  cursor: 'pointer',
                  transition: 'all var(--timing-fast) var(--ease-spring)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  boxShadow: isSelected ? 'var(--elevation-2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-xs, 6px)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <m.Icon size={14} color={m.colorVar} />
                    </div>
                    <span>{m.name}</span>
                  </strong>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'var(--bg-surface)',
                    color: m.colorVar,
                    border: `1px solid ${m.colorVar}`
                  }}>
                    {m.values.resilience}%
                  </span>
                </div>

                <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.35, margin: '2px 0' }}>
                  {m.caption}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  flexWrap: 'wrap'
                }}>
                  <span>Speed: <strong style={{ color: 'var(--text-primary)' }}>{m.values.speed}</strong></span>
                  <span>•</span>
                  <span>Payload: <strong style={{ color: 'var(--text-primary)' }}>{m.values.payload}</strong></span>
                  <span>•</span>
                  <span>Cost Eff: <strong style={{ color: 'var(--text-primary)' }}>{m.values.costEfficiency}</strong></span>
                  <span>•</span>
                  <span>Carbon: <strong style={{ color: 'var(--text-primary)' }}>{m.values.carbonCleanliness}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Takeaway Pill */}
      <div style={{
        marginTop: '0.85rem',
        padding: '6px 12px',
        borderRadius: '6px',
        background: 'var(--bg-surface-elevated)',
        fontSize: '0.74rem',
        color: 'var(--text-secondary)',
        borderLeft: '3px solid var(--accent-primary)',
        lineHeight: 1.35
      }}>
        <strong>Operational Insight:</strong> Cargo UAVs maintain 92% resilience during road closures; Rail and Waterway provide optimal bulk freight economics.
      </div>
    </div>
  );
};

export default MultiModalRadarChart;
