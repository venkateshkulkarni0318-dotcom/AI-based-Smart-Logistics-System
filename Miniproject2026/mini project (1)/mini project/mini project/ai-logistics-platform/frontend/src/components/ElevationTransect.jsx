import React, { useState, useEffect } from 'react';
import { Mountain, Activity, Check, AlertTriangle, MapPin, Info } from 'lucide-react';
import { getElevationProfile } from '../services/api';
import DataBadge from './DataBadge';

const CORRIDOR_OPTIONS = [
  { id: 'corridor-himalaya', label: 'Ladakh High Alpine (4,120m)' },
  { id: 'corridor-delta', label: 'Brahmaputra Delta (58m Floodplain)' },
  { id: 'corridor-desert', label: 'Thar Desert Frontier (210m)' }
];

const ElevationTransect = ({ initialCorridor = 'corridor-himalaya', onSelectPoint = null }) => {
  const [selectedCorridor, setSelectedCorridor] = useState(initialCorridor);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [error, setError] = useState(null);
  const [exaggeration, setExaggeration] = useState(1); // 1x, 3x, 5x exaggeration toggle

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await getElevationProfile(selectedCorridor);
        if (isMounted) {
          if (res?.success) {
            setProfileData(res);
            if (res.profile?.length > 0) {
              setHoveredPoint(res.profile[0]);
            }
          } else {
            setError(res?.message || 'Failed to load SRTM transect');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => { isMounted = false; };
  }, [selectedCorridor]);

  const profile = profileData?.profile || [];
  const metrics = profileData?.metrics || null;
  const transectCurve = profileData?.transectCurve || [];

  // SVG Chart Dimensions
  const svgWidth = 840;
  const svgHeight = 280;
  const padding = { top: 35, right: 35, bottom: 45, left: 65 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Auto-scale axis dynamically per corridor (Fixes Issue A2)
  const rawMin = metrics?.minElevationM != null ? metrics.minElevationM : 0;
  const rawMax = metrics?.maxElevationM != null ? metrics.maxElevationM : 1000;
  const elevationSpan = Math.max(rawMax - rawMin, 30);
  const yPadding = Math.max(elevationSpan * 0.2, 15);

  const minElev = Math.max(0, Math.floor((rawMin - yPadding) / 10) * 10);
  const maxElev = Math.ceil((rawMax + yPadding) / 10) * 10;
  const maxDist = Math.max(metrics?.totalTransectKm || 50, 10);

  // Apply vertical exaggeration to height calculations
  const baseline = minElev;
  const getX = (distKm) => padding.left + (distKm / maxDist) * chartWidth;
  const getY = (elevM) => {
    // Relative height from baseline multiplied by exaggeration factor
    const elevatedSpan = maxElev - minElev;
    if (elevatedSpan <= 0) return padding.top + chartHeight / 2;
    const normalized = (elevM - baseline) / elevatedSpan;
    const exaggeratedNormalized = Math.min(Math.max(normalized * exaggeration, 0), 1.05);
    return padding.top + chartHeight - exaggeratedNormalized * chartHeight;
  };

  // Build SVG Path from transectCurve
  const points = transectCurve.length > 0 ? transectCurve : profile;
  const pathD = points.length > 0
    ? points.reduce((acc, pt, idx) => {
        const x = getX(pt.distanceKm);
        const y = getY(pt.elevationM);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, '')
    : '';

  const areaD = pathD
    ? `${pathD} L ${getX(points[points.length - 1].distanceKm)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
    : '';

  // Drone Ceiling guideline (4200m) - only show if within visible vertical corridor range
  const showDroneCeiling = minElev <= 4200 && maxElev >= 3800;
  const droneCeilingY = getY(4200);

  const isNearlyFlat = metrics?.isNearlyFlat || (rawMax - rawMin) < 120;

  return (
    <div className="card-panel" style={{ padding: '1.25rem' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Mountain size={20} color="var(--apple-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Interactive SRTM Elevation Transect
            </h3>
            <DataBadge isReal={true} label="Real SRTM 30m DEM" />
            {isNearlyFlat && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}>
                Low-Relief Corridor
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Dynamic cross-sectional topography with auto-scaled axis, slope analysis, and convoy gradient thresholds
          </p>
        </div>

        {/* Corridor & Exaggeration Controls */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Exaggeration Toggle (Fixes Issue A2) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '2px',
            fontSize: '0.72rem'
          }}>
            <span style={{ padding: '0 6px', color: 'var(--text-muted)', fontWeight: 600 }}>Relief:</span>
            {[1, 3, 5].map((factor) => (
              <button
                key={factor}
                type="button"
                onClick={() => setExaggeration(factor)}
                style={{
                  background: exaggeration === factor ? 'var(--accent-primary)' : 'transparent',
                  color: exaggeration === factor ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.72rem'
                }}
                title={`Scale vertical relief ${factor}x`}
              >
                {factor}x
              </button>
            ))}
          </div>

          {/* Corridor Buttons */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CORRIDOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCorridor(c.id)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: selectedCorridor === c.id ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedCorridor === c.id ? 'var(--accent-primary-subtle)' : 'var(--bg-surface-elevated)',
                  color: selectedCorridor === c.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: selectedCorridor === c.id ? 700 : 500
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Summary Metrics Grid */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.6rem',
          marginBottom: '1rem'
        }}>
          <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Peak Altitude</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {metrics.maxElevationM} <span style={{ fontSize: '0.75rem' }}>m ASL</span>
            </div>
          </div>

          <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Cumulative Gain</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3b82f6' }}>
              +{metrics.elevationGainM} <span style={{ fontSize: '0.75rem' }}>m</span>
            </div>
          </div>

          <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Max Slope</div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: metrics.maxSlopeDeg > 15 ? '#ef4444' : metrics.maxSlopeDeg > 10 ? '#f59e0b' : '#10b981'
            }}>
              {metrics.maxSlopeDeg}°
            </div>
          </div>

          <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Drone Ceiling (4.2k)</div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: metrics.droneFlightClear ? '#10b981' : '#ef4444'
            }}>
              {metrics.droneFlightClear ? 'Viable' : 'Exceeded'}
            </div>
          </div>

          <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Heavy Convoy (12°)</div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: metrics.heavyTruckSafe ? '#10b981' : '#f59e0b'
            }}>
              {metrics.heavyTruckSafe ? 'Standard' : 'Low Gear'}
            </div>
          </div>
        </div>
      )}

      {/* Low-Relief Note if applicable */}
      {isNearlyFlat && (
        <div style={{
          fontSize: '0.78rem',
          padding: '6px 10px',
          borderRadius: '4px',
          background: 'rgba(2, 132, 199, 0.08)',
          borderLeft: '3px solid var(--accent-primary)',
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={13} color="var(--apple-blue)" style={{ flexShrink: 0 }} />
            <span><strong>Corridor Topography Note:</strong> Terrain is nearly flat across this corridor (total elevation variance is only {rawMax - rawMin}m). The Y-axis has auto-scaled ({minElev}m - {maxElev}m). Use <strong>3x</strong> or <strong>5x relief</strong> toggle to visualize dune topography.</span>
          </div>
        </div>
      )}

      {/* SVG Transect Cross Section View */}
      {loading ? (
        <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
          Computing topographic elevation transect from SRTM DEM...
        </div>
      ) : error ? (
        <div style={{ padding: '1rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
          Notice: {error}
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block', background: 'var(--bg-surface)' }}
          >
            <defs>
              <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>

              <pattern id="gridLines" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="0.5" strokeOpacity="0.5" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect
              x={padding.left}
              y={padding.top}
              width={chartWidth}
              height={chartHeight}
              fill="url(#gridLines)"
              opacity="0.4"
            />

            {/* Drone Ceiling Threshold Guideline (Only when corridor altitude approaches it) */}
            {showDroneCeiling && droneCeilingY >= padding.top && droneCeilingY <= padding.top + chartHeight && (
              <g>
                <line
                  x1={padding.left}
                  y1={droneCeilingY}
                  x2={padding.left + chartWidth}
                  y2={droneCeilingY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="5,4"
                  opacity="0.8"
                />
                <text
                  x={padding.left + chartWidth - 8}
                  y={droneCeilingY - 6}
                  textAnchor="end"
                  fill="#10b981"
                  fontSize="10"
                  fontWeight="700"
                >
                  Drone Max Operating Ceiling (4,200m ASL)
                </text>
              </g>
            )}

            {/* Elevation Fill Area */}
            {areaD && (
              <path
                d={areaD}
                fill="url(#terrainGradient)"
              />
            )}

            {/* Topographic Surface Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}

            {/* Y-Axis (Elevation m) */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + chartHeight}
              stroke="var(--border-subtle)"
            />
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const val = Math.round(minElev + ratio * (maxElev - minElev));
              const y = getY(val);
              return (
                <g key={ratio}>
                  <line
                    x1={padding.left - 5}
                    y1={y}
                    x2={padding.left}
                    y2={y}
                    stroke="var(--border-subtle)"
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 3}
                    textAnchor="end"
                    fill="var(--text-tertiary)"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* X-Axis (Distance km) */}
            <line
              x1={padding.left}
              y1={padding.top + chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight}
              stroke="var(--border-subtle)"
            />
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const dist = Math.round(ratio * maxDist);
              const x = getX(dist);
              return (
                <g key={ratio}>
                  <line
                    x1={x}
                    y1={padding.top + chartHeight}
                    x2={x}
                    y2={padding.top + chartHeight + 5}
                    stroke="var(--border-subtle)"
                  />
                  <text
                    x={x}
                    y={padding.top + chartHeight + 16}
                    textAnchor="middle"
                    fill="var(--text-tertiary)"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {dist} km
                  </text>
                </g>
              );
            })}

            {/* Strategic Waypoint Markers on Transect */}
            {profile.map((pt) => {
              const x = getX(pt.distanceKm);
              const y = getY(pt.elevationM);
              const isHovered = hoveredPoint?.id === pt.id;

              return (
                <g
                  key={pt.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onClick={() => onSelectPoint && onSelectPoint(pt)}
                >
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={padding.top + chartHeight}
                    stroke={isHovered ? 'var(--accent-primary)' : 'var(--border-subtle)'}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    strokeDasharray={isHovered ? 'none' : '3,3'}
                  />

                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="9"
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}

                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 4}
                    fill={pt.elevationM > 4000 ? '#ef4444' : pt.slopeDeg > 18 ? '#f59e0b' : '#38bdf8'}
                    stroke="var(--bg-surface)"
                    strokeWidth="1.5"
                  />

                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={isHovered ? 'var(--text-primary)' : 'var(--text-secondary)'}
                    fontSize="9"
                    fontWeight={isHovered ? '800' : '600'}
                  >
                    {pt.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Selected / Hovered Station Detail Inspector */}
      {!loading && !error && hoveredPoint && (
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem 1.1rem',
          borderRadius: '6px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} color="var(--apple-blue)" />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {hoveredPoint.name}
              </strong>
              <span style={{
                fontSize: '0.68rem',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)'
              }}>
                Transect Km {hoveredPoint.distanceKm}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Classification: <span style={{ color: 'var(--text-secondary)' }}>{hoveredPoint.terrain}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Altitude</div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {hoveredPoint.elevationM} m ASL
              </strong>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Slope Gradient</div>
              <strong style={{ fontSize: '0.85rem', color: hoveredPoint.slopeDeg > 18 ? '#ef4444' : '#10b981' }}>
                {hoveredPoint.slopeDeg}° ({hoveredPoint.gradientPercent}%)
              </strong>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Drone Air Window</div>
              <strong style={{ fontSize: '0.85rem', color: hoveredPoint.elevationM <= 4200 ? '#10b981' : '#ef4444' }}>
                {hoveredPoint.elevationM <= 4200 ? 'In Flight Ceiling' : 'Above Ceiling'}
              </strong>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Ground Convoy</div>
              <strong style={{ fontSize: '0.85rem', color: hoveredPoint.slopeDeg <= 12 ? '#10b981' : '#f59e0b' }}>
                {hoveredPoint.slopeDeg <= 12 ? 'Clear Passage' : 'Steep Gradient'}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevationTransect;
