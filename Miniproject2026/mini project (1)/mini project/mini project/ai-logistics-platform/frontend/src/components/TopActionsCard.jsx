import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Truck, Ship, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * TopActionsCard Component
 * "Today's Top 3 Actions" for instantaneous officer decision-making with Apple design language.
 */
const TopActionsCard = () => {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState({});

  const actions = [
    {
      id: 1,
      priority: 'CRITICAL',
      color: 'var(--apple-red)',
      bg: 'var(--apple-red-subtle)',
      icon: Plane,
      title: 'Authorize Heavy UAV Sortie to Padum Depot',
      desc: 'Deliver blood & insulin reserves before T+14h winter weather closure over Pensi La.',
      target: '/disaster',
      actionLabel: 'Deploy Drone Sortie'
    },
    {
      id: 2,
      priority: 'HIGH',
      color: 'var(--apple-amber)',
      bg: 'var(--apple-amber-subtle)',
      icon: Truck,
      title: 'Dispatch BRO Snowplow & 4WD Escort',
      desc: 'Clear 3m avalanche snowpack at Mile 38; escorted 6x6 convoy protocol active.',
      target: '/routes',
      actionLabel: 'Inspect Route Profile'
    },
    {
      id: 3,
      priority: 'PRECAUTION',
      color: 'var(--apple-blue)',
      bg: 'var(--apple-blue-subtle)',
      icon: Ship,
      title: 'Pre-position 50t Grain at Majuli River Jetty',
      desc: 'Brahmaputra peak discharge in 48h; stage river freight barges at North Terminal.',
      target: '/multimodal',
      actionLabel: 'Review Waterway Freight'
    }
  ];

  const handleToggle = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--apple-text-primary)', margin: 0 }}>
              Today's Top 3 Tactical Directives
            </h3>
            <DataBadge isReal={false} label="Simulated Decision Engine" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', margin: '3px 0 0' }}>
            Immediate operational bottlenecks flagged by the multi-modal risk algorithm.
          </p>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--apple-text-secondary)' }}>
          Target Response Window: <strong className="text-blue">Next 4 Hours</strong>
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {actions.map((act) => {
          const isDone = completed[act.id];
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              style={{
                background: isDone ? 'rgba(52, 199, 89, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isDone ? 'var(--apple-green)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderLeft: `3px solid ${isDone ? 'var(--apple-green)' : act.color}`,
                borderRadius: 'var(--apple-radius-sm)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--apple-radius-pill)',
                    background: act.bg,
                    color: act.color,
                    border: `1px solid ${act.color}40`
                  }}>
                    {act.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(act.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      color: isDone ? 'var(--apple-green)' : 'var(--apple-text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isDone ? <CheckCircle2 size={13} /> : null}
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: act.bg,
                    color: act.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={14} />
                  </div>
                  <strong style={{ fontSize: '0.84rem', color: isDone ? 'var(--apple-text-tertiary)' : 'var(--apple-text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {act.title}
                  </strong>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--apple-text-secondary)', margin: '6px 0 0', lineHeight: 1.45 }}>
                  {act.desc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => navigate(act.target)}
                  className="apple-secondary-pill-btn"
                  style={{ width: 'auto', padding: '4px 12px' }}
                >
                  <span>{act.actionLabel}</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopActionsCard;
