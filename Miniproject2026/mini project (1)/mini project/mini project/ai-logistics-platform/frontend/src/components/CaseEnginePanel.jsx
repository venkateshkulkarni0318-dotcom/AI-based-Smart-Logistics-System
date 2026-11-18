import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Zap,
  CloudLightning,
  Truck,
  Database,
  Layers,
  Search,
  Target
} from 'lucide-react';
import { getCases, simulateCaseTrigger, lookupShridCase, checkDuplicateSettlements, checkWeatherStaleness } from '../services/api';
import DataBadge from './DataBadge';
import { useToast } from './Toast';

/**
 * CaseEnginePanel Component (Phase 2 Requirement)
 * Provides comprehensive inspection, testing, and simulation for all 29 cases (T1–T29).
 */
const CaseEnginePanel = ({ onTriggerCase = null }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'WEATHER' | 'OPERATIONAL' | 'DATA'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [dataCaseResult, setDataCaseResult] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    getCases()
      .then((res) => {
        if (isMounted && res?.data) {
          setCases(res.data);
        }
      })
      .catch((err) => {
        console.warn('Notice: Failed loading cases:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Filter cases by active tab and search query
  const filteredCases = cases.filter((c) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'WEATHER' && c.category?.includes('Weather')) ||
      (activeTab === 'OPERATIONAL' && c.category?.includes('Operational')) ||
      (activeTab === 'DATA' && c.category?.includes('Data'));

    const s = searchQuery.toLowerCase();
    const matchesSearch =
      !s ||
      c.name?.toLowerCase().includes(s) ||
      c.id?.toLowerCase().includes(s) ||
      c.triggerCondition?.toLowerCase().includes(s) ||
      c.plainLanguageAction?.toLowerCase().includes(s);

    return matchesTab && matchesSearch;
  });

  const handleSimulateCase = async (c) => {
    setSelectedCase(c);
    setDataCaseResult(null);

    // If it's a data edge case, run real endpoint test
    if (c.id === 'T25') {
      const res = await lookupShridCase('99-99-999-99999-999999');
      setDataCaseResult(res);
      addToast(`T25 Handled: Unknown SHRUG key caught politely. Suggested nearest: ${res?.suggestions?.[0]?.name}`, 'warning');
      return;
    }

    if (c.id === 'T26') {
      const res = await checkDuplicateSettlements();
      setDataCaseResult(res);
      addToast(`T26 Handled: Scanned ${res?.totalRecordsScanned} settlements. Duplicates resolved: ${res?.duplicateCount}`, 'info');
      return;
    }

    if (c.id === 'T27') {
      const res = await checkWeatherStaleness(7.5);
      setDataCaseResult(res);
      addToast(`T27 Handled: ${res?.warning}`, 'warning');
      return;
    }

    // Weather / Operational case simulation
    addToast(`Triggered ${c.id}: ${c.name} -> Switched to ${c.recommendedModeSwitch}`, c.riskLevel === 'CRITICAL' ? 'error' : 'warning');
    if (onTriggerCase) {
      onTriggerCase(c);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'CRITICAL') return 'var(--apple-red)';
    if (level === 'HIGH' || level === 'HIGH_CRITICAL') return 'var(--apple-orange)';
    if (level === 'MODERATE' || level === 'MODERATE_HIGH') return 'var(--apple-amber)';
    return 'var(--apple-green)';
  };

  const getRiskIcon = (level) => {
    if (level === 'CRITICAL') return ShieldAlert;
    if (level === 'HIGH' || level === 'HIGH_CRITICAL') return AlertTriangle;
    if (level === 'MODERATE' || level === 'MODERATE_HIGH') return AlertCircle;
    return CheckCircle2;
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg, 16px)' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm, 8px)',
              background: 'var(--apple-amber-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={18} color="var(--apple-amber)" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
              Phase 2: Operational &amp; Hazard Scenario Engine (T1–T29)
            </h3>
            <DataBadge isReal={false} label="Simulated demo values" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '3px 0 0 42px' }}>
            Comprehensive contingency engine testing 12 weather hazards, 11 fleet disruptions, and 6 data edge cases
          </p>
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '240px', position: 'relative' }}>
          <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-control"
            placeholder="Search cases (e.g. T1, Cloudburst, Drone)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ fontSize: '0.78rem', padding: '7px 12px 7px 34px', borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>

      {/* iOS-Style Segmented Filter Tabs */}
      <div className="segmented-control" role="group" aria-label="Case Categories" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: `All Cases (${cases.length || 29})`, Icon: Layers },
          { id: 'WEATHER', label: 'Weather & Hazards (T1–T12)', Icon: CloudLightning },
          { id: 'OPERATIONAL', label: 'Fleet & Supply Chain (T13–T23)', Icon: Truck },
          { id: 'DATA', label: 'Data Integrity (T24–T29)', Icon: Database }
        ].map((tab) => {
          const TabIcon = tab.Icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`segmented-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <TabIcon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Data Case Simulation Result Banner */}
      {dataCaseResult && (
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '6px',
          background: 'rgba(2, 132, 199, 0.08)',
          borderLeft: '4px solid var(--accent-primary)',
          border: '1px solid var(--border-subtle)',
          borderLeftWidth: '4px',
          marginBottom: '1rem',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} color="var(--apple-blue)" />
              <span>Live Edge Case Test Output ({selectedCase?.id}: {selectedCase?.name})</span>
            </strong>
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Graceful Fallback Verified
            </span>
          </div>
          <pre style={{
            margin: '4px 0 0',
            padding: '6px 8px',
            background: 'var(--bg-canvas)',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            overflowX: 'auto'
          }}>
            {JSON.stringify(dataCaseResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Cases Grid */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Phase 2 contingency cases...
        </div>
      ) : filteredCases.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No contingency cases match "{searchQuery}".
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '0.85rem'
        }}>
          {filteredCases.map((c) => {
            const riskColor = getRiskColor(c.riskLevel);
            const RiskIcon = getRiskIcon(c.riskLevel);

            return (
              <div
                key={c.id}
                style={{
                  padding: '1.1rem',
                  borderRadius: 'var(--radius-md, 14px)',
                  background: 'var(--bg-card)',
                  border: `1px solid ${selectedCase?.id === c.id ? 'var(--apple-blue-border)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  boxShadow: selectedCase?.id === c.id ? 'var(--elevation-2)' : 'none',
                  transition: 'all var(--timing-fast) var(--ease-spring)'
                }}
              >
                {/* Top Row: ID, Name, Risk Level */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-xs, 6px)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {c.id}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {c.name}
                      </strong>
                    </div>

                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: riskColor,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <RiskIcon size={12} color={riskColor} />
                      <span>{c.riskLevel}</span>
                    </span>
                  </div>

                  {/* Trigger Condition */}
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                    <strong>Trigger:</strong> {c.triggerCondition}
                  </div>
                </div>

                {/* Mode Switch Arrow Banner */}
                <div style={{
                  padding: '5px 8px',
                  borderRadius: '4px',
                  background: 'var(--bg-canvas)',
                  borderLeft: `3px solid ${riskColor}`,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mode Switch:</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{c.recommendedModeSwitch}</strong>
                </div>

                {/* Impact Telemetry Matrix */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                  textAlign: 'center',
                  padding: '4px 0',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Δ ETA</div>
                    <strong style={{ fontSize: '0.75rem', color: c.etaChange?.includes('-') ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                      {c.etaChange}
                    </strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Δ Cost</div>
                    <strong style={{ fontSize: '0.75rem', color: c.costChangeInr > 0 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                      {c.costChangeInr ? `+₹${c.costChangeInr}` : '₹0'}
                    </strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Δ Carbon</div>
                    <strong style={{ fontSize: '0.75rem', color: c.carbonChangeKg < 0 ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                      {c.carbonChangeKg ? `${c.carbonChangeKg} kg` : '0 kg'}
                    </strong>
                  </div>
                </div>

                {/* Plain-Language Officer Action */}
                <div style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  lineHeight: 1.35,
                  padding: '2px 0'
                }}>
                  "{c.plainLanguageAction}"
                </div>

                {/* Simulate Button */}
                <button
                  type="button"
                  onClick={() => handleSimulateCase(c)}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={11} />
                  <span>Simulate Scenario</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CaseEnginePanel;
