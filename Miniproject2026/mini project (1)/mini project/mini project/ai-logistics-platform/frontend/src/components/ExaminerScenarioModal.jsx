import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  CloudSnow,
  Waves,
  Wind,
  Sun,
  Copy,
  Check,
  X,
  Play,
  Loader2,
  MapPin
} from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { useCommandRole } from '../context/CommandRoleContext';
import { playCrisisAlert, playDispatchChirp, playSuccessChime } from '../utils/soundEffects';

/**
 * ExaminerScenarioModal Component
 * 1-Click Test Scenarios designed for college project evaluators, professors & viva panels.
 */
const ExaminerScenarioModal = () => {
  const { examinerOpen, setExaminerOpen } = useUiPreferences();
  const { setRole } = useCommandRole();
  const navigate = useNavigate();
  const [activeTestId, setActiveTestId] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!examinerOpen) return null;

  const testCases = [
    {
      id: 'cloudburst_avalanche',
      num: '01',
      title: 'Cloudburst & Avalanche Pass Severance',
      corridor: 'Western Himalayan Highland (Zanskar Pass)',
      Icon: CloudSnow,
      color: '#ff453a',
      badge: 'AVALANCHE CUTOFF',
      triggerCondition: 'Precipitation 88 mm/h, Slope 34°, Air Temp -14°C',
      expectedOutcome: 'Road severed at Mile 38. Disruption risk spikes to 92%. System executes fallback hierarchy to deploy Heavy UAV Sortie with blood & insulin.',
      targetPage: '/disaster',
      actionRole: 'ndrf',
      soundType: 'crisis'
    },
    {
      id: 'brahmaputra_flood',
      num: '02',
      title: 'Brahmaputra Delta Stage-3 Flash Flood',
      corridor: 'Brahmaputra Floodplain (Majuli Island)',
      Icon: Waves,
      color: '#0a84ff',
      badge: 'WATERWAY SHIFT',
      triggerCondition: 'Discharge 48,000 m³/s, Road Submergence >1.5m',
      expectedOutcome: 'Highways washed out. System redirects bulk food grain (50 tonnes) to inland river freight barges with amphibious support.',
      targetPage: '/multimodal',
      actionRole: 'logistics',
      soundType: 'dispatch'
    },
    {
      id: 'desert_duststorm',
      num: '03',
      title: 'Thar Border 70 km/h Severe Dust Storm',
      corridor: 'Thar Arid Frontier (Tanot - Longewala)',
      Icon: Wind,
      color: '#ff9f0a',
      badge: 'DRONE GROUNDED',
      triggerCondition: 'Peak Wind Gusts 72 km/h, Ambient Temp 46°C, Vis < 200m',
      expectedOutcome: 'High wind shear triggers UAV flight safety lock. Algorithm schedules night 6x6 convoy escort with auxiliary water cooling.',
      targetPage: '/case-studies',
      actionRole: 'drone_pilot',
      soundType: 'dispatch'
    },
    {
      id: 'nominal_reset',
      num: '04',
      title: 'Reset to Nominal Fair-Weather State',
      corridor: 'All Regional Corridors',
      Icon: Sun,
      color: '#30d158',
      badge: 'ALL MODES NORMAL',
      triggerCondition: 'Fair weather, roads open, average access index 68%',
      expectedOutcome: 'Standard multi-modal operations restored. Low baseline risk across highway and rail sectors.',
      targetPage: '/',
      actionRole: 'magistrate',
      soundType: 'success'
    }
  ];

  const handleRunTest = (test) => {
    setActiveTestId(test.id);

    if (test.soundType === 'crisis') {
      playCrisisAlert();
    } else if (test.soundType === 'dispatch') {
      playDispatchChirp();
    } else {
      playSuccessChime();
    }

    if (test.actionRole) {
      setRole(test.actionRole);
    }

    setTimeout(() => {
      setExaminerOpen(false);
      navigate(test.targetPage);
    }, 600);
  };

  const copyVivaNotes = () => {
    const text = `AI-LOGIX: Project Viva Evaluation Summary\n` +
      `- Core Objectives: 6 Multi-Modal Modules (Road, Rail, Waterway, UAV)\n` +
      `- Explainability: TreeSHAP Exact Factor Additivity (Base + ΣSHAP)\n` +
      `- Data Integration: 585,179 SHRUG keys + SRTM 30m Digital Elevation Model\n` +
      `- Resilience: 29 Contingency Edge Cases (T1-T29) with 100% Offline Rule Fallback\n` +
      `- Tech Stack: React 18, Vite, Node Gateway, Python FastAPI, SQLite WAL`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="examiner-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setExaminerOpen(false);
      }}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl, 20px)',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--elevation-3)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm, 8px)',
                background: 'var(--apple-blue-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={20} color="var(--apple-blue)" />
              </div>
              <h2 id="examiner-modal-title" style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Examiner / Viva Challenge Panel
              </h2>
              <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                PROFESSOR DEMO SUITE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', margin: '4px 0 0 46px' }}>
              One-click live scenarios to test multi-modal fallback, ML inference, and 100% offline edge rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setExaminerOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Challenge Scenarios Grid */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          overflowY: 'auto',
          paddingRight: '4px',
          marginBottom: '1rem'
        }}>
          {testCases.map((tc) => {
            const isRunning = activeTestId === tc.id;
            const ItemIcon = tc.Icon;
            return (
              <div
                key={tc.id}
                style={{
                  background: isRunning ? 'var(--apple-blue-subtle)' : 'var(--bg-card)',
                  border: `1px solid ${isRunning ? tc.color : 'var(--border-subtle)'}`,
                  borderLeft: `4px solid ${tc.color}`,
                  borderRadius: 'var(--radius-md, 14px)',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  transition: 'all var(--timing-fast) var(--ease-spring)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm, 8px)',
                      background: `${tc.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ItemIcon size={16} color={tc.color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                          Test {tc.num}: {tc.title}
                        </strong>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: `${tc.color}22`,
                          color: tc.color
                        }}>
                          {tc.badge}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} color="var(--text-tertiary)" />
                        <span>{tc.corridor}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRunTest(tc)}
                    style={{
                      background: tc.color,
                      color: '#fff',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: `0 2px 10px ${tc.color}40`,
                      transition: 'all var(--timing-fast) var(--ease-spring)'
                    }}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 size={13} className="spin-icon" />
                        <span>Executing...</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} fill="#fff" />
                        <span>Run Test</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.5rem',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm, 10px)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Environmental Trigger:
                    </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{tc.triggerCondition}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Expected Autonomous Action:
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{tc.expectedOutcome}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Copy Viva Summary button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            onClick={copyVivaNotes}
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', padding: '6px 14px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? (
              <>
                <Check size={14} color="var(--apple-green)" />
                <span>Viva Notes Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Viva Summary for Evaluators</span>
              </>
            )}
          </button>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
            100% Offline • SQLite WAL • TreeSHAP Exact Additivity
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExaminerScenarioModal;
