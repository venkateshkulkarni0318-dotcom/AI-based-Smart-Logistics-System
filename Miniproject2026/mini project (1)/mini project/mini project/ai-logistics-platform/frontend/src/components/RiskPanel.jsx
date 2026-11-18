import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

const RiskPanel = ({ riskData, selectedVillage }) => {
  const weatherRisk = riskData?.weatherRiskFactor ?? 0.42;
  const terrainRisk = riskData?.terrainRiskFactor ?? 0.65;
  const overallRisk = selectedVillage?.riskStatus || 'Moderate';

  return (
    <div className="card-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--apple-blue)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Predictive AI Risk Intelligence
          </h3>
        </div>
        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
          Ensemble Model v2.5
        </span>
      </div>

      {selectedVillage ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Target Header */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Destination</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedVillage.name}</div>
            </div>
            <span className={`badge ${overallRisk === 'High' ? 'badge-danger' : overallRisk === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
              {overallRisk} Risk
            </span>
          </div>

          {/* Metric Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Terrain Hazard Factor</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(terrainRisk * 100)}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${terrainRisk * 100}%`, height: '100%', background: 'var(--accent-amber)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Weather &amp; Precipitation Impact</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{Math.round(weatherRisk * 100)}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${weatherRisk * 100}%`, height: '100%', background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Settlement Accessibility Score</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedVillage.accessScore}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${selectedVillage.accessScore}%`, height: '100%', background: selectedVillage.accessScore >= 60 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }} />
              </div>
            </div>
          </div>

          {/* AI Recommended Directives */}
          <div style={{
            background: 'var(--accent-primary-subtle)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
              <Zap size={13} color="var(--accent-primary)" />
              <span>AI DISPATCH DIRECTIVE</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {overallRisk === 'High'
                ? 'High risk of road blockage. Restrict to 4WD payload transport or drone airlift before 16:30 hrs.'
                : overallRisk === 'Moderate'
                ? 'Moderate terrain elevation. Standard all-weather vans recommended with real-time GPS tracking.'
                : 'Favorable travel conditions. Route clear for standard road delivery.'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1.5rem 0' }}>
          Select a village on the map or registry to view localized AI risk intelligence.
        </div>
      )}
    </div>
  );
};

export default RiskPanel;
