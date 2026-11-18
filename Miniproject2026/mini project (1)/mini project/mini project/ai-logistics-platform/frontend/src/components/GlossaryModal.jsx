import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  Mountain,
  Brain,
  Satellite,
  Navigation,
  Compass,
  Activity,
  ShieldAlert,
  Building,
  Truck,
  Search,
  X
} from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';

/**
 * GlossaryModal Component (Phase 4 Requirement 6.4)
 * In-App Interactive Technical Glossary & Operational Standards Dictionary.
 */
const GlossaryModal = ({ isOpen, onClose }) => {
  const { glossaryOpen, setGlossaryOpen } = useUiPreferences();
  const [searchTerm, setSearchTerm] = useState('');

  const show = isOpen !== undefined ? isOpen : glossaryOpen;
  const handleClose = onClose || (() => setGlossaryOpen(false));

  if (!show) return null;

  const terms = [
    {
      term: 'SHRUG',
      full: 'Socioeconomic High-resolution Rural-Urban Geographic Platform for India',
      category: 'Geospatial Data',
      Icon: Building2,
      definition: 'Open-access socioeconomic database linking over 585,000 Indian villages across 4,149 assembly constituencies with demographic census data, electrification, and health center distances.',
      formula: 'SHRID: Primary geographic key linking village demographics to spatial vectors'
    },
    {
      term: 'SRTM 30m DEM',
      full: 'Shuttle Radar Topography Mission Digital Elevation Model',
      category: 'Terrain Elevation',
      Icon: Mountain,
      definition: 'NASA 1-arc-second (30-meter resolution) radar elevation grid used to calculate point-to-point terrain gradients, steep switchback slopes, and cumulative mountain ascent.',
      formula: 'Slope (°) = arctan(ΔElevation / ΔHorizontal Distance) × (180 / π)'
    },
    {
      term: 'TreeSHAP',
      full: 'Tree Shapley Additive exPlanations (Lundberg et al.)',
      category: 'Explainable AI',
      Icon: Brain,
      definition: 'Game-theoretic local feature attribution for tree-based ensemble models. Guarantees strict mathematical additivity where the sum of feature contributions equals the difference from base risk.',
      formula: 'Base Expected Value (32.0%) + Σ φᵢ = Final Disruption Risk (%)'
    },
    {
      term: 'NavIC',
      full: 'Navigation with Indian Constellation (IRNSS)',
      category: 'Satellite Navigation',
      Icon: Satellite,
      definition: 'Autonomous regional satellite navigation system developed by ISRO, providing sub-meter precision positioning over the Indian subcontinent independent of foreign GPS networks.',
      formula: 'L5 / S-band dual-frequency positioning with 100% Indian territorial coverage'
    },
    {
      term: 'Heavy-Lift Cargo UAV',
      full: 'Unmanned Aerial Vehicle (T-40 Class)',
      category: 'Multi-Modal Logistics',
      Icon: Navigation,
      definition: 'DGCA-cleared autonomous electric octocopter capable of carrying up to 40 kg payloads to 4,200m ASL altitudes during mountain road blockades and riverine washouts.',
      formula: 'Flight Radius: 35 km | Operating Ceiling: 4,200m ASL | Max Wind: 45 km/h'
    },
    {
      term: 'Haversine 3D Distance',
      full: 'Great-Circle Spherical Distance with DEM Altitude Delta',
      category: 'Mathematics',
      Icon: Compass,
      definition: 'Calculates true geographic transit distance across the Earth’s curved surface, adjusted for vertical elevation changes in mountain gorges.',
      formula: 'd₃D = √( d_surface² + (ΔElevation)² )'
    },
    {
      term: 'Settlement Access Index',
      full: 'Composite Socioeconomic Accessibility Score (0–100%)',
      category: 'Vulnerability Metric',
      Icon: Activity,
      definition: 'Dynamic metric quantifying how accessible a rural settlement is. Below 40% represents critical isolation requiring emergency pre-positioning.',
      formula: 'Score = 100 - (0.4 × CutoffDays) - (0.3 × SlopePenalty) - (0.3 × DepotDistance)'
    },
    {
      term: 'NDRF',
      full: 'National Disaster Response Force',
      category: 'Emergency Agencies',
      Icon: ShieldAlert,
      definition: 'Specialized Indian multi-disciplinary force operating under the Ministry of Home Affairs for rapid tactical search, rescue, and humanitarian supply distribution.',
      formula: 'Disaster Protocol: Level 3 Emergency Command'
    },
    {
      term: 'SDMA / DDMA',
      full: 'State / District Disaster Management Authority',
      category: 'Civil Administration',
      Icon: Building,
      definition: 'Statutory bodies chaired by the Chief Minister / District Collector responsible for inter-agency coordination, civil resource requisition, and relief staging.',
      formula: 'Administrative Clearance Authority for civilian air-space & transport requisition'
    },
    {
      term: 'BRO',
      full: 'Border Roads Organization (Taskforce 07)',
      category: 'Infrastructure',
      Icon: Truck,
      definition: 'Military engineering division maintaining strategic frontier road corridors, pass snow-clearance operations, and heavy dozer convoy escorts in border regions.',
      formula: 'Standard Operating Clearances: Escorted 4WD / 6x6 high-clearance convoys'
    }
  ];

  const filtered = terms.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.term.toLowerCase().includes(q) ||
      t.full.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div style={{
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-xl, 20px)',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        boxShadow: 'var(--elevation-3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm, 8px)',
              background: 'var(--apple-blue-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={18} color="var(--apple-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Technical Glossary &amp; System Standards
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Official definitions, mathematical formulations, and agency acronyms
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close Glossary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search acronyms, formulas, or datasets (e.g., SHRUG, TreeSHAP, DEM, NavIC)..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                transition: 'border var(--timing-fast) var(--ease-spring)'
              }}
            />
          </div>
        </div>

        {/* Terms List Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              No terms match "{searchTerm}". Try searching for SHRUG, TreeSHAP, or DEM.
            </div>
          ) : (
            filtered.map((t, i) => {
              const ItemIcon = t.Icon;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md, 14px)',
                    padding: '1rem 1.15rem',
                    transition: 'all var(--timing-fast) var(--ease-spring)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-xs, 6px)',
                        background: 'var(--apple-blue-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ItemIcon size={14} color="var(--apple-blue)" />
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--apple-blue)' }}>{t.term}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        ({t.full})
                      </span>
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                      {t.category}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 8px', lineHeight: 1.45 }}>
                    {t.definition}
                  </p>

                  <div style={{
                    background: 'rgba(0,0,0,0.25)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-xs, 6px)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--apple-green)'
                  }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Formula / Spec:</strong> {t.formula}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)'
        }}>
          <span>10 Standard Reference Terms • Open Specifications</span>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.74rem', padding: '5px 14px', borderRadius: 'var(--radius-full)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlossaryModal;
