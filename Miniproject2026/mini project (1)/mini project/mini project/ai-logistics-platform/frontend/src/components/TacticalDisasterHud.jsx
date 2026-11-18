import React, { useState } from 'react';
import DataBadge from './DataBadge';

/**
 * TacticalDisasterHud Component (Fixes Issue A1)
 * Provides a reliable, offline-ready tactical HUD.
 * Renders local image if available, with an inline vector HUD fallback that never breaks.
 */
const TacticalDisasterHud = ({ activeSector = 'Zanskar Outpost', isDisasterMode = false }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [useVectorHud, setUseVectorHud] = useState(false);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: isDisasterMode ? '1.5px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
      height: '320px',
      background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #060911 100%)',
      boxShadow: isDisasterMode ? '0 0 20px rgba(244, 63, 94, 0.2)' : 'none'
    }}>
      {/* If image loads cleanly and vector toggle is off, show image; else show inline tactical vector HUD */}
      {!imageFailed && !useVectorHud ? (
        <img
          src="/images/disaster_relief.jpg"
          alt="Tactical Satellite HUD showing emergency disaster air-drop"
          onError={() => setImageFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        /* Standalone Inline Vector SVG HUD (100% offline, never breaks) */
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 600 320"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              {/* Tactical grid */}
              <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(2, 132, 199, 0.15)" strokeWidth="0.8" />
              </pattern>
              {/* Glowing gradients */}
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(244, 63, 94, 0.25)" />
                <stop offset="60%" stopColor="rgba(2, 132, 199, 0.08)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Grid */}
            <rect width="600" height="320" fill="url(#radarGrid)" />

            {/* Concentric Range Rings */}
            <circle cx="300" cy="160" r="130" fill="none" stroke="rgba(2, 132, 199, 0.25)" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx="300" cy="160" r="85" fill="none" stroke="rgba(2, 132, 199, 0.35)" strokeWidth="1" />
            <circle cx="300" cy="160" r="40" fill="url(#radarSweep)" stroke="rgba(244, 63, 94, 0.5)" strokeWidth="1.2" />

            {/* Crosshairs */}
            <line x1="300" y1="20" x2="300" y2="300" stroke="rgba(2, 132, 199, 0.3)" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="140" y1="160" x2="460" y2="160" stroke="rgba(2, 132, 199, 0.3)" strokeWidth="1" strokeDasharray="5,5" />

            {/* Compass Marks */}
            <text x="300" y="32" textAnchor="middle" fill="var(--accent-primary)" fontSize="10" fontWeight="700">N (000°)</text>
            <text x="450" y="156" textAnchor="end" fill="var(--text-muted)" fontSize="9">E</text>
            <text x="300" y="295" textAnchor="middle" fill="var(--text-muted)" fontSize="9">S (180°)</text>
            <text x="150" y="156" textAnchor="start" fill="var(--text-muted)" fontSize="9">W</text>

            {/* Flight Path Vector Line from Base to Outpost */}
            <path
              d="M 180 240 Q 240 180 300 160"
              fill="none"
              stroke="var(--accent-rose)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />

            {/* Target Drop Zone */}
            <g transform="translate(300, 160)">
              <circle r="12" fill="none" stroke="var(--accent-rose)" strokeWidth="2" />
              <circle r="4" fill="var(--accent-rose)" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="var(--accent-rose)" strokeWidth="1.5" />
              <line x1="0" y1="-18" x2="0" y2="18" stroke="var(--accent-rose)" strokeWidth="1.5" />
              <text x="16" y="-8" fill="#f8fafc" fontSize="10" fontWeight="800">DROP ZONE #1</text>
              <text x="16" y="5" fill="var(--accent-rose)" fontSize="8" fontWeight="600">33.512°N, 76.883°E</text>
            </g>

            {/* UAV Drone Icon on Route */}
            <g transform="translate(245, 195)">
              <rect x="-8" y="-8" width="16" height="16" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="12" y="4" fill="#38bdf8" fontSize="9" fontWeight="700">UAV-7 (IN FLIGHT)</text>
            </g>

            {/* Altitude & Range telemetry tags */}
            <text x="440" y="100" fill="var(--text-muted)" fontSize="8">RNG: 24.6 km</text>
            <text x="440" y="114" fill="var(--accent-emerald)" fontSize="9" fontWeight="600">ALT: 3,850m ASL</text>
            <text x="440" y="128" fill="var(--text-secondary)" fontSize="8">SPEED: 95 km/h</text>
          </svg>

          {/* Top telemetry status overlay */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.72rem',
            background: 'rgba(9, 13, 22, 0.75)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(148, 163, 184, 0.15)'
          }}>
            <span style={{ color: 'var(--accent-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block' }} />
              <span>TACTICAL HUD: EMERGENCY AIR-DROP DISPATCH</span>
            </span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
              NavIC LOCK: 11 SATS
            </span>
          </div>
        </div>
      )}

      {/* Bottom Information Ribbon */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 12px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(9, 13, 22, 0.95) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '0.75rem',
        color: 'var(--text-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: 'var(--accent-rose)' }}>CRISIS AIRSPACE:</strong>
          <span>Sector: {activeSector}</span>
          <DataBadge isReal={false} label="Simulated HUD" />
        </div>

        {/* HUD View Switcher Button */}
        <button
          type="button"
          onClick={() => setUseVectorHud(!useVectorHud)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '0.68rem',
            cursor: 'pointer',
            fontWeight: 600
          }}
          title="Switch between satellite visual and vector tactical radar HUD"
        >
          {useVectorHud ? 'Photo View' : 'Tactical Radar'}
        </button>
      </div>
    </div>
  );
};

export default TacticalDisasterHud;
