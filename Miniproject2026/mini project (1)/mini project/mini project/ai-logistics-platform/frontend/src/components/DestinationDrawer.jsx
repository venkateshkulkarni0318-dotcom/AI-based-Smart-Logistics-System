import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Mountain,
  Plane,
  Truck,
  Users,
  Navigation,
  Download,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';

const DestinationDrawer = ({
  village,
  onClose,
  riskData,
  onOptimizeRoute
}) => {
  const { isDisasterMode, t } = useUiPreferences();

  if (!village) return null;

  const riskStatus = village.riskStatus || 'Low';
  const isHighRisk = riskStatus === 'High';
  const isModerateRisk = riskStatus === 'Moderate';

  const riskConfig = isHighRisk
    ? { color: 'var(--apple-red)', bg: 'var(--apple-red-subtle)', label: 'High Risk Cutoff', Icon: Flame }
    : isModerateRisk
    ? { color: 'var(--apple-amber)', bg: 'var(--apple-amber-subtle)', label: 'Moderate Risk', Icon: AlertTriangle }
    : { color: 'var(--apple-green)', bg: 'var(--apple-green-subtle)', label: 'Low Risk Passage', Icon: ShieldCheck };

  const StatusIcon = riskConfig.Icon;

  return (
    <aside
      className={`apple-destination-drawer open ${isDisasterMode ? 'emergency-state' : ''}`}
      aria-label={`Settlement Details for ${village.name}`}
      role="complementary"
    >
      {/* Header */}
      <div className="apple-drawer-header">
        <div>
          <div className="apple-drawer-badges-row">
            <span
              className="apple-drawer-risk-badge"
              style={{
                color: riskConfig.color,
                background: riskConfig.bg,
                borderColor: riskConfig.color
              }}
            >
              <StatusIcon size={13} />
              <span>{riskConfig.label}</span>
            </span>

            {village.borderZone && (
              <span className="apple-drawer-border-badge">
                <ShieldAlert size={12} />
                <span>Strategic Border Outpost</span>
              </span>
            )}
          </div>

          <h2 className="apple-drawer-title">{village.name}</h2>
          <span className="apple-drawer-subtitle">
            {village.district ? `${village.district}, ` : ''}{village.state || 'Ladakh Region'} • ID: {village.id}
          </span>
        </div>

        <button
          type="button"
          className="apple-drawer-close-btn"
          onClick={onClose}
          aria-label={t('closeDrawer')}
          title={t('closeDrawer')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="apple-drawer-body">
        {/* Disaster Mode Pinned Directive */}
        {isDisasterMode && (
          <div className="apple-drawer-emergency-banner">
            <Flame size={16} />
            <div>
              <strong>Emergency Dispatch Directive:</strong>
              <p>Passage obstructed. Surface convoys grounded. Immediate UAV medical airdrop prioritized.</p>
            </div>
          </div>
        )}

        {/* Top 4 Key Metric Capsules */}
        <div className="apple-drawer-metrics-grid">
          <div className="apple-drawer-metric-card">
            <span className="metric-label">Access Score</span>
            <div className="metric-value-row">
              <span className="metric-value" style={{ color: isHighRisk ? 'var(--apple-red)' : 'var(--apple-green)' }}>
                {village.accessScore ?? 42}
              </span>
              <span className="metric-unit">/ 100</span>
            </div>
            <span className="metric-sub">{village.cutoffDays ? `${village.cutoffDays} Days Isolated/Yr` : 'Seasonal Cutoff'}</span>
          </div>

          <div className="apple-drawer-metric-card">
            <span className="metric-label">SRTM Elevation</span>
            <div className="metric-value-row">
              <span className="metric-value text-blue">
                {village.elevationMeters ? `${village.elevationMeters}` : '3,850'}
              </span>
              <span className="metric-unit">m ASL</span>
            </div>
            <span className="metric-sub">Slope: {village.slopeGradientDeg || 28}° (SRTM 30m)</span>
          </div>

          <div className="apple-drawer-metric-card">
            <span className="metric-label">Population (SHRUG)</span>
            <div className="metric-value-row">
              <span className="metric-value">
                {village.population ? village.population.toLocaleString('en-IN') : '1,840'}
              </span>
              <span className="metric-unit">Souls</span>
            </div>
            <span className="metric-sub">Key: {village.shrugKey || 'shrug-2011-ldk-04'}</span>
          </div>

          <div className="apple-drawer-metric-card">
            <span className="metric-label">Disruption Probability</span>
            <div className="metric-value-row">
              <span className="metric-value" style={{ color: isHighRisk ? 'var(--apple-red)' : 'var(--apple-amber)' }}>
                {village.mlDisruptionScore ? `${village.mlDisruptionScore}%` : isHighRisk ? '82%' : '48%'}
              </span>
            </div>
            <span className="metric-sub">TreeSHAP Additive Verified</span>
          </div>
        </div>

        {/* Recommended Dispatch Mode */}
        <div className="apple-drawer-card">
          <div className="card-header-row">
            <div className="card-header-title">
              <Plane size={15} className="text-blue" />
              <span>Recommended Transport Mode</span>
            </div>
            <span className="card-header-pill">AI Optimization</span>
          </div>

          <div className="mode-highlight-banner">
            <div className="mode-name">
              {village.recommendedMode || (isHighRisk ? 'Heavy-Lift Autonomous UAV (T-40)' : 'All-Terrain 4WD Convoy')}
            </div>
            <div className="mode-reason">
              {isHighRisk
                ? 'Surface pass obstructed by avalanche overwash. Heavy cargo drone deployment maintains continuous 40kg lifeline.'
                : 'Nominal operational corridor envelope. 4WD all-terrain convoy with GPS relay recommended.'}
            </div>
          </div>
        </div>

        {/* Environmental & Terrain Hazards */}
        <div className="apple-drawer-card">
          <div className="card-header-row">
            <div className="card-header-title">
              <Mountain size={15} className="text-amber" />
              <span>Terrain & Environmental Diagnostics</span>
            </div>
          </div>

          <div className="hazards-list">
            <div className="hazard-item">
              <span className="hazard-bullet" style={{ background: isHighRisk ? 'var(--apple-red)' : 'var(--apple-amber)' }} />
              <div>
                <strong>Terrain Classification:</strong> {village.terrain || 'High Alpine / Glacial Switchback'}
              </div>
            </div>
            <div className="hazard-item">
              <span className="hazard-bullet" style={{ background: 'var(--apple-blue)' }} />
              <div>
                <strong>Soil Moisture / Rainfall:</strong> {village.rainfallMmHr ? `${village.rainfallMmHr} mm/h` : '62 mm/h surge'} (Precipitation Factor)
              </div>
            </div>
            <div className="hazard-item">
              <span className="hazard-bullet" style={{ background: 'var(--apple-purple)' }} />
              <div>
                <strong>Coordinates:</strong> {village.coordinates?.lat?.toFixed(4) || '33.5120'}° N, {village.coordinates?.lng?.toFixed(4) || '76.8830'}° E
              </div>
            </div>
          </div>
        </div>

        {/* Operational Directives */}
        <div className="apple-drawer-card">
          <div className="card-header-row">
            <div className="card-header-title">
              <Activity size={15} className="text-emerald" />
              <span>Tactical Operations Directives</span>
            </div>
          </div>

          <ul className="directives-list">
            <li>Broadcast NavIC L5 positioning packet to local outpost receiver.</li>
            <li>Verify cold-chain insulin and emergency O2 cylinder stockpile integrity.</li>
            <li>Maintain radio contact with regional BRO Convoy Base (Chumathang Depot).</li>
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="apple-drawer-footer">
        <button
          type="button"
          className="apple-drawer-action-btn primary"
          onClick={() => onOptimizeRoute && onOptimizeRoute(village)}
        >
          <Navigation size={15} />
          <span>Dispatch UAV Lifeline</span>
        </button>

        <button
          type="button"
          className="apple-drawer-action-btn secondary"
          onClick={onClose}
        >
          <span>Done</span>
        </button>
      </div>
    </aside>
  );
};

export default DestinationDrawer;
