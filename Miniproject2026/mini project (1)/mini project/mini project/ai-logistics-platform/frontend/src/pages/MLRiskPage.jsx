import React from 'react';
import { Layers, Scale, Target, TrendingUp } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import MLRiskSimulator from '../components/MLRiskSimulator';
import RiskHeatmap from '../components/RiskHeatmap';
import Forecast48hChart from '../components/Forecast48hChart';
import ModelComparisonCard from '../components/ModelComparisonCard';

const MLRiskPage = () => {
  return (
    <PageLayout
      title="ML Disruption Risk Predictor"
      subtitle="Multi-factor predictive ensemble combining live weather, elevation slope gradients & historical blockades"
      badge="Objective 02"
    >
      <MLRiskSimulator />

      {/* Phase 3 Visualizations: 2D Terrain Heatmap & 48-Hour Forecast with 90% CI */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <RiskHeatmap />
        <Forecast48hChart />
      </div>

      {/* Phase 3 Visualization: Benchmark Evaluation & Confusion Matrix */}
      <ModelComparisonCard />

      {/* Model Technical Documentation */}
      <div className="card-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Model Architecture &amp; Ensemble Specifications
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {[
            {
              title: 'Multi-Modal Input Vectors',
              icon: Layers,
              items: [
                'Precipitation intensity (0 - 150 mm/h)',
                'Peak wind shear velocity (0 - 120 km/h)',
                'Subsurface soil moisture saturation (%)',
                'SRTM 30m DEM terrain slope gradient (°)'
              ]
            },
            {
              title: 'Ensemble Weight Distribution',
              icon: Scale,
              items: [
                'Precipitation intensity: 30% weight',
                'Soil liquefaction saturation: 25% weight',
                'Terrain slope gradient: 20% weight',
                'Wind gust & history: 25% weight'
              ]
            },
            {
              title: 'Operational Risk Classifications',
              icon: Target,
              items: [
                '0-39%: LOW: nominal surface transport',
                '40-69%: MODERATE: 4WD/6x6 convoy escort',
                '70-100%: CRITICAL: ground travel suspended'
              ]
            },
            {
              title: 'Validation & Benchmarks',
              icon: TrendingUp,
              items: [
                'Trained on Himalayan & Riverine incident series',
                'Cross-validated across 5 terrain categories',
                'Sub-second inference for real-time dispatch',
                'Continuous calibration with satellite precipitation'
              ]
            }
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Icon size={16} color="var(--apple-blue)" />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{card.title}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      padding: '3px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-primary)', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default MLRiskPage;
