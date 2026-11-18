import React, { useState } from 'react';
import DataBadge from './DataBadge';

/**
 * ModelComparisonCard Component (Phase 3 Requirement 6.2)
 * Comprehensive evaluation benchmark comparing Random Forest, XGBoost, Logistic Regression, and Rule-Based methods.
 */
const ModelComparisonCard = () => {
  const [selectedModel, setSelectedModel] = useState('rf');

  const models = [
    {
      id: 'rf',
      name: 'Random Forest (Current Production)',
      tag: 'PRODUCTION',
      tagColor: '#10b981',
      rocAuc: 0.912,
      precision: 0.884,
      recall: 0.865,
      f1: 0.874,
      latencyMs: 8,
      interpretability: 'TreeSHAP (Exact additivity)',
      sampleSize: '14,280 corridor events',
      confusion: { tp: 1220, fp: 160, fn: 190, tn: 3430 },
      pros: 'Handles collinear weather/terrain factors without overfitting; TreeSHAP gives verifiable local explanations.',
      cons: 'Slightly higher memory footprint (42 MB tree cache) than simple linear baselines.'
    },
    {
      id: 'xgb',
      name: 'XGBoost Gradient Boosting',
      tag: 'CHALLENGER',
      tagColor: '#38bdf8',
      rocAuc: 0.924,
      precision: 0.891,
      recall: 0.879,
      f1: 0.885,
      latencyMs: 14,
      interpretability: 'Kernel / Tree SHAP',
      sampleSize: '14,280 corridor events',
      confusion: { tp: 1240, fp: 152, fn: 170, tn: 3438 },
      pros: 'Highest raw discrimination metric; sharp decision frontiers on extreme precipitous slopes.',
      cons: 'Marginally slower inference in edge deployments; hyperparameter tuning requires re-regularization.'
    },
    {
      id: 'lr',
      name: 'Regularized Logistic Regression',
      tag: 'BASELINE',
      tagColor: '#a855f7',
      rocAuc: 0.781,
      precision: 0.720,
      recall: 0.690,
      f1: 0.705,
      latencyMs: 1.2,
      interpretability: 'Linear Log-Odds Coefficients',
      sampleSize: '14,280 corridor events',
      confusion: { tp: 973, fp: 378, fn: 437, tn: 3212 },
      pros: 'Sub-millisecond inference; zero complex tree logic.',
      cons: 'Fails to capture non-linear threshold jumps (e.g. soil saturation > 85% suddenly causing mudslides).'
    },
    {
      id: 'rules',
      name: 'IMD Static Threshold Rules',
      tag: 'HEURISTIC',
      tagColor: '#f59e0b',
      rocAuc: 0.710,
      precision: 0.650,
      recall: 0.610,
      f1: 0.629,
      latencyMs: 0.4,
      interpretability: 'If-Else Conditional Tree',
      sampleSize: '14,280 corridor events',
      confusion: { tp: 860, fp: 463, fn: 550, tn: 3127 },
      pros: 'Human readable; familiar to legacy disaster relief agencies.',
      cons: 'Ignores local slope angles and soil saturation history; generates high false alarms in flatlands.'
    }
  ];

  const active = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              ML Model Benchmark &amp; Cross-Validation Evaluation
            </h3>
            <DataBadge isReal={false} label="Simulated ML Benchmark" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Empirical validation against historical monsoon blockade ground truth (14,280 historical corridor checkpoints).
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '2px',
          fontSize: '0.72rem'
        }}>
          {models.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModel(m.id)}
              style={{
                background: selectedModel === m.id ? 'var(--accent-primary)' : 'transparent',
                color: selectedModel === m.id ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.72rem'
              }}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Matrix Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '1rem' }}>
        <table className="data-table" style={{ minWidth: '650px', width: '100%', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              <th>Model Architecture</th>
              <th>Status</th>
              <th>ROC-AUC</th>
              <th>Precision</th>
              <th>Recall</th>
              <th>F1-Score</th>
              <th>Latency</th>
              <th>Interpretability</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => {
              const isSelected = m.id === selectedModel;
              return (
                <tr
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent'
                  }}
                >
                  <td style={{ fontWeight: 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {m.name}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: `${m.tagColor}22`,
                      color: m.tagColor,
                      fontWeight: 700
                    }}>
                      {m.tag}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.rocAuc.toFixed(3)}</td>
                  <td>{(m.precision * 100).toFixed(1)}%</td>
                  <td>{(m.recall * 100).toFixed(1)}%</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{m.f1.toFixed(3)}</td>
                  <td>{m.latencyMs} ms</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{m.interpretability}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Model Deep Dive: Confusion Matrix + Trade-Off Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        {/* Confusion Matrix */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {active.name}: Confusion Matrix (Validation Set: 5,000 checks)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr', gap: '4px', fontSize: '0.72rem' }}>
            <div />
            <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Pred: Safe</div>
            <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Pred: Blocked</div>

            <div style={{ fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Actual Safe</div>
            <div style={{ background: 'var(--accent-emerald-subtle)', border: '1px solid var(--accent-emerald)', padding: '6px', textAlign: 'center', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{active.confusion.tn}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>True Neg (Safe)</div>
            </div>
            <div style={{ background: 'var(--accent-amber-subtle)', border: '1px solid var(--accent-amber)', padding: '6px', textAlign: 'center', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{active.confusion.fp}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>False Pos (Alarm)</div>
            </div>

            <div style={{ fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Actual Blocked</div>
            <div style={{ background: 'var(--accent-rose-subtle)', border: '1px solid var(--accent-rose)', padding: '6px', textAlign: 'center', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>{active.confusion.fn}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>False Neg (Missed)</div>
            </div>
            <div style={{ background: 'var(--accent-emerald-subtle)', border: '1px solid var(--accent-emerald)', padding: '6px', textAlign: 'center', borderRadius: '4px' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{active.confusion.tp}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>True Pos (Caught)</div>
            </div>
          </div>
        </div>

        {/* Qualitative Pros/Cons & Operational Rationale */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Operational Rationale &amp; Explainability
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-emerald)' }}>Advantages:</strong> {active.pros}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>Limitations:</strong> {active.cons}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            Explainability Engine: {active.interpretability}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: Random Forest was selected for production because it achieves 87.4% F1 accuracy while satisfying strict TreeSHAP mathematical additivity for legal auditability.
      </div>
    </div>
  );
};

export default ModelComparisonCard;
