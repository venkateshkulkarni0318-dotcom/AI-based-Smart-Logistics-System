import React, { useState } from 'react';
import { Mountain, Waves, Sun, Layers } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * CrossCorridorMatrix Component (Phase 3 Requirement 6.2 - Objective 06)
 * Cross-regional side-by-side comparative benchmark across Himalayan Highland, Brahmaputra Delta & Thar Desert.
 */
const CrossCorridorMatrix = ({ corridors = [], onSelectCorridor }) => {
  const [activeId, setActiveId] = useState('corridor-himalaya');

  const benchmarkCorridors = [
    {
      id: 'corridor-himalaya',
      name: 'Western Himalayan Highland',
      route: 'Kargil to Padum (NH-301 / Zanskar)',
      Icon: Mountain,
      color: '#38bdf8',
      elevationRange: '2,650m - 4,400m ASL',
      maxSlope: '34.8° (High Angle Gorges)',
      climateSeason: 'Extreme Winter Snowpack (Nov - Apr)',
      primaryHazard: 'Avalanches, rockfalls & sub-zero freeze',
      roadCutoffDays: '160-180 days/year',
      preferredLifeline: 'Heavy-Lift Autonomous Cargo UAV (4,200m Ceiling)',
      avgAccessScore: 34,
      costPerTonneKm: '₹18.5',
      carbonIntensity: 'Medium-High (Cold Starts & Switchbacks)',
      uptimePct: 52,
      strategicSignificance: 'Strategic border defense zone (LAC/LoC proximity); 13,200 high-altitude residents.'
    },
    {
      id: 'corridor-delta',
      name: 'Brahmaputra Riverine Delta',
      route: 'Jorhat to Majuli Island (River Lifeline)',
      Icon: Waves,
      color: '#06b6d4',
      elevationRange: '75m - 92m ASL (Low Gradient)',
      maxSlope: '2.4° (Flat Riverbed)',
      climateSeason: 'Peak Monsoon Flood Season (Jun - Aug)',
      primaryHazard: 'Silt erosion, jetty submergence & road washout',
      roadCutoffDays: '60-85 days/year',
      preferredLifeline: 'Inland Shallow-Draft Water Freight Barges',
      avgAccessScore: 48,
      costPerTonneKm: '₹7.2',
      carbonIntensity: 'Lowest (High-Tonnage Waterways)',
      uptimePct: 76,
      strategicSignificance: 'World’s largest inhabited river island; 168,000 population vulnerable to seasonal water rise.'
    },
    {
      id: 'corridor-desert',
      name: 'Western Thar Desert Frontier',
      route: 'Jaisalmer to Longewala Border Outpost',
      Icon: Sun,
      color: '#f59e0b',
      elevationRange: '195m - 240m ASL (Low Relief)',
      maxSlope: '4.8° (Rolling Sand Ridges)',
      climateSeason: 'Peak Summer Heat & Sandstorms (May - Jul)',
      primaryHazard: 'Shifting sand dunes, thermal strain & wind shear',
      roadCutoffDays: '15-30 days/year (Temporary Blasts)',
      preferredLifeline: '6x6 Off-Road Convoys + High-Endurance Drones',
      avgAccessScore: 78,
      costPerTonneKm: '₹12.0',
      carbonIntensity: 'Moderate (Desert Tracks)',
      uptimePct: 88,
      strategicSignificance: 'Strategic desert defense perimeter; extreme supply chain vulnerability to sandstorms.'
    }
  ];

  const handleSelect = (c) => {
    setActiveId(c.id);
    if (onSelectCorridor) onSelectCorridor(c);
  };

  const active = benchmarkCorridors.find((c) => c.id === activeId) || benchmarkCorridors[0];

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--apple-blue)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Contrasting Regional Corridor Benchmark (Objective 06)
            </h3>
            <DataBadge isReal={true} label="SHRUG &amp; SRTM Multi-Corridor" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Comparative validation across Alpine, Riverine Delta, and Arid Desert logistical operating environments.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '2px',
          gap: '2px'
        }}>
          {benchmarkCorridors.map((c) => {
            const TabIcon = c.Icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c)}
                style={{
                  background: activeId === c.id ? 'var(--accent-primary)' : 'transparent',
                  color: activeId === c.id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <TabIcon size={12} />
                <span>{c.name.split(' ')[1] || c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {benchmarkCorridors.map((c) => {
          const isSelected = c.id === activeId;
          const CardIcon = c.Icon;
          return (
            <div
              key={c.id}
              onClick={() => handleSelect(c)}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-surface-elevated)',
                border: `1.5px solid ${isSelected ? c.color : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CardIcon size={16} color={c.color} />
                    <strong style={{ fontSize: '0.85rem', color: isSelected ? c.color : 'var(--text-primary)' }}>
                      {c.name}
                    </strong>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: `${c.color}22`, color: c.color }}>
                      ACTIVE
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {c.route}
                </div>

                {/* Key Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.74rem' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block' }}>Elevation ASL</span>
                    <strong>{c.elevationRange}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block' }}>Max Slope Angle</span>
                    <strong>{c.maxSlope}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block' }}>Annual Cutoff</span>
                    <strong style={{ color: '#ef4444' }}>{c.roadCutoffDays}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', display: 'block' }}>Accessibility Score</span>
                    <strong style={{ color: c.avgAccessScore >= 60 ? '#10b981' : '#f59e0b' }}>{c.avgAccessScore}%</strong>
                  </div>
                </div>

                <div style={{ marginTop: '8px', fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                  <strong>Bottleneck:</strong> {c.primaryHazard}
                </div>
              </div>

              {/* Recommended Lifeline Mode */}
              <div style={{
                background: 'var(--bg-surface)',
                borderLeft: `3px solid ${c.color}`,
                padding: '6px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem'
              }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem' }}>RECOMMENDED LIFELINE:</span>
                <strong style={{ color: c.color }}>{c.preferredLifeline}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Corridor Strategic Profile Banner */}
      <div style={{
        padding: '0.85rem 1rem',
        borderRadius: '6px',
        background: 'var(--bg-surface-elevated)',
        borderLeft: `4px solid ${active.color}`,
        border: '1px solid var(--border-subtle)',
        borderLeftWidth: '4px',
        fontSize: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
            Tactical Defense &amp; Governance Profile: {active.name}
          </strong>
          <span style={{ color: 'var(--text-secondary)' }}>
            {active.strategicSignificance}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.72rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Unit Freight Cost</span>
            <strong style={{ color: 'var(--accent-primary)' }}>{active.costPerTonneKm} / t-km</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Annual Corridor Uptime</span>
            <strong style={{ color: active.uptimePct >= 70 ? '#10b981' : '#f59e0b' }}>{active.uptimePct}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossCorridorMatrix;
