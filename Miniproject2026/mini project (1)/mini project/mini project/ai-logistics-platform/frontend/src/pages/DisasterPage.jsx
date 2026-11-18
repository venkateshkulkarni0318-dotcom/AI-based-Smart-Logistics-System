import React from 'react';
import { Flame, ShieldAlert, Building2, MapPin, Navigation, AlertTriangle } from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';
import PageLayout from '../components/PageLayout';
import DisasterModePanel from '../components/DisasterModePanel';
import ExecutiveSituationBriefing from '../components/ExecutiveSituationBriefing';
import DispatchTimelineGantt from '../components/DispatchTimelineGantt';
import NLPTriageConsole from '../components/NLPTriageConsole';
import CaseEnginePanel from '../components/CaseEnginePanel';

const DisasterPage = () => {
  const { isDisasterMode, toggleDisasterMode } = useUiPreferences();

  return (
    <PageLayout
      title="Disaster Management Center"
      subtitle="Emergency response command for NDRF, SDMA, District Collectors & Relief Agencies"
      badge="Objective 05"
      actions={
        <button
          type="button"
          onClick={toggleDisasterMode}
          className={`btn ${isDisasterMode ? 'btn-danger' : 'btn-secondary'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', borderRadius: 'var(--radius-full)' }}
        >
          {isDisasterMode ? (
            <>
              <Flame size={15} color="#fff" />
              <span>Crisis Mode Active</span>
            </>
          ) : (
            <>
              <ShieldAlert size={15} />
              <span>Activate Disaster Mode</span>
            </>
          )}
        </button>
      }
    >
      <DisasterModePanel
        isDisasterMode={isDisasterMode}
        onToggleDisasterMode={toggleDisasterMode}
      />

      {/* Phase 3 Visualizations: Executive Commander Briefing, Live Dispatch Timeline & NLP Triage */}
      <ExecutiveSituationBriefing />
      <DispatchTimelineGantt />
      <NLPTriageConsole />

      {/* Phase 2: Complete Contingency & Hazard Cases (T1–T29) */}
      <CaseEnginePanel />

      {/* Agency Protocol Cards */}
      <div className="card-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg, 16px)' }}>
        <div style={{ marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
            Agency Response Protocols &amp; Standard Operating Procedures
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            Integrated crisis coordination matrix across disaster response agencies
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {[
            {
              agency: 'NDRF',
              full: 'National Disaster Response Force',
              role: 'Primary tactical search, rescue and watercraft extraction in high-gradient flood and landslide washout zones.',
              Icon: ShieldAlert,
              color: 'var(--apple-red)'
            },
            {
              agency: 'SDMA',
              full: 'State Disaster Management Authority',
              role: 'Inter-district resource staging, shelter supply chains, and emergency requisition of civil transport assets.',
              Icon: Building2,
              color: 'var(--apple-blue)'
            },
            {
              agency: 'District Administration',
              full: 'District Collector Command',
              role: 'Local civil authority, executive dispatch clearance, and community emergency communications dispatch.',
              Icon: MapPin,
              color: 'var(--apple-amber)'
            },
            {
              agency: 'Autonomous UAV Wing',
              full: 'Emergency Cargo Drone Fleet',
              role: 'Precision parachute delivery for insulin, anti-venom, baby formula, and satellite communications equipment.',
              Icon: Navigation,
              color: 'var(--apple-teal)'
            }
          ].map((item, i) => {
            const ItemIcon = item.Icon;
            return (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md, 14px)',
                padding: '1.1rem',
                transition: 'all var(--timing-fast) var(--ease-spring)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm, 8px)',
                    background: `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ItemIcon size={16} color={item.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.agency}</div>
                    <div style={{ fontSize: '0.7rem', color: item.color }}>{item.full}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {item.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default DisasterPage;
