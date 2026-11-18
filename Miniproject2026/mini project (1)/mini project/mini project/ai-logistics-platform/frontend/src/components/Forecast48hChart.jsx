import React, { useState } from 'react';
import { CloudRain, CloudLightning, Sun, CloudSun, CloudDrizzle, AlertTriangle } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * Forecast48hChart Component (Phase 3 Requirement 6.2)
 * 48-Hour Disruption Risk Forecast with 90% confidence band & 7-Day weather/risk outlook.
 */
const Forecast48hChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 48-hour forecast points at 4-hour intervals
  const points = [
    { hour: 'T+0h', risk: 28, lower: 22, upper: 34, rain: 2, note: 'Normal conditions' },
    { hour: 'T+4h', risk: 32, lower: 25, upper: 40, rain: 6, note: 'Scattered light shower' },
    { hour: 'T+8h', risk: 45, lower: 36, upper: 55, rain: 18, note: 'Cloudband approaching' },
    { hour: 'T+12h', risk: 62, lower: 50, upper: 72, rain: 35, note: 'Soil saturation escalating' },
    { hour: 'T+16h', risk: 78, lower: 68, upper: 89, rain: 65, note: 'CRITICAL: Pass cutoff anticipated' },
    { hour: 'T+20h', risk: 86, lower: 75, upper: 95, rain: 82, note: 'Peak monsoon burst; debris flow risk' },
    { hour: 'T+24h', risk: 82, lower: 70, upper: 92, rain: 74, note: 'Active road washout' },
    { hour: 'T+28h', risk: 73, lower: 60, upper: 84, rain: 48, note: 'Rainfall receding; mud remains high' },
    { hour: 'T+32h', risk: 58, lower: 46, upper: 68, rain: 25, note: 'Corridor assessment underway' },
    { hour: 'T+36h', risk: 44, lower: 34, upper: 54, rain: 12, note: 'Clearance teams deployed' },
    { hour: 'T+40h', risk: 36, lower: 28, upper: 46, rain: 5, note: '4WD escort clearance' },
    { hour: 'T+44h', risk: 30, lower: 22, upper: 38, rain: 2, note: 'Surface stabilization' },
    { hour: 'T+48h', risk: 25, lower: 18, upper: 32, rain: 0, note: 'Full road reopening' }
  ];

  // 7-Day Outlook
  const weekForecast = [
    { day: 'Today', Icon: CloudDrizzle, temp: '16°C', rain: '24 mm', risk: 45, status: 'Precautionary' },
    { day: 'Tomorrow', Icon: CloudLightning, temp: '13°C', rain: '82 mm', risk: 86, status: 'Suspended' },
    { day: 'Day 3', Icon: CloudRain, temp: '14°C', rain: '38 mm', risk: 62, status: 'Restricted' },
    { day: 'Day 4', Icon: CloudSun, temp: '18°C', rain: '6 mm', risk: 30, status: 'Normal' },
    { day: 'Day 5', Icon: Sun, temp: '21°C', rain: '0 mm', risk: 18, status: 'Optimal' },
    { day: 'Day 6', Icon: CloudSun, temp: '20°C', rain: '2 mm', risk: 22, status: 'Optimal' },
    { day: 'Day 7', Icon: CloudDrizzle, temp: '17°C', rain: '14 mm', risk: 38, status: 'Normal' }
  ];

  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (index) => padding.left + (index / (points.length - 1)) * graphWidth;
  const getY = (val) => padding.top + (1 - val / 100) * graphHeight;

  // Build SVG polygon for confidence envelope
  const upperPath = points.map((p, i) => `${getX(i)},${getY(p.upper)}`).join(' L ');
  const lowerPath = points.slice().reverse().map((p, i) => `${getX(points.length - 1 - i)},${getY(p.lower)}`).join(' L ');
  const confidenceArea = `M ${upperPath} L ${lowerPath} Z`;

  // Build line path for predicted risk
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.risk)}`).join(' ');

  // Critical threshold Y coordinate (70%)
  const thresholdY = getY(70);

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              48-Hour Disruption Trajectory &amp; 90% Confidence Interval
            </h3>
            <DataBadge isReal={false} label="Simulated Forecast" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Predictive uncertainty envelope modeled with Open-Meteo ensemble feeds.
          </p>
        </div>

        <div style={{
          padding: '4px 10px',
          borderRadius: '4px',
          background: 'var(--accent-rose-subtle)',
          border: '1px solid var(--accent-rose)',
          color: 'var(--accent-rose)',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertTriangle size={13} />
          <span>Cutoff Window: T+16h to T+28h (Risk &gt; 70%)</span>
        </div>
      </div>

      {/* SVG Timeline Chart */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '550px', height: 'auto', display: 'block' }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 70, 100].map((val) => {
            const y = getY(val);
            const isThreshold = val === 70;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke={isThreshold ? '#f43f5e' : 'var(--border-subtle)'}
                  strokeWidth={isThreshold ? 1.5 : 1}
                  strokeDasharray={isThreshold ? '4 3' : '2 2'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  fill={isThreshold ? '#f43f5e' : 'var(--text-muted)'}
                  fontSize="10"
                  textAnchor="end"
                  fontWeight={isThreshold ? 700 : 400}
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Threshold Label */}
          <text
            x={width - padding.right}
            y={thresholdY - 6}
            fill="#f43f5e"
            fontSize="10"
            textAnchor="end"
            fontWeight={600}
          >
            CRITICAL SAFETY THRESHOLD (70%)
          </text>

          {/* Shaded Confidence Envelope (90% Interval) */}
          <path
            d={confidenceArea}
            fill="rgba(56, 189, 248, 0.15)"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Forecast Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => {
            const cx = getX(i);
            const cy = getY(p.risk);
            const isBreach = p.risk >= 70;
            const isHovered = hoveredPoint?.index === i;

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint({ ...p, index: i, cx, cy })}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Invisible hover target */}
                <circle cx={cx} cy={cy} r="14" fill="transparent" />

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : (isBreach ? 4.5 : 3.5)}
                  fill={isBreach ? '#f43f5e' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />

                {/* X-axis labels */}
                <text
                  x={cx}
                  y={height - 12}
                  fill={isBreach ? 'var(--accent-rose)' : 'var(--text-secondary)'}
                  fontSize="9.5"
                  textAnchor="middle"
                  fontWeight={isHovered ? 700 : (isBreach ? 600 : 400)}
                >
                  {p.hour}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              background: 'var(--bg-surface-elevated)',
              border: `1px solid ${hoveredPoint.risk >= 70 ? 'var(--accent-rose)' : 'var(--accent-primary)'}`,
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.75rem',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Forecast at {hoveredPoint.hour}: <span style={{ color: hoveredPoint.risk >= 70 ? 'var(--accent-rose)' : 'var(--accent-primary)' }}>{hoveredPoint.risk}% Disruption Risk</span>
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              90% CI: {hoveredPoint.lower}% – {hoveredPoint.upper}% | Rain: {hoveredPoint.rain} mm/h
            </div>
            <div style={{ color: hoveredPoint.risk >= 70 ? 'var(--accent-rose)' : 'var(--accent-primary)', marginTop: '3px', fontWeight: 600 }}>
              {hoveredPoint.note}
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Outlook Cards */}
      <div style={{ marginTop: '1.25rem' }}>
        <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
          7-Day Strategic Corridor Outlook (Pass Mobility Index)
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '0.5rem'
        }}>
          {weekForecast.map((day, i) => {
            const isCutoff = day.risk >= 70;
            const isWarn = day.risk >= 40 && day.risk < 70;
            const badgeColor = isCutoff ? '#f43f5e' : (isWarn ? '#f59e0b' : '#10b981');

            return (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: `1px solid ${isCutoff ? '#f43f5e55' : 'var(--border-subtle)'}`,
                  borderRadius: '6px',
                  padding: '8px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{day.day}</div>
                <div style={{ margin: '4px 0', display: 'flex', justifyContent: 'center' }}>
                  <day.Icon size={18} color="var(--apple-blue)" />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{day.temp}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{day.rain}</div>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: badgeColor,
                  background: `${badgeColor}22`,
                  padding: '2px 4px',
                  borderRadius: '3px',
                  marginTop: '4px'
                }}>
                  {day.risk}% ({day.status})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: A severe 12-hour disruption window is projected starting in 16 hours. Pre-position cargo at staging hubs before T+14h.
      </div>
    </div>
  );
};

export default Forecast48hChart;
