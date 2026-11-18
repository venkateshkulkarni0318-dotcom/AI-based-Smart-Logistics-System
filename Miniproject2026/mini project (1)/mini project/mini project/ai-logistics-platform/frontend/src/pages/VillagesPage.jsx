import React, { useState, useEffect } from 'react';
import { MapPin, Shield } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import VillageTable from '../components/VillageTable';
import IsolationCalendarHeatmap from '../components/IsolationCalendarHeatmap';
import AccessDistributionCharts from '../components/AccessDistributionCharts';
import StockpileDepletionWidget from '../components/StockpileDepletionWidget';
import { getVillages } from '../services/api';

const VillagesPage = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [stats, setStats] = useState({
    totalSettlements: 10,
    highRiskCount: 3,
    borderPostCount: 4,
    averageAccessScore: 56
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getVillages();
        if (res?.data) {
          setVillages(res.data);
          if (res.data.length > 0) setSelectedVillage(res.data[0]);
        }
        if (res?.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load villages:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <PageLayout
      title="Settlement Accessibility Registry"
      subtitle="Dedicated scoring model for remote, tribal, and border settlements with SHRUG v2.2 integration"
      badge="Objective 03"
    >
      {/* Quick KPI Stats */}
      <div className="kpi-grid">
        <div className="card-panel kpi-card">
          <div className="kpi-label">Total Settlements</div>
          <div className="kpi-value">{loading ? '-' : stats.totalSettlements}</div>
          <div className="kpi-sub">Across active corridors</div>
        </div>
        <div className="card-panel kpi-card">
          <div className="kpi-label">Critically Isolated</div>
          <div className="kpi-value" style={{ color: 'var(--accent-rose)' }}>{loading ? '-' : stats.highRiskCount}</div>
          <div className="kpi-sub">Access score &lt; 40%</div>
        </div>
        <div className="card-panel kpi-card">
          <div className="kpi-label">Strategic Border Outposts</div>
          <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{loading ? '-' : stats.borderPostCount}</div>
          <div className="kpi-sub">Frontier security priority</div>
        </div>
        <div className="card-panel kpi-card">
          <div className="kpi-label">Average Accessibility</div>
          <div className="kpi-value" style={{ color: stats.averageAccessScore >= 60 ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            {loading ? '-' : `${stats.averageAccessScore}%`}
          </div>
          <div className="kpi-sub">{stats.averageAccessScore >= 60 ? 'Acceptable Connectivity' : 'Needs Infrastructure'}</div>
        </div>
      </div>

      {/* Selected Settlement Inspector Card */}
      {selectedVillage && (
        <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Inspection Profile
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <MapPin size={18} color="var(--apple-blue)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedVillage.name}
                </h3>
                {selectedVillage.borderZone && (
                  <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={11} /> Border Outpost
                  </span>
                )}
                <span className="badge badge-info">{selectedVillage.corridorName || 'Regional Outpost'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Population</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedVillage.population?.toLocaleString()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DEM Elevation</span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedVillage.elevationMeters ? `${selectedVillage.elevationMeters}m` : '-'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Seasonal Isolation</span>
                <strong style={{ color: selectedVillage.seasonalCutoffDays > 60 ? 'var(--accent-rose)' : 'var(--text-secondary)' }}>
                  {selectedVillage.seasonalCutoffDays} days/yr
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Access Score</span>
                <strong style={{ color: 'var(--accent-primary)', fontSize: '1.05rem' }}>{selectedVillage.accessScore}%</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Risk State</span>
                <span className={`badge ${selectedVillage.riskStatus === 'High' ? 'badge-danger' : selectedVillage.riskStatus === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
                  {selectedVillage.riskStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Hazards & Lifeline */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Primary Hazards:</span>
              <span style={{ color: 'var(--text-secondary)' }}>{selectedVillage.primaryHazards?.join(' • ') || 'None recorded'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', marginRight: '6px' }}>Recommended Lifeline:</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{selectedVillage.recommendedMode || 'All-Terrain 4WD'}</strong>
            </div>
          </div>

          {/* Outpost Stockpile & Burn-Rate Depletion Forecast */}
          <StockpileDepletionWidget village={selectedVillage} />
        </div>
      )}

      {/* Phase 3 Visualizations: 12-Month Calendar & Distribution Profiling */}
      <IsolationCalendarHeatmap villages={villages} />
      <AccessDistributionCharts />

      {/* Settlement Table */}
      <VillageTable
        villages={villages}
        selectedVillage={selectedVillage}
        onSelectVillage={setSelectedVillage}
      />
    </PageLayout>
  );
};

export default VillagesPage;
