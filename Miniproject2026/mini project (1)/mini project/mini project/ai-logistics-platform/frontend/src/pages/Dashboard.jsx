import React, { useState, useEffect } from 'react';
import {
  Compass,
  Mountain,
  Plane,
  MapPin,
  Brain,
  Siren,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Activity,
  CheckCircle2,
  Navigation,
  FileSpreadsheet
} from 'lucide-react';
import MapView from '../components/MapView';
import DestinationDrawer from '../components/DestinationDrawer';
import VillageTable from '../components/VillageTable';
import MultimodalPanel from '../components/MultimodalPanel';
import DisasterModePanel from '../components/DisasterModePanel';
import CaseStudySelector from '../components/CaseStudySelector';
import MLRiskSimulator from '../components/MLRiskSimulator';
import { useCommandRole } from '../context/CommandRoleContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import {
  getVillages,
  getRiskAssessment,
  getActiveRoutes,
  getCorridors,
  getMultimodalModes
} from '../services/api';

const Dashboard = () => {
  const { activeRole, activeRoleId } = useCommandRole();
  const { isDisasterMode, setIsDisasterMode, liteMode, isSimpleMode } = useUiPreferences();

  // Selected corridor & datasets
  const [corridors, setCorridors] = useState([]);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const [multimodalModes, setMultimodalModes] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [riskData, setRiskData] = useState(null);

  // UI state for floating panels & drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeOverlayView, setActiveOverlayView] = useState('MAP'); // 'MAP' | 'TABLE' | 'MULTIMODAL' | 'SIMULATOR' | 'CORRIDORS'
  const [isZenMapMode, setIsZenMapMode] = useState(false);
  const [isRolePanelCollapsed, setIsRolePanelCollapsed] = useState(true);
  const [alertBanner, setAlertBanner] = useState(
    'Monsoon surge active in valley sectors. AI Route Engine recommends Cargo Drone (UAV) & Waterway Freight diversion.'
  );

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [corridorsRes, modesRes, villagesRes, riskRes, routesRes] = await Promise.allSettled([
          getCorridors(),
          getMultimodalModes(),
          getVillages(),
          getRiskAssessment(),
          getActiveRoutes()
        ]);

        if (corridorsRes.status === 'fulfilled' && corridorsRes.value?.data) {
          setCorridors(corridorsRes.value.data);
          setSelectedCorridor(corridorsRes.value.data[0]);
          if (corridorsRes.value.data[0]?.villages) {
            setVillages(corridorsRes.value.data[0].villages);
            setSelectedVillage(corridorsRes.value.data[0].villages[0]);
          }
        }

        if (modesRes.status === 'fulfilled' && modesRes.value?.data) {
          setMultimodalModes(modesRes.value.data);
        }

        if (riskRes.status === 'fulfilled' && riskRes.value?.data) {
          setRiskData(riskRes.value.data);
        }

        if (routesRes.status === 'fulfilled' && routesRes.value?.routes) {
          setRoutes(routesRes.value.routes);
        }
      } catch (err) {
        console.warn('Initial data load error:', err);
      }
    }

    loadInitialData();
  }, []);

  const handleSelectCorridor = (corridor) => {
    setSelectedCorridor(corridor);
    if (corridor.villages && corridor.villages.length > 0) {
      setVillages(corridor.villages);
      setSelectedVillage(corridor.villages[0]);
    }
    setAlertBanner(`Corridor [${corridor.name}] active. Preferred mode: ${corridor.activeModeRecommendation}`);
  };

  const handleSelectVillage = (village) => {
    setSelectedVillage(village);
    setDrawerOpen(true);
  };

  const handleOptimizeRoute = () => {
    setRoutes(prev => prev.map(r => ({
      ...r,
      estimatedDuration: '1h 35m',
      status: 'Optimized (Zero Disruption)'
    })));
    setAlertBanner('AI Pathfinding Complete: Disruption risk mitigated by 82% using multi-modal airway/waterway transfer.');
  };

  const highRiskCount = villages.filter(v => v.riskStatus === 'High').length;

  return (
    <div className={`apple-map-first-container ${isDisasterMode ? 'emergency-state' : ''}`}>
      {/* 1. TOP TELEMETRY STATUS STRIP (Sleek, Compact Glass Capsule) */}
      {!isZenMapMode && (
        <div className="apple-kpi-compact-strip" role="region" aria-label="Tactical Corridor Telemetry">
          <div className="kpi-strip-item">
            <Mountain size={13} className="text-blue" />
            <span className="strip-label">Corridor:</span>
            <strong className="strip-value">{selectedCorridor?.name || 'Himalayan Pass'}</strong>
            <span className="strip-sub">({selectedCorridor?.elevationRange || '1,800m - 4,200m'})</span>
          </div>

          <div className="strip-divider" />

          <div className="kpi-strip-item">
            <Plane size={13} className="text-emerald" />
            <span className="strip-label">Mode:</span>
            <strong className="strip-value text-emerald">{selectedCorridor?.activeModeRecommendation || 'Heavy Cargo UAV'}</strong>
            <span className="strip-badge">Autonomous</span>
          </div>

          <div className="strip-divider" />

          <div className="kpi-strip-item">
            <MapPin size={13} className="text-amber" />
            <span className="strip-label">Outposts:</span>
            <strong className="strip-value">{villages.length}</strong>
            <span className={`strip-tag ${highRiskCount > 0 ? 'red' : 'green'}`}>
              {highRiskCount} High Risk
            </span>
          </div>

          <div className="strip-divider" />

          <div className="kpi-strip-item">
            <Brain size={13} className="text-indigo" />
            <span className="strip-label">Disruption:</span>
            <strong className="strip-value text-amber">{isDisasterMode ? '84%' : '48%'}</strong>
            <span className="strip-sub">{isDisasterMode ? 'Critical' : 'TreeSHAP Active'}</span>
          </div>
        </div>
      )}

      {/* Floating Tactical Alert Banner */}
      {!isZenMapMode && alertBanner && (
        <div className={`apple-floating-alert-banner ${isDisasterMode ? 'emergency' : ''}`}>
          <div className="alert-content">
            {isDisasterMode ? <Flame size={15} className="text-red" /> : <AlertTriangle size={15} className="text-amber" />}
            <span className="alert-text">{alertBanner}</span>
          </div>
          <button
            type="button"
            className="alert-dismiss-btn"
            onClick={() => setAlertBanner(null)}
            aria-label="Dismiss alert"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. MAP CANVAS (Full Primary Background) */}
      <div className="apple-map-canvas-layer">
        <MapView
          villages={villages}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          routes={routes}
          isFullScreen={true}
          isZenMapMode={isZenMapMode}
          onToggleZenMap={() => setIsZenMapMode(prev => !prev)}
        />
      </div>

      {/* 3. ROLE-ADAPTIVE FLOATING PANELS OVER MAP */}
      {!isZenMapMode && (
        <div className={`apple-floating-panel-container ${isRolePanelCollapsed ? 'collapsed' : ''}`}>
          {/* Role 1: NDRF Cmdr (Emergency life safety, alerts & airdrop) */}
          {activeRoleId === 'ndrf' && (
            <div className="apple-role-glass-card">
              <div className="panel-title-bar">
                <div className="title-block">
                  <Siren size={15} className="text-rose" />
                  <span className="title">NDRF Operations Directive</span>
                </div>
                <div className="panel-title-actions">
                  <span className="badge-critical">CRISIS DISPATCH</span>
                  <button
                    type="button"
                    className="apple-panel-collapse-btn"
                    onClick={() => setIsRolePanelCollapsed(prev => !prev)}
                    title={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                    aria-label={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                  >
                    {isRolePanelCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>
              {!isRolePanelCollapsed && (
                <div className="panel-body">
                  <p className="mission-text">{activeRole.mission}</p>
                  <div className="stats-row">
                    {activeRole.focusMetrics.map((m, idx) => (
                      <div key={idx} className="stat-capsule">
                        <span className="label">{m.label}</span>
                        <strong className="value">{m.value}</strong>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="apple-primary-pill-btn"
                    onClick={handleOptimizeRoute}
                  >
                    <Navigation size={13} />
                    <span>Arm Emergency Air-Drop Corridor</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Role 2: UAV Pilot (Flight corridors, battery radius & weather) */}
          {activeRoleId === 'drone_pilot' && (
            <div className="apple-role-glass-card">
              <div className="panel-title-bar">
                <div className="title-block">
                  <Plane size={15} className="text-emerald" />
                  <span className="title">UAV Tactical Flight Envelope</span>
                </div>
                <div className="panel-title-actions">
                  <span className="badge-air">AIR OPS</span>
                  <button
                    type="button"
                    className="apple-panel-collapse-btn"
                    onClick={() => setIsRolePanelCollapsed(prev => !prev)}
                    title={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                    aria-label={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                  >
                    {isRolePanelCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>
              {!isRolePanelCollapsed && (
                <div className="panel-body">
                  <div className="stats-row">
                    {activeRole.focusMetrics.map((m, idx) => (
                      <div key={idx} className="stat-capsule">
                        <span className="label">{m.label}</span>
                        <strong className="value">{m.value}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="uav-status-box">
                    <CheckCircle2 size={13} className="text-emerald" />
                    <span>DGCA Authorized • 4,200m ASL Barometric Ceiling Verified</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Role 3: Field Outpost (Low-bandwidth simple checklist view) */}
          {activeRoleId === 'sarpanch' && (
            <div className="apple-role-glass-card field-outpost-panel">
              <div className="panel-title-bar">
                <div className="title-block">
                  <Radio size={15} className="text-amber" />
                  <span className="title">Field Outpost Supply Checklist</span>
                </div>
                <div className="panel-title-actions">
                  <span className="badge-field">LITE MODE</span>
                  <button
                    type="button"
                    className="apple-panel-collapse-btn"
                    onClick={() => setIsRolePanelCollapsed(prev => !prev)}
                    title={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                    aria-label={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                  >
                    {isRolePanelCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>
              {!isRolePanelCollapsed && (
                <div className="panel-body">
                  <div className="checklist-items">
                    <div className="check-row">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>Cold-Chain Insulin & Emergency Antibiotics: <strong>18 Days Buffer</strong></span>
                    </div>
                    <div className="check-row">
                      <CheckCircle2 size={14} className="text-emerald" />
                      <span>NavIC Satellite Emergency Beacon: <strong>Online</strong></span>
                    </div>
                    <div className="check-row">
                      <AlertTriangle size={14} className="text-amber" />
                      <span>Pensi La Pass: <strong>Seasonal Avalanche Hazard Warning</strong></span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="apple-primary-pill-btn red"
                    onClick={() => handleSelectVillage(villages[0])}
                  >
                    <Siren size={13} />
                    <span>Trigger Local Outpost Distress Signal</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Role 4: District DM (Civil administration & demographics) */}
          {activeRoleId === 'magistrate' && (
            <div className="apple-role-glass-card">
              <div className="panel-title-bar">
                <div className="title-block">
                  <ShieldCheck size={15} className="text-blue" />
                  <span className="title">District Logistics Magistrate</span>
                </div>
                <div className="panel-title-actions">
                  <span className="badge-admin">CIVIL ADMIN</span>
                  <button
                    type="button"
                    className="apple-panel-collapse-btn"
                    onClick={() => setIsRolePanelCollapsed(prev => !prev)}
                    title={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                    aria-label={isRolePanelCollapsed ? 'Expand panel' : 'Minimize panel'}
                  >
                    {isRolePanelCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>
              {!isRolePanelCollapsed && (
                <div className="panel-body">
                  <div className="stats-row">
                    {activeRole.focusMetrics.map((m, idx) => (
                      <div key={idx} className="stat-capsule">
                        <span className="label">{m.label}</span>
                        <strong className="value">{m.value}</strong>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="apple-secondary-pill-btn"
                    onClick={() => setActiveOverlayView(activeOverlayView === 'TABLE' ? 'MAP' : 'TABLE')}
                  >
                    <FileSpreadsheet size={13} />
                    <span>{activeOverlayView === 'TABLE' ? 'Hide Settlement Table' : 'Open 585K SHRUG Settlement Directory'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. BOTTOM FLOATING ACTION DOCK (Objective Switcher & Overlays) */}
      {!isZenMapMode && (
        <div className="apple-floating-dock" role="toolbar" aria-label="Tactical Views Dock">
        <div className="apple-dock-capsule">
          <button
            type="button"
            className={`apple-dock-btn ${activeOverlayView === 'MAP' ? 'active' : ''}`}
            onClick={() => setActiveOverlayView('MAP')}
          >
            <Compass size={15} />
            <span>Map Only</span>
          </button>

          <button
            type="button"
            className={`apple-dock-btn ${activeOverlayView === 'TABLE' ? 'active' : ''}`}
            onClick={() => setActiveOverlayView(activeOverlayView === 'TABLE' ? 'MAP' : 'TABLE')}
          >
            <FileSpreadsheet size={15} />
            <span>Settlement Table</span>
          </button>

          <button
            type="button"
            className={`apple-dock-btn ${activeOverlayView === 'MULTIMODAL' ? 'active' : ''}`}
            onClick={() => setActiveOverlayView(activeOverlayView === 'MULTIMODAL' ? 'MAP' : 'MULTIMODAL')}
          >
            <Plane size={15} />
            <span>Transport Models</span>
          </button>

          <button
            type="button"
            className={`apple-dock-btn ${activeOverlayView === 'SIMULATOR' ? 'active' : ''}`}
            onClick={() => setActiveOverlayView(activeOverlayView === 'SIMULATOR' ? 'MAP' : 'SIMULATOR')}
          >
            <Brain size={15} />
            <span>ML Simulator</span>
          </button>

          <button
            type="button"
            className={`apple-dock-btn ${activeOverlayView === 'CORRIDORS' ? 'active' : ''}`}
            onClick={() => setActiveOverlayView(activeOverlayView === 'CORRIDORS' ? 'MAP' : 'CORRIDORS')}
          >
            <Mountain size={15} />
            <span>Corridors</span>
          </button>
        </div>
      </div>
      )}

      {/* 5. OVERLAY MODAL / BOTTOM SHEET (When user opens Table or Simulator from Dock) */}
      {activeOverlayView !== 'MAP' && (
        <div className="apple-overlay-sheet-backdrop" onClick={() => setActiveOverlayView('MAP')}>
          <div className="apple-overlay-sheet-card" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h3>
                {activeOverlayView === 'TABLE' && 'Remote Settlement Directory (585K SHRUG Connected)'}
                {activeOverlayView === 'MULTIMODAL' && 'Multi-Modal Unit Economics & Transfer Models'}
                {activeOverlayView === 'SIMULATOR' && 'Random Forest & TreeSHAP Disruption Risk Simulator'}
                {activeOverlayView === 'CORRIDORS' && 'Contrasting Case-Study Corridors'}
              </h3>
              <button
                type="button"
                className="sheet-close-btn"
                onClick={() => setActiveOverlayView('MAP')}
                aria-label="Close sheet"
              >
                <X size={16} />
              </button>
            </div>

            <div className="sheet-content">
              {activeOverlayView === 'TABLE' && (
                <VillageTable
                  villages={villages}
                  selectedVillage={selectedVillage}
                  onSelectVillage={(v) => {
                    handleSelectVillage(v);
                    setActiveOverlayView('MAP');
                  }}
                />
              )}

              {activeOverlayView === 'MULTIMODAL' && (
                <MultimodalPanel
                  modes={multimodalModes}
                  activeMode="drone"
                  onSelectMode={() => {}}
                />
              )}

              {activeOverlayView === 'SIMULATOR' && (
                <MLRiskSimulator />
              )}

              {activeOverlayView === 'CORRIDORS' && (
                <CaseStudySelector
                  corridors={corridors}
                  selectedCorridor={selectedCorridor}
                  onSelectCorridor={handleSelectCorridor}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SLIDE-IN RIGHT-SIDE DESTINATION DRAWER */}
      {drawerOpen && (
        <DestinationDrawer
          village={selectedVillage}
          onClose={() => setDrawerOpen(false)}
          riskData={riskData}
          onOptimizeRoute={handleOptimizeRoute}
        />
      )}
    </div>
  );
};

export default Dashboard;
