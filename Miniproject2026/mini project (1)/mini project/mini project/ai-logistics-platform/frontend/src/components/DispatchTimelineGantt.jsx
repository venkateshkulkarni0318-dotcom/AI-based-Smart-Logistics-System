import React, { useState } from 'react';
import { Navigation, Truck, Ship, Plane, Clock, Radio, Info } from 'lucide-react';
import DataBadge from './DataBadge';

/**
 * DispatchTimelineGantt Component (Phase 3 Requirement 6.2)
 * Live Tactical Gantt Timeline showing Active Disaster Relief Dispatches across Air, Road & Water.
 */
const DispatchTimelineGantt = () => {
  const [selectedMission, setSelectedMission] = useState(null);

  const missions = [
    {
      id: 'MSN-UAV-01',
      name: 'UAV-Alpha (Medical Drop)',
      mode: 'Cargo UAV',
      Icon: Navigation,
      destination: 'Padum Hospital Dropzone',
      cargo: 'Emergency O-Negative Blood & Cold-Chain Insulin (42 kg)',
      startHour: 10.0, // 10:00 AM
      endHour: 12.5,   // 12:30 PM
      progress: 68,
      status: 'In Flight (Transit to DZ)',
      statusColor: '#38bdf8',
      telemetry: 'NavIC Locked • Altitude: 4,120m • Ground Speed: 92 km/h • Battery: 74%',
      eta: '11:45 IST'
    },
    {
      id: 'MSN-BRO-07',
      name: 'BRO-Convoy-07 (Snow Clearance)',
      mode: 'Heavy 6x6 & Dozer',
      Icon: Truck,
      destination: 'Pensi La Pass (Mile 38)',
      cargo: 'Hydraulic Cutter, Salt Aggregate & 4WD Escort',
      startHour: 9.0,
      endHour: 15.0,
      progress: 42,
      status: 'Active Clearing (Blasting)',
      statusColor: '#f59e0b',
      telemetry: 'Radio: VHF Ch 4 • Temp: -14°C • Fuel: 82% • Debris Removed: 140 tonnes',
      eta: '14:30 IST'
    },
    {
      id: 'MSN-NDRF-03',
      name: 'NDRF Watercraft Flotilla-3',
      mode: 'Rescue Barge & RIBs',
      Icon: Ship,
      destination: 'Majuli Flood Ward 4',
      cargo: 'Medical Trauma Kit, Inflatable Rafts & 250 Ration Packets',
      startHour: 10.5,
      endHour: 13.5,
      progress: 55,
      status: 'Evacuation in Progress',
      statusColor: '#10b981',
      telemetry: 'Water Draft: 1.8m • Current: 4.2 knots • Evacuees on Board: 34 persons',
      eta: '12:50 IST'
    },
    {
      id: 'MSN-IAF-C17',
      name: 'IAF Heavy Sortie (Air Drop)',
      mode: 'C-17 Globemaster III',
      Icon: Plane,
      destination: 'Kaza High Plateau Dropzone',
      cargo: 'Containerized Diesel Generators & Field Hospital Tents (18.5 tonnes)',
      startHour: 11.5,
      endHour: 14.0,
      progress: 15,
      status: 'Pre-Flight Engine Start',
      statusColor: '#a855f7',
      telemetry: 'Airbase: Chandigarh • Runway Check: Complete • NavIC Waypoint Loaded',
      eta: '13:15 IST'
    }
  ];

  // Gantt time range: 09:00 to 16:00 (7 hours total)
  const minHour = 9.0;
  const maxHour = 16.0;
  const totalHours = maxHour - minHour;
  const currentHour = 11.75; // 11:45 AM (NOW line)

  const getLeftPct = (hour) => ((hour - minHour) / totalHours) * 100;
  const getWidthPct = (start, end) => ((end - start) / totalHours) * 100;

  const hoursList = [9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Tactical Mission Timeline (Active Multi-Modal Sorties)
            </h3>
            <DataBadge isReal={false} label="Simulated Live Dispatch" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Real-time synchronization across Autonomous UAV, BRO heavy engineering, NDRF boat flotilla &amp; Airforce relief.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '4px',
          padding: '4px 10px',
          color: '#38bdf8',
          fontWeight: 600
        }}>
          ⏱️ Current Ops Time: 11:45 IST (UTC+05:30)
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ minWidth: '650px', position: 'relative' }}>
          {/* Time axis header */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Mission Call-Sign &amp; Mode
            </div>
            <div style={{ position: 'relative', height: '22px' }}>
              {hoursList.map((h) => (
                <div
                  key={h}
                  style={{
                    position: 'absolute',
                    left: `${getLeftPct(h)}%`,
                    transform: 'translateX(-50%)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {h < 10 ? `0${h}:00` : `${h}:00`}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Grid Lines & Current Time Line */}
          <div style={{ position: 'relative' }}>
            {/* Background grid lines */}
            <div style={{ position: 'absolute', left: '220px', right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
              {hoursList.map((h) => (
                <div
                  key={h}
                  style={{
                    position: 'absolute',
                    left: `${getLeftPct(h)}%`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--border-subtle)',
                    opacity: 0.6
                  }}
                />
              ))}

              {/* Vertical "NOW" Indicator Line */}
              <div
                style={{
                  position: 'absolute',
                  left: `${getLeftPct(currentHour)}%`,
                  top: '-15px',
                  bottom: '-5px',
                  width: '2px',
                  background: '#f43f5e',
                  zIndex: 10,
                  boxShadow: '0 0 8px rgba(244, 63, 94, 0.8)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '-18px',
                  background: '#f43f5e',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '3px'
                }}>
                  NOW
                </div>
              </div>
            </div>

            {/* Mission Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {missions.map((m) => {
                const isSelected = selectedMission?.id === m.id;
                const left = getLeftPct(m.startHour);
                const width = getWidthPct(m.startHour, m.endHour);

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMission(m)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '220px 1fr',
                      alignItems: 'center',
                      background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-surface-elevated)',
                      border: `1px solid ${isSelected ? 'var(--apple-blue-border)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm, 10px)',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'all var(--timing-fast) var(--ease-spring)'
                    }}
                  >
                    {/* Mission Info Column */}
                    <div style={{ paddingRight: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: 'var(--radius-xs, 6px)',
                          background: `${m.statusColor}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {m.Icon && <m.Icon size={13} color={m.statusColor} />}
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {m.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        To: {m.destination}
                      </div>
                    </div>

                    {/* Gantt Bar Column */}
                    <div style={{ position: 'relative', height: '28px', display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: `${left}%`,
                          width: `${width}%`,
                          height: '22px',
                          background: `${m.statusColor}25`,
                          border: `1.5px solid ${m.statusColor}`,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 6px'
                        }}
                      >
                        {/* Progress fill */}
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${m.progress}%`,
                            background: `${m.statusColor}55`,
                            borderRadius: '3px 0 0 3px'
                          }}
                        />

                        {/* Bar Label */}
                        <span style={{
                          position: 'relative',
                          zIndex: 2,
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                        }}>
                          {m.status} ({m.progress}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Mission Telemetry Inspector */}
      <div style={{
        marginTop: '1rem',
        padding: '0.85rem 1rem',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.75rem'
      }}>
        {selectedMission ? (
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedMission.Icon && <selectedMission.Icon size={16} color="var(--apple-blue)" />}
              <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {selectedMission.id}: {selectedMission.name}
              </strong>
              <span style={{
                background: `${selectedMission.statusColor}22`,
                color: selectedMission.statusColor,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '0.65rem'
              }}>
                {selectedMission.status}
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              <strong>Cargo:</strong> {selectedMission.cargo}
            </div>
            <div style={{ color: 'var(--accent-primary)', marginTop: '2px', fontFamily: 'monospace', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={12} />
              <span>{selectedMission.telemetry} | Expected Arrival: <strong>{selectedMission.eta}</strong></span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={12} color="var(--apple-blue)" />
            <span>Click on any active sortie above to inspect live GPS telemetry, cargo manifest, and fuel/battery reserve levels.</span>
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: Autonomous UAVs operate simultaneously with ground snowplows and watercraft to maintain continuity when primary mountain roads are closed.
      </div>
    </div>
  );
};

export default DispatchTimelineGantt;
