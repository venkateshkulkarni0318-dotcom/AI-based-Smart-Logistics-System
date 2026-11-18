import React, { useState, useEffect } from 'react';
import { Siren, CloudRain, CheckCircle2, RadioTower } from 'lucide-react';

/**
 * CommandTicker Component
 * Real-time operational incident and weather alert ticker with Apple design language.
 */
const CommandTicker = () => {
  const alerts = [
    {
      id: 1,
      level: 'CRITICAL',
      icon: Siren,
      color: 'var(--apple-red)',
      bg: 'var(--apple-red-subtle)',
      text: 'AVALANCHE BLOCKADE: Pensi La Pass (NH-301) closed at Mile 38 - Autonomous UAV lifeline deployed to Padum Depot.'
    },
    {
      id: 2,
      level: 'WEATHER WARNING',
      icon: CloudRain,
      color: 'var(--apple-amber)',
      bg: 'var(--apple-amber-subtle)',
      text: 'MONSOON INUNDATION: Brahmaputra discharge at 42,000 m³/s - Majuli shallow-draft freight barges operating on high-alert.'
    },
    {
      id: 3,
      level: 'OPERATIONAL CLEARANCE',
      icon: CheckCircle2,
      color: 'var(--apple-green)',
      bg: 'var(--apple-green-subtle)',
      text: 'CORRIDOR OPEN: Zojila Pass opened for escorted 4WD convoy transit under Border Roads Organization Taskforce 07.'
    },
    {
      id: 4,
      level: 'SYSTEM ADVISORY',
      icon: RadioTower,
      color: 'var(--apple-blue)',
      bg: 'var(--apple-blue-subtle)',
      text: 'DATA INTEGRITY: NavIC satellite fix active; Open-Meteo offline SQLite cache refreshed for next 72-hour operational cycle.'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [alerts.length]);

  const active = alerts[currentIdx];
  const IconComponent = active.icon;

  return (
    <div
      className="card-panel"
      style={{
        padding: '8px 14px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        flexWrap: 'wrap',
        borderColor: `rgba(255, 255, 255, 0.12)`,
        borderRadius: 'var(--apple-radius-card)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: active.bg,
          color: active.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <IconComponent size={13} />
        </div>

        <span style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          background: active.bg,
          color: active.color,
          padding: '2px 8px',
          borderRadius: 'var(--apple-radius-pill)',
          letterSpacing: '0.04em',
          border: `1px solid ${active.color}40`
        }}>
          {active.level}
        </span>

        <span style={{ fontSize: '0.78rem', color: 'var(--apple-text-primary)', fontWeight: 500 }}>
          {active.text}
        </span>
      </div>

      {/* Cycle indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {alerts.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIdx(i)}
            style={{
              width: i === currentIdx ? '16px' : '6px',
              height: '5px',
              borderRadius: 'var(--apple-radius-pill)',
              background: i === currentIdx ? active.color : 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            aria-label={`Alert ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CommandTicker;
