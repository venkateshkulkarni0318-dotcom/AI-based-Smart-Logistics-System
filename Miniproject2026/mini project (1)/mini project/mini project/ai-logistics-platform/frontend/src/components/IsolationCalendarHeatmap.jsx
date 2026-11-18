import React, { useState } from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * IsolationCalendarHeatmap Component (Phase 3 Requirement 6.2)
 * 12-Month Calendar Heatmap showing seasonal cutoff windows by month across vulnerable settlements.
 */
const IsolationCalendarHeatmap = ({ villages = [] }) => {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'snow' | 'flood'
  const [hoveredCell, setHoveredCell] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Benchmark settlements with empirical seasonal isolation profiles
  const calendarData = [
    {
      name: 'Padum (Zanskar)',
      type: 'snow',
      elevation: '3,657m',
      corridor: 'Kargil-Zanskar (NH-301)',
      months: ['blocked', 'blocked', 'blocked', 'blocked', 'warn', 'open', 'open', 'open', 'open', 'warn', 'blocked', 'blocked'],
      hazard: 'Pensi La pass snow blockage & avalanches',
      lifeline: 'Chadar trek route / Heavy-Lift Cargo UAV'
    },
    {
      name: 'Kaza (Spiti)',
      type: 'snow',
      elevation: '3,800m',
      corridor: 'Manali-Kaza / Kunzum Pass',
      months: ['blocked', 'blocked', 'blocked', 'warn', 'open', 'open', 'open', 'open', 'open', 'warn', 'blocked', 'blocked'],
      hazard: 'Kunzum Pass snowpack (>4m depth)',
      lifeline: 'Shimla-Kinnaur high-clearance 4WD bypass'
    },
    {
      name: 'Majuli Island',
      type: 'flood',
      elevation: '85m',
      corridor: 'Brahmaputra Riverine',
      months: ['open', 'open', 'open', 'open', 'warn', 'blocked', 'blocked', 'blocked', 'warn', 'open', 'open', 'open'],
      hazard: 'Brahmaputra monsoon riverbed swelling & jetty inundation',
      lifeline: 'Inland water freight barges / Amphibious crafts'
    },
    {
      name: 'Malana (Kullu)',
      type: 'snow',
      elevation: '2,652m',
      corridor: 'Parvati Valley Gorge',
      months: ['blocked', 'blocked', 'warn', 'open', 'open', 'warn', 'warn', 'warn', 'open', 'open', 'blocked', 'blocked'],
      hazard: 'Narrow gorge rockfalls & winter icing',
      lifeline: 'Ropeway carriage & pack-mule convoys'
    },
    {
      name: 'Dharchula / Gunji',
      type: 'snow',
      elevation: '3,200m',
      corridor: 'Lipulekh Border Pass',
      months: ['blocked', 'blocked', 'blocked', 'warn', 'open', 'warn', 'warn', 'open', 'open', 'warn', 'blocked', 'blocked'],
      hazard: 'Kali river debris flows & high-altitude blizzard drifts',
      lifeline: 'Border Roads Task Force 6x6 escorts'
    },
    {
      name: 'Kibber (High Spiti)',
      type: 'snow',
      elevation: '4,270m',
      corridor: 'Kaza-Kibber Spur',
      months: ['blocked', 'blocked', 'blocked', 'blocked', 'warn', 'open', 'open', 'open', 'open', 'warn', 'blocked', 'blocked'],
      hazard: 'Extreme sub-zero freeze and 35° slope avalanches',
      lifeline: 'Winter food grain & medicine prepositioning'
    },
    {
      name: 'Sunderbans Outposts',
      type: 'flood',
      elevation: '4m',
      corridor: 'Matla / Bidya Delta',
      months: ['open', 'open', 'open', 'open', 'warn', 'blocked', 'blocked', 'blocked', 'warn', 'open', 'open', 'open'],
      hazard: 'Tidal surges & cyclonic depression flooding',
      lifeline: 'Tide-synchronized motorized country boats'
    }
  ];

  const filtered = calendarData.filter((item) => {
    if (filterType === 'snow') return item.type === 'snow';
    if (filterType === 'flood') return item.type === 'flood';
    return true;
  });

  const getStatusColor = (status) => {
    if (status === 'blocked') return { bg: 'var(--accent-rose-subtle)', border: 'var(--accent-rose)', text: 'var(--accent-rose)', label: 'Pass Cut Off' };
    if (status === 'warn') return { bg: 'var(--accent-amber-subtle)', border: 'var(--accent-amber)', text: 'var(--accent-amber)', label: 'Intermittent' };
    return { bg: 'var(--accent-emerald-subtle)', border: 'var(--accent-emerald)', text: 'var(--accent-emerald)', label: 'Open' };
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              12-Month Settlement Isolation Calendar
            </h3>
            <DataBadge isReal={false} label="Simulated Seasonal Registry" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Multi-hazard annual cut-off timeline (Winter snowpack vs Monsoon river flooding).
          </p>
        </div>

        {/* Filter buttons */}
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
            onClick={() => setFilterType('all')}
            style={{
              background: filterType === 'all' ? 'var(--accent-primary)' : 'transparent',
              color: filterType === 'all' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            All Corridors ({calendarData.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('snow')}
            style={{
              background: filterType === 'snow' ? 'var(--accent-primary)' : 'transparent',
              color: filterType === 'snow' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Snow Cutoff (5)
          </button>
          <button
            type="button"
            onClick={() => setFilterType('flood')}
            style={{
              background: filterType === 'flood' ? 'var(--accent-primary)' : 'transparent',
              color: filterType === 'flood' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Flood Inundation (2)
          </button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: '680px' }}>
          {/* Header Row: Months */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px repeat(12, 1fr)', gap: '4px', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Settlement / Outpost
            </div>
            {months.map((m, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {m}
              </div>
            ))}
          </div>

          {/* Body Rows */}
          {filtered.map((item, rowIdx) => (
            <div
              key={rowIdx}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px repeat(12, 1fr)',
                gap: '4px',
                marginBottom: '5px',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {item.elevation} • {item.type === 'snow' ? 'Himalayan Pass' : 'Riverine Delta'}
                </div>
              </div>

              {item.months.map((st, mIdx) => {
                const conf = getStatusColor(st);
                const isHovered = hoveredCell?.settlement === item.name && hoveredCell?.month === months[mIdx];

                return (
                  <div
                    key={mIdx}
                    onMouseEnter={() => setHoveredCell({
                      settlement: item.name,
                      month: months[mIdx],
                      status: conf.label,
                      color: conf.text,
                      hazard: item.hazard,
                      lifeline: item.lifeline
                    })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      height: '32px',
                      background: conf.bg,
                      border: `1px solid ${conf.border}66`,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      zIndex: isHovered ? 5 : 1
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: conf.text }}>
                      {st === 'blocked' ? <X size={11} /> : st === 'warn' ? <AlertTriangle size={11} /> : <Check size={11} />}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Active Cell Inspector */}
      <div style={{
        marginTop: '0.85rem',
        padding: '0.75rem 1rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.75rem'
      }}>
        {hoveredCell ? (
          <div>
            <strong>{hoveredCell.settlement} ({hoveredCell.month}): </strong>
            <span style={{ color: hoveredCell.color, fontWeight: 700 }}>{hoveredCell.status}</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Hazard: {hoveredCell.hazard} | Recommended Lifeline: <strong style={{ color: 'var(--accent-primary)' }}>{hoveredCell.lifeline}</strong>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            Hover over any monthly cell to inspect specific bottleneck hazards and multimodal lifeline activations.
          </div>
        )}

        {/* Status Indicators */}
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <Check size={12} /> Open Surface Road
          </span>
          <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <AlertTriangle size={12} /> Intermittent / Escorted 4WD
          </span>
          <span style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <X size={12} /> Fully Blocked (UAV / Barge Active)
          </span>
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: Zanskar and Spiti undergo 5-6 months of complete road cutoff (Nov-Apr) during high-altitude winter snowpack, while riverine islands face June-August flood isolation.
      </div>
    </div>
  );
};

export default IsolationCalendarHeatmap;
