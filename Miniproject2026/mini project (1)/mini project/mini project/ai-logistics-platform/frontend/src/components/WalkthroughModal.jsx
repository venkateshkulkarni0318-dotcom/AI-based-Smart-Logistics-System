import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSnow,
  Brain,
  Search,
  ShieldAlert,
  Navigation,
  Compass,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  Check
} from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';

/**
 * WalkthroughModal Component (Phase 4 Requirement 6.4)
 * Step-by-Step Guided Scenario Rehearsal: Zanskar Pass Avalanche Cutoff.
 */
const WalkthroughModal = () => {
  const { walkthroughOpen, setWalkthroughOpen } = useUiPreferences();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  if (!walkthroughOpen) return null;

  const steps = [
    {
      title: 'Step 1: Environmental Sensor Ingestion',
      subtitle: 'Open-Meteo & SRTM 30m Digital Elevation Model',
      Icon: CloudSnow,
      badge: 'SENSORY INGEST',
      badgeColor: '#38bdf8',
      desc: 'At 11:30 IST, high-altitude weather models detect heavy blizzard snowfall (82 mm/h liquid equivalent) combined with -14°C air temperature across Pensi La pass (elevation 4,400m ASL).',
      metric: 'Precipitation: 82 mm/h | Slope: 34.8° | Wind: 68 km/h',
      actionPage: '/ml-risk',
      actionText: 'Inspect Weather Vectors on ML Predictor →'
    },
    {
      title: 'Step 2: ML Disruption Risk Probability Spike',
      subtitle: 'Random Forest Ensemble Prediction',
      Icon: Brain,
      badge: 'RISK INFERENCE',
      badgeColor: '#f59e0b',
      desc: 'The ML Risk Engine computes route disruption probability. Risk jumps from 28% (nominal) to 86%, breaching the critical safety threshold (70%). Surface road convoys are immediately flagged unsafe.',
      metric: 'Disruption Risk: 86.4% (Threshold: 70.0% Breached)',
      actionPage: '/ml-risk',
      actionText: 'View Risk Heatmap & 48h Outlook →'
    },
    {
      title: 'Step 3: Exact SHAP Attribution & Auditability',
      subtitle: 'TreeSHAP Mathematical Factor Decomposition',
      Icon: Search,
      badge: 'EXPLAINABILITY',
      badgeColor: '#a855f7',
      desc: 'A non-technical officer needs to know why the pass is closed. TreeSHAP explains: Base Risk (32%) + Extreme Slope (+38.2%) + Heavy Snowfall (+16.2%) = 86.4% final risk score. Zero black-box guesswork.',
      metric: 'Base (32.0%) + Σφᵢ (54.4%) = 86.4% Exact Match',
      actionPage: '/ml-risk',
      actionText: 'Verify SHAP Waterfall on ML Page →'
    },
    {
      title: 'Step 4: Autonomous Contingency Trigger (Case T4)',
      subtitle: 'Missing Cases Contingency Rule Engine',
      Icon: ShieldAlert,
      badge: 'CONTINGENCY T4',
      badgeColor: '#f43f5e',
      desc: 'Case T4 ("Pensi La Pass avalanche cutoff") activates automatically. Road corridor Kargil-Padum (NH-301) is marked SUSPENDED in SQLite audit ledger. The system notifies NDRF and District Magistrate.',
      metric: 'Corridor: NH-301 Closed | 13,200 Padum Residents Isolated',
      actionPage: '/disaster',
      actionText: 'Open Disaster Command Center →'
    },
    {
      title: 'Step 5: Multi-Modal Autonomous UAV Lifeline',
      subtitle: 'Point-to-Point Aerial Supply Transit',
      Icon: Navigation,
      badge: 'LIFELINE DISPATCH',
      badgeColor: '#10b981',
      desc: 'With road transport severed, the platform activates Autonomous Cargo UAV-Alpha from Kargil Base. 42 kg of emergency O-Negative blood and insulin are delivered directly to Padum hospital in 55 minutes vs 8.5 hours by road!',
      metric: 'Transit Time: 55 min (Air) vs 8.5 h (Road) | Cost: ₹18.5/t-km',
      actionPage: '/multimodal',
      actionText: 'Compare Break-Even on Multi-Modal Page →'
    }
  ];

  const current = steps[currentStep];
  const StepIcon = current.Icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setWalkthroughOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJump = (path) => {
    navigate(path);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setWalkthroughOpen(false);
      }}
    >
      <div style={{
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-xl, 20px)',
        maxWidth: '580px',
        width: '100%',
        boxShadow: 'var(--elevation-3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm, 8px)',
                background: 'var(--apple-blue-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Compass size={18} color="var(--apple-blue)" />
              </div>
              <h3 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Zanskar Pass Avalanche Scenario
              </h3>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '4px 0 0 42px' }}>
              Official Master Blueprint Evaluation Rehearsal (Step {currentStep + 1} of {steps.length})
            </p>
          </div>

          <button
            type="button"
            onClick={() => setWalkthroughOpen(false)}
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
            aria-label="Close Walkthrough"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Step Badge & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: `${current.badgeColor}22`,
                color: current.badgeColor,
                border: `1px solid ${current.badgeColor}55`,
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)'
              }}>
                {current.badge}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {current.subtitle}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md, 14px)',
                background: `${current.badgeColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <StepIcon size={22} color={current.badgeColor} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                {current.title}
              </h2>
            </div>
          </div>

          {/* Narrative Description */}
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {current.desc}
          </p>

          {/* Live Metric Banner */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: `1px solid ${current.badgeColor}40`,
            borderLeft: `4px solid ${current.badgeColor}`,
            borderRadius: 'var(--radius-sm, 10px)',
            padding: '10px 14px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Zap size={14} color={current.badgeColor} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: current.badgeColor }}>TELEMETRY SNAPSHOT:</strong> {current.metric}
            </div>
          </div>

          {/* Direct Link to Relevant Page */}
          <div>
            <button
              type="button"
              onClick={() => handleJump(current.actionPage)}
              className="btn btn-secondary"
              style={{ fontSize: '0.76rem', width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-full)' }}
            >
              {current.actionText}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Step Dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                style={{
                  width: i === currentStep ? '22px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: i === currentStep ? 'var(--apple-blue)' : 'var(--border-subtle)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all var(--timing-fast) var(--ease-spring)'
                }}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="btn btn-secondary"
                style={{ fontSize: '0.76rem', padding: '6px 14px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{ fontSize: '0.76rem', padding: '6px 18px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {currentStep === steps.length - 1 ? (
                <>Finish Rehearsal <Check size={14} /></>
              ) : (
                <>Next Step <ChevronRight size={14} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughModal;
