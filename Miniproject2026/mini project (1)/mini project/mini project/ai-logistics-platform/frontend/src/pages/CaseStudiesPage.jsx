import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import CaseStudySelector from '../components/CaseStudySelector';
import CrossCorridorMatrix from '../components/CrossCorridorMatrix';
import ElevationTransect from '../components/ElevationTransect';
import { getCorridors } from '../services/api';

const CaseStudiesPage = () => {
  const [corridors, setCorridors] = useState([]);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getCorridors();
        if (res?.data && res.data.length > 0) {
          setCorridors(res.data);
          setSelectedCorridor(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load corridors:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PageLayout
      title="Contrasting Case-Study Corridors"
      subtitle="Empirical cross-validation across High Alpine Passes, Riverine Delta Cutoffs, and Desert Frontiers"
      badge="Objective 06"
    >
      <CaseStudySelector
        corridors={corridors}
        selectedCorridor={selectedCorridor}
        onSelectCorridor={setSelectedCorridor}
      />

      {/* Selected Corridor Deep Dive Panel */}
      {selectedCorridor && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Villages in Corridor */}
          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Strategic Settlements in Corridor ({selectedCorridor.villages?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {selectedCorridor.villages?.map((v) => (
                <div
                  key={v.id}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{v.name}</span>
                      {v.borderZone && <Shield size={12} color="var(--apple-amber)" title="Border Post" />}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      Pop: {v.population?.toLocaleString()} • {v.terrain}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${v.riskStatus === 'High' ? 'badge-danger' : v.riskStatus === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
                      {v.riskStatus} Risk
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Access: {v.accessScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multimodal Options in Corridor */}
          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Modal Feasibility Options
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {selectedCorridor.multimodalOptions?.map((opt, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{opt.mode}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{opt.costPerKg}/kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Duration: {opt.duration}</span>
                    <span>Risk Index: {opt.riskIndex}/100</span>
                    <span>{opt.carbonGPerKm}g CO₂/km</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Status: {opt.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Cross-Corridor Comparative Benchmark Matrix */}
      <CrossCorridorMatrix
        corridors={corridors}
        onSelectCorridor={(c) => {
          const match = corridors.find(item => item.id === c.id);
          if (match) setSelectedCorridor(match);
        }}
      />

      {/* Topographic Transect Cross-Section for this Corridor */}
      {selectedCorridor && (
        <div style={{ marginTop: '1.25rem' }}>
          <ElevationTransect initialCorridor={selectedCorridor.id} />
        </div>
      )}
    </PageLayout>
  );
};

export default CaseStudiesPage;
