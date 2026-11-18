import React from 'react';

/**
 * DataBadge Component (Phase 1 Requirement A5 & Global Rule 2)
 * Ensures every metric, card, and chart is clearly labeled as Real or Simulated.
 */
const DataBadge = ({ isReal = false, label = null, style = {} }) => {
  const text = label || (isReal ? 'Real Data' : 'Simulated demo data');
  
  return (
    <span
      className={`data-badge ${isReal ? 'badge-real' : 'badge-simulated'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.68rem',
        fontWeight: 700,
        padding: '2px 7px',
        borderRadius: '4px',
        letterSpacing: '0.02em',
        background: isReal ? 'var(--accent-emerald-subtle)' : 'var(--accent-amber-subtle)',
        color: isReal ? 'var(--accent-emerald)' : 'var(--accent-amber)',
        border: `1px solid ${isReal ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`,
        borderWidth: '1px',
        ...style
      }}
      title={isReal ? 'Computed from empirical SRTM DEM, SHRUG or live feed' : 'Simulated demo value pending official agency telemetry'}
    >
      <span style={{ fontSize: '0.55rem' }} aria-hidden="true">●</span>
      {text}
    </span>
  );
};

export default DataBadge;
