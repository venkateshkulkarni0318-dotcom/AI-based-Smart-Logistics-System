import React, { useState, useEffect } from 'react';
import { Table, LayoutGrid, Truck, Navigation, Ship, Train } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const MODE_ICONS = {
  road: Truck,
  drone: Navigation,
  waterway: Ship,
  rail: Train
};
import MultimodalPanel from '../components/MultimodalPanel';
import MultiModalRadarChart from '../components/MultiModalRadarChart';
import BreakEvenChart from '../components/BreakEvenChart';
import CostVsTimeBubbleChart from '../components/CostVsTimeBubbleChart';
import DataBadge from '../components/DataBadge';
import { getMultimodalModes } from '../services/api';

const MultimodalPage = () => {
  const [modes, setModes] = useState([]);
  const [activeMode, setActiveMode] = useState('drone');
  const [loading, setLoading] = useState(true);
  const [viewFormat, setViewFormat] = useState('table'); // 'table' | 'cards'

  useEffect(() => {
    async function load() {
      try {
        const res = await getMultimodalModes();
        if (res?.data) {
          setModes(res.data);
        }
      } catch {
        // Fallback default array if server slow
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PageLayout
      title="Multi-Modal Transport Model"
      subtitle="Unified data architecture across Road, Rail, Waterway & Air/Drone logistics channels"
      badge="Objective 01"
    >
      <MultimodalPanel
        modes={modes}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
      />

      {/* Objective 01: Multi-Modal Capability Spider Polygon (Full-Width Uncluttered Layout) */}
      <MultiModalRadarChart modes={modes} />

      {/* Objective 01: Operational Trade-Off & Break-Even Analytical Suite */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem',
        alignItems: 'stretch'
      }}>
        <BreakEvenChart />
        <CostVsTimeBubbleChart modes={modes} />
      </div>

      {/* Comparison Summary Matrix */}
      <div className="card-panel" style={{ padding: '1.25rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.85rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Comparative Specification Matrix
              </h3>
              <DataBadge isReal={true} label="Multi-Modal Schema" />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Technical specifications, payload ceilings, unit economics, and environmental resilience scores
            </p>
          </div>

          {/* iOS-Style Segmented View Switcher */}
          <div className="segmented-control" role="group" aria-label="Format Toggle">
            <button
              type="button"
              className={`segmented-btn ${viewFormat === 'table' ? 'active' : ''}`}
              onClick={() => setViewFormat('table')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Table size={13} />
              <span>Table</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${viewFormat === 'cards' ? 'active' : ''}`}
              onClick={() => setViewFormat('cards')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <LayoutGrid size={13} />
              <span>Cards</span>
            </button>
          </div>
        </div>

        {/* View Mode: Responsive Table with Guaranteed Horizontal Scroll on 360px (Fixes Issue A3) */}
        {viewFormat === 'table' ? (
          <div
            className="table-container"
            style={{
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px'
            }}
          >
            <table
              className="data-table"
              style={{ minWidth: '760px', width: '100%' }}
              aria-label="Transport Mode Comparison Matrix"
            >
              <thead>
                <tr>
                  <th scope="col">Transport Channel</th>
                  <th scope="col">Category</th>
                  <th scope="col">Cruising Speed</th>
                  <th scope="col">Payload Ceiling</th>
                  <th scope="col">Cost per Tonne-Km</th>
                  <th scope="col">Carbon Intensity</th>
                  <th scope="col">Resilience Index</th>
                  <th scope="col">Primary Vulnerability</th>
                </tr>
              </thead>
              <tbody>
                {modes.map((row) => {
                  const ModeIcon = MODE_ICONS[row.id] || Truck;
                  return (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <ModeIcon size={14} color="var(--apple-blue)" />
                          <span>{row.name}</span>
                        </span>
                      </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.category}</td>
                    <td>{row.avgSpeedKmh} km/h</td>
                    <td>{row.payloadCapacityKg?.toLocaleString()} kg</td>
                    <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>₹{row.costPerKmKg}</td>
                    <td>{row.carbonGPerTonneKm} g CO₂/t-km</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
                        <div style={{ width: '50px', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.resilienceScore}%`, height: '100%', background: row.resilienceScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.resilienceScore}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {Array.isArray(row.vulnerabilities) ? row.vulnerabilities.slice(0, 2).join(', ') : 'Weather dependent'}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode: Mobile Card Grid (100% Readable at 360px without truncation) */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.85rem'
          }}>
            {modes.map((row) => {
              const ModeIcon = MODE_ICONS[row.id] || Truck;
              return (
                <div
                  key={row.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <ModeIcon size={16} color="var(--apple-blue)" />
                      <span>{row.name}</span>
                    </div>
                  <span className="badge badge-info">{row.category}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.78rem' }}>
                  <div>Speed: <strong>{row.avgSpeedKmh} km/h</strong></div>
                  <div>Payload: <strong>{row.payloadCapacityKg?.toLocaleString()} kg</strong></div>
                  <div>Cost: <strong style={{ color: 'var(--accent-primary)' }}>₹{row.costPerKmKg}/t-km</strong></div>
                  <div>Carbon: <strong>{row.carbonGPerTonneKm} g/t-km</strong></div>
                </div>

                {/* Resilience Index Progress */}
                <div style={{ marginTop: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                    <span>Resilience Index</span>
                    <strong style={{ color: row.resilienceScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                      {row.resilienceScore}%
                    </strong>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.resilienceScore}%`, height: '100%', background: row.resilienceScore >= 80 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Vulnerabilities: {Array.isArray(row.vulnerabilities) ? row.vulnerabilities.join(', ') : 'None documented'}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MultimodalPage;
