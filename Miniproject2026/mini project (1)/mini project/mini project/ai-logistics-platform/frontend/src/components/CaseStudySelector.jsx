import React, { useState } from 'react';
import { Mountain, Satellite, BarChart3 } from 'lucide-react';

const CaseStudySelector = ({ corridors = [], selectedCorridor, onSelectCorridor }) => {
  const [showImageComparison, setShowImageComparison] = useState(false);

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mountain size={20} color="var(--apple-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Objective 06: Contrasting Case-Study Corridors
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Empirical validation across High Alpine Mountain Passes, Riverine Delta Cutoffs, and Arid Desert Frontiers
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowImageComparison(!showImageComparison)}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BarChart3 size={14} />
          <span>{showImageComparison ? 'Hide Visual Comparison' : 'View Contrasting GIS Corridors'}</span>
        </button>
      </div>

      {/* Visual Image Preview when expanded */}
      {showImageComparison && (
        <div style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)',
          maxHeight: '340px'
        }}>
          <img
            src="/images/corridors_case_study.jpg"
            alt="Himalayan Mountain Corridor vs Tropical Riverine Delta Corridor"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(9, 13, 22, 0.95) 100%)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Satellite size={14} color="var(--apple-blue)" />
            <span>
              <strong style={{ color: 'var(--accent-primary)' }}>Corridor Comparison:</strong> Left: High Alpine Mountain Pass (Elev &gt; 4,200m, Landslides/Avalanche) | Right: Riverine Delta Corridor (Elev &lt; 100m, Waterway lifeline).
            </span>
          </div>
        </div>
      )}

      {/* Corridor Selection Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '0.85rem'
      }}>
        {corridors.map((c) => {
          const isSelected = selectedCorridor?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => onSelectCorridor && onSelectCorridor(c)}
              style={{
                background: isSelected ? 'var(--accent-primary-subtle)' : 'var(--bg-surface-elevated)',
                border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              tabIndex="0"
              role="button"
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCorridor && onSelectCorridor(c);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{c.regionType}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {c.elevationRange}
                </span>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {c.name}
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                {c.summary}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', color: 'var(--text-muted)' }}>
                <span>Lifeline: <strong style={{ color: 'var(--text-primary)' }}>{c.activeModeRecommendation}</strong></span>
                <span style={{ fontWeight: 600, color: c.feasibilityScore >= 60 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                  Feasibility: {c.feasibilityScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaseStudySelector;
