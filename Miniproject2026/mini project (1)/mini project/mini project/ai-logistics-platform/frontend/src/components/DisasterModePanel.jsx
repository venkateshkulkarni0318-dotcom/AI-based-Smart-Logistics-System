import React, { useState } from 'react';
import { Siren, AlertTriangle, Plane, Truck } from 'lucide-react';
import TacticalDisasterHud from './TacticalDisasterHud';
import { playCrisisAlert, playDispatchChirp } from '../utils/soundEffects';

const DisasterModePanel = ({ isDisasterMode, onToggleDisasterMode }) => {
  const [sosList, setSosList] = useState([
    {
      id: 'sos-1',
      village: 'Zanskar Outpost (Pass Cutoff)',
      coordinates: '33.512°N, 76.883°E',
      type: 'Avalanche Road Blockade',
      severity: 'CRITICAL',
      needs: 'Emergency Insulin, Blood Plasma & Thermal Blankets',
      status: 'In Flight (UAV-7 Parachute Drop)',
      eta: '14 mins'
    },
    {
      id: 'sos-2',
      village: 'Majuli Char Settlement #4',
      coordinates: '26.950°N, 94.210°E',
      type: 'Monsoon Embankment Inundation',
      severity: 'CRITICAL',
      needs: 'Water Purification Generators & MRE Rations (200 units)',
      status: 'Assigned to Amphibious Barge FB-3',
      eta: '28 mins'
    },
    {
      id: 'sos-3',
      village: 'Longewala Desert Post',
      coordinates: '27.520°N, 70.150°E',
      type: 'Sandstorm Track Obliteration',
      severity: 'MODERATE',
      needs: 'Electrolyte Salts & Engine Filter Replacements',
      status: '6x6 Off-Road Convoy Escort',
      eta: '45 mins'
    }
  ]);

  const [notification, setNotification] = useState(null);
  const [customVillage, setCustomVillage] = useState('');
  const [customNeed, setCustomNeed] = useState('');
  const [showAddSos, setShowAddSos] = useState(false);

  const handleToggleModeWithAudio = () => {
    if (!isDisasterMode) {
      playCrisisAlert();
    }
    if (onToggleDisasterMode) onToggleDisasterMode();
  };

  const handleDeployUav = () => {
    playDispatchChirp();
    setNotification('Emergency Cargo UAV dispatched. Automated parachute drop mission active for critical sector.');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDeployAmphibious = () => {
    playDispatchChirp();
    setNotification('6x6 Amphibious Rescue Vehicle deployed with water purification & satellite telemetry gear.');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddSos = (e) => {
    e.preventDefault();
    if (!customVillage.trim()) return;

    const newSos = {
      id: `sos-${Date.now()}`,
      village: customVillage,
      coordinates: 'Manual Field Entry',
      type: 'Ground SOS Dispatch',
      severity: 'HIGH',
      needs: customNeed || 'Rations and medical kits',
      status: 'Queueing Rescue Unit',
      eta: 'Pending'
    };

    setSosList([newSos, ...sosList]);
    setCustomVillage('');
    setCustomNeed('');
    setShowAddSos(false);
    playDispatchChirp();
    setNotification(`SOS logged for ${customVillage}. Relief teams notified.`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="card-panel" style={{
      padding: '1.25rem',
      marginBottom: '1.25rem',
      border: isDisasterMode ? '2px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
      background: isDisasterMode ? 'var(--accent-rose-subtle)' : 'var(--bg-surface)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Siren size={22} color="var(--apple-red)" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Objective 05: Disaster Management &amp; Agency Alert Center
              </h3>
              <span className={`badge ${isDisasterMode ? 'badge-danger' : 'badge-info'}`}>
                {isDisasterMode ? 'CRISIS STATE ACTIVE' : 'STANDBY READY'}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Dedicated command interface for NDRF, SDMA, District Collectors &amp; Relief Agencies
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleModeWithAudio}
          className={`btn ${isDisasterMode ? 'btn-danger' : 'btn-secondary'}`}
          style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <AlertTriangle size={14} />
          <span>{isDisasterMode ? 'Deactivate Crisis State' : 'Activate Crisis Mode'}</span>
        </button>
      </div>

      {notification && (
        <div style={{
          background: 'var(--accent-primary-subtle)',
          border: '1px solid var(--accent-primary)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          {notification}
        </div>
      )}

      {/* Main Grid: Visual Feed + Live SOS Queue */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
        gap: '1.25rem',
        alignItems: 'start'
      }}>
        {/* Tactical Satellite HUD & Vector Radar Fallback */}
        <TacticalDisasterHud
          activeSector={sosList[0]?.village || 'Zanskar Outpost (Pass Cutoff)'}
          isDisasterMode={isDisasterMode}
        />

        {/* SOS Queue and Dispatch Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Priority SOS Requests ({sosList.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddSos(!showAddSos)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {showAddSos ? 'Cancel' : '+ Log SOS Signal'}
              </button>
            </div>

            {/* Custom SOS form */}
            {showAddSos && (
              <form onSubmit={handleAddSos} style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Village / Location Name"
                  value={customVillage}
                  onChange={(e) => setCustomVillage(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="input-control"
                  placeholder="Critical Needs (e.g., Blood, Food, Oxygen)"
                  value={customNeed}
                  onChange={(e) => setCustomNeed(e.target.value)}
                />
                <button type="submit" className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  Broadcast SOS Distress Alert
                </button>
              </form>
            )}

            {/* SOS List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
              {sosList.map((sos) => (
                <div
                  key={sos.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{sos.village}</strong>
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>{sos.severity}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '2px' }}>
                    Needs: {sos.needs}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>{sos.status}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>ETA: {sos.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Relief Dispatch Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleDeployUav}
              className="btn btn-danger"
              style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Plane size={14} />
              <span>Launch UAV Air-Drop</span>
            </button>
            <button
              type="button"
              onClick={handleDeployAmphibious}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Truck size={14} />
              <span>Deploy 6x6 Amphibious</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterModePanel;
