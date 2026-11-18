import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CloudRain,
  Mountain,
  Plane,
  Download,
  ShieldCheck,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Layers,
  Radio,
  Sliders,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronDown,
  Play,
  Pause,
  Truck,
  Wind,
  Gauge,
  Zap,
  Navigation,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { getSrtmFeatures } from '../services/api';
import { useUiPreferences } from '../context/UiPreferencesContext';

const MapView = ({
  villages = [],
  selectedVillage,
  onSelectVillage,
  routes = [],
  isFullScreen = false,
  isZenMapMode = false,
  onToggleZenMap
}) => {
  const { isDisasterMode, liteMode } = useUiPreferences();
  const [filterRisk, setFilterRisk] = useState('ALL');
  
  // Clean defaults: minimal noise on load
  const [showWeather, setShowWeather] = useState(false);
  const [showContours, setShowContours] = useState(true);
  const [showUavRadius, setShowUavRadius] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [uavPayloadKg, setUavPayloadKg] = useState(15);
  const [hoveredVillage, setHoveredVillage] = useState(null);
  const [srtmFeatures, setSrtmFeatures] = useState([]);

  // =========================================================================
  // 1. MULTI-HAZARD WEATHER SIMULATOR ENGINE (Interactive Sliders & Risk)
  // =========================================================================
  const [showHazardSim, setShowHazardSim] = useState(false);
  const [simRainfall, setSimRainfall] = useState(24); // mm/h (0 to 120 mm/h)
  const [simWind, setSimWind] = useState(16); // km/h (0 to 90 km/h)
  const hazardMenuRef = useRef(null);

  // Dynamic Disruption Risk calculated from real meteorological thresholds
  const computedHazardRisk = useMemo(() => {
    return Math.min(98, Math.round(18 + (simRainfall / 120) * 54 + (simWind / 90) * 26));
  }, [simRainfall, simWind]);

  // Autonomous Route Engine Recommendation based on weather thresholds
  const hazardRecommendation = useMemo(() => {
    if (simRainfall > 45 && simWind <= 55) {
      return {
        mode: 'Autonomous Heavy Cargo UAV',
        badge: 'Air-Drop Recommended',
        color: 'var(--apple-blue)',
        reason: 'Surface roads cut off by excessive precipitation & mudslide risk.'
      };
    }
    if (simWind > 55) {
      return {
        mode: 'Emergency 6x6 Heavy Surface Convoy',
        badge: 'Gale Warning (UAV Grounded)',
        color: 'var(--apple-amber)',
        reason: 'Wind shear exceeds drone structural safety limits (55 km/h).'
      };
    }
    return {
      mode: 'All-Terrain 4WD Road Convoy',
      badge: 'Pass Normal',
      color: 'var(--apple-green)',
      reason: 'Safe operating window for surface transport.'
    };
  }, [simRainfall, simWind]);

  // Close hazard simulator dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hazardMenuRef.current && !hazardMenuRef.current.contains(e.target)) {
        setShowHazardSim(false);
      }
    };
    if (showHazardSim) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHazardSim]);

  // =========================================================================
  // 2. SORTIE DISPATCH ANIMATION ENGINE (Live Convoy & Drone Sorties)
  // =========================================================================
  const [isSimulatingSortie, setIsSimulatingSortie] = useState(false);
  const [sortieMode, setSortieMode] = useState('UAV'); // 'UAV' | 'CONVOY'
  const [sortieProgress, setSortieProgress] = useState(0); // 0.0 to 1.0
  const [isSortiePaused, setIsSortiePaused] = useState(false);
  const [sortieSpeedMultiplier, setSortieSpeedMultiplier] = useState(1); // 1, 2, 5
  const [isConvoyBlocked, setIsConvoyBlocked] = useState(false);
  const [isSortieCompleted, setIsSortieCompleted] = useState(false);

  // Reactive Theme Observer (Light vs Dark)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const isLight = theme === 'light';

  const layersMenuRef = useRef(null);

  // Close layers dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (layersMenuRef.current && !layersMenuRef.current.contains(e.target)) {
        setShowLayersMenu(false);
      }
    };
    if (showLayersMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLayersMenu]);


  // =========================================================================
  // MAP ZOOM ENGINE (70% to 100%) & DRAG-PANNING
  // =========================================================================
  const MIN_ZOOM = 0.70; // 70%
  const MAX_ZOOM = 1.00; // 100%
  const DEFAULT_ZOOM = 1.0; // 100%
  const ZOOM_STEP = 0.05; // 5% per step (70%, 75%, 80%, 85%, 90%, 95%, 100%)

  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Explicit functions to zoom in and out of the map from 70% to 100%
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(MAX_ZOOM, +(prev + ZOOM_STEP).toFixed(2)));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(MIN_ZOOM, +(prev - ZOOM_STEP).toFixed(2)));
  };

  const setZoom = (level) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(level).toFixed(2)));
    setZoomLevel(clamped);
  };

  const resetZoom = () => {
    setZoomLevel(DEFAULT_ZOOM);
    setPanOffset({ x: 0, y: 0 });
  };

  // Click & Drag Panning on Canvas
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('.apple-map-pin') || e.target.closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Scale delta according to zoom level for smooth, natural drag feel
    setPanOffset({
      x: Math.round(dragStartRef.current.panX - dx / zoomLevel),
      y: Math.round(dragStartRef.current.panY - dy / zoomLevel)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zooming (70% to 100%)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setZoomLevel(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(prev + delta).toFixed(2))));
  };

  // Fetch SRTM GeoJSON elevation data
  useEffect(() => {
    getSrtmFeatures()
      .then(res => {
        if (res?.features) setSrtmFeatures(res.features);
      })
      .catch(() => {});
  }, []);

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      name: 'AI-LOGIX-Operational-Routes',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: (villages.length ? villages : []).map(v => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.coordinates?.lng || 76.88, v.coordinates?.lat || 33.51]
        },
        properties: {
          id: v.id,
          name: v.name,
          elevationMeters: v.elevationMeters,
          accessScore: v.accessScore,
          riskStatus: v.riskStatus,
          borderZone: Boolean(v.borderZone),
          recommendedMode: v.recommendedMode || 'All-Terrain 4WD'
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI-LOGIX-Waypoints-${new Date().toISOString().slice(0, 10)}.geojson`;
    link.click();
    URL.revokeObjectURL(url);
    setShowLayersMenu(false);
  };

  const filteredVillages = useMemo(() => {
    return villages.filter(v => {
      if (filterRisk === 'ALL') return true;
      return v.riskStatus?.toUpperCase() === filterRisk;
    });
  }, [villages, filterRisk]);

  // Dynamic Geographic Projection to SVG Canvas (1000x560 widescreen)
  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 560;
  const PADDING_TOP = 130;
  const PADDING_BOTTOM = 95;
  const PADDING_X = 140;

  const geoBounds = useMemo(() => {
    const lats = villages.map(v => v.coordinates?.lat).filter(n => typeof n === 'number' && !isNaN(n));
    const lngs = villages.map(v => v.coordinates?.lng).filter(n => typeof n === 'number' && !isNaN(n));

    if (!lats.length || !lngs.length) {
      return { minLat: 33.2, maxLat: 34.1, minLng: 76.4, maxLng: 77.4, latSpan: 0.9, lngSpan: 1.0 };
    }

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = maxLat === minLat ? 0.01 : Math.max(0.0001, maxLat - minLat);
    const lngSpan = maxLng === minLng ? 0.01 : Math.max(0.0001, maxLng - minLng);

    return { minLat, maxLat, minLng, maxLng, latSpan, lngSpan };
  }, [villages]);

  const projection = useMemo(() => {
    return (coords) => {
      if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number' || isNaN(coords.lat) || isNaN(coords.lng)) {
        return { x: SVG_WIDTH / 2, y: SVG_HEIGHT / 2 };
      }
      const x = PADDING_X + ((coords.lng - geoBounds.minLng) / geoBounds.lngSpan) * (SVG_WIDTH - 2 * PADDING_X);
      const y = SVG_HEIGHT - (PADDING_BOTTOM + ((coords.lat - geoBounds.minLat) / geoBounds.latSpan) * (SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM));
      return {
        x: isNaN(x) ? SVG_WIDTH / 2 : Math.round(x),
        y: isNaN(y) ? SVG_HEIGHT / 2 : Math.round(y)
      };
    };
  }, [geoBounds]);

  // Dynamic ViewBox: scales smoothly from 20% (0.2) to 150% (1.5) without clipping
  const currentViewBox = useMemo(() => {
    const w = SVG_WIDTH / zoomLevel;
    const h = SVG_HEIGHT / zoomLevel;
    const centerX = SVG_WIDTH / 2 + panOffset.x;
    const centerY = SVG_HEIGHT / 2 + panOffset.y;
    const minX = centerX - w / 2;
    const minY = centerY - h / 2;
    return `${Math.round(minX)} ${Math.round(minY)} ${Math.round(w)} ${Math.round(h)}`;
  }, [zoomLevel, panOffset]);

  // Sortie Route Segments & Current Interpolated Position
  const routeSegments = useMemo(() => {
    if (filteredVillages.length < 2) return { segments: [], totalLength: 0 };
    const segs = [];
    let cumulativeDist = 0;
    for (let i = 0; i < filteredVillages.length - 1; i++) {
      const from = filteredVillages[i];
      const to = filteredVillages[i + 1];
      const p1 = projection(from.coordinates);
      const p2 = projection(to.coordinates);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const length = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      segs.push({
        from,
        to,
        p1,
        p2,
        length,
        startDist: cumulativeDist,
        endDist: cumulativeDist + length
      });
      cumulativeDist += length;
    }
    return { segments: segs, totalLength: cumulativeDist };
  }, [filteredVillages, projection]);

  const currentSortiePosition = useMemo(() => {
    if (!routeSegments.segments || routeSegments.segments.length === 0) return null;
    const targetDist = sortieProgress * routeSegments.totalLength;
    const seg = routeSegments.segments.find(s => targetDist >= s.startDist && targetDist <= s.endDist)
      || routeSegments.segments[routeSegments.segments.length - 1];

    const segFraction = seg.length > 0 ? (targetDist - seg.startDist) / seg.length : 0;
    const clampedT = Math.max(0, Math.min(1, segFraction));

    const x = Math.round(seg.p1.x + clampedT * (seg.p2.x - seg.p1.x));
    const y = Math.round(seg.p1.y + clampedT * (seg.p2.y - seg.p1.y));
    const angle = Math.round(Math.atan2(seg.p2.y - seg.p1.y, seg.p2.x - seg.p1.x) * (180 / Math.PI));

    const alt1 = seg.from.elevationMeters || 1800;
    const alt2 = seg.to.elevationMeters || 2200;
    const currentAlt = Math.round(alt1 + clampedT * (alt2 - alt1));

    return {
      x,
      y,
      angle,
      altitude: currentAlt,
      currentLeg: seg,
      fromName: seg.from.name,
      toName: seg.to.name,
      legIndex: routeSegments.segments.indexOf(seg) + 1,
      totalLegs: routeSegments.segments.length
    };
  }, [sortieProgress, routeSegments]);

  // Sortie Animation Loop
  useEffect(() => {
    if (!isSimulatingSortie || isSortiePaused) return;

    let lastTime = performance.now();
    let animFrameId;

    const step = (time) => {
      const deltaSeconds = (time - lastTime) / 1000;
      lastTime = time;

      // Complete route in 24 seconds at 1x
      const speedRate = (1 / 24) * sortieSpeedMultiplier;

      // Check if convoy gets blocked by landslide when rain > 45 mm/h
      if (sortieMode === 'CONVOY' && simRainfall > 45 && sortieProgress >= 0.40 && sortieProgress <= 0.60 && !isConvoyBlocked) {
        setIsConvoyBlocked(true);
        setIsSortiePaused(true);
        return;
      }

      setSortieProgress((prev) => {
        const next = prev + speedRate * deltaSeconds;
        if (next >= 1) {
          setIsSortieCompleted(true);
          setIsSortiePaused(true);
          return 1;
        }
        return next;
      });

      animFrameId = requestAnimationFrame(step);
    };

    animFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameId);
  }, [isSimulatingSortie, isSortiePaused, sortieSpeedMultiplier, sortieMode, simRainfall, sortieProgress, isConvoyBlocked]);

  const startSortie = () => {
    setIsSimulatingSortie(true);
    setIsSortiePaused(false);
    setIsSortieCompleted(false);
    setIsConvoyBlocked(false);
    if (sortieProgress >= 1) {
      setSortieProgress(0);
    }
  };

  const pauseSortie = () => setIsSortiePaused(true);
  const resumeSortie = () => setIsSortiePaused(false);
  const resetSortie = () => {
    setSortieProgress(0);
    setIsSortiePaused(false);
    setIsSortieCompleted(false);
    setIsConvoyBlocked(false);
  };
  const stopSortie = () => {
    setIsSimulatingSortie(false);
    setSortieProgress(0);
    setIsSortiePaused(false);
    setIsSortieCompleted(false);
    setIsConvoyBlocked(false);
  };
  const handleRerouteToDrone = () => {
    setSortieMode('UAV');
    setIsConvoyBlocked(false);
    setIsSortiePaused(false);
  };

  const activeLayersCount = (showWeather ? 1 : 0) + (showContours ? 1 : 0) + (showUavRadius ? 1 : 0);

  return (
    <div className={`apple-map-wrapper ${isFullScreen ? 'full-screen-mode' : ''} ${isZenMapMode ? 'zen-mode' : ''} ${isDisasterMode ? 'emergency-mode' : ''}`}>
      {/* Sleek, Single-Row Floating Control Bar (Clean & Compact) */}
      <div className="apple-map-controls-bar clean-layout">
        {/* Minimal Live Status Breadcrumb */}
        <div className="apple-map-mini-badge">
          <span className="apple-live-pulse" aria-hidden="true" />
          <span className="apple-map-mini-title">Tactical Map</span>
          <span className="apple-map-mini-sep">•</span>
          <span className="apple-map-mini-meta">{filteredVillages.length} Outposts</span>
        </div>

        {/* Consolidated Right-Side Controls Group */}
        <div className="apple-map-actions-group">
          {/* iOS Segmented Risk Filter */}
          <div className="apple-segmented-filter" role="radiogroup" aria-label="Filter settlements by risk level">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'LOW', label: 'Low', color: 'var(--apple-green)' },
              { id: 'MODERATE', label: 'Moderate', color: 'var(--apple-amber)' },
              { id: 'HIGH', label: 'High', color: 'var(--apple-red)' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={filterRisk === item.id}
                onClick={() => setFilterRisk(item.id)}
                className={`apple-segmented-filter-btn ${filterRisk === item.id ? 'active' : ''}`}
                style={{
                  '--accent-color': item.color || 'var(--apple-blue)'
                }}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Consolidated Layers Popover Menu */}
          <div className="apple-layers-menu-wrapper" ref={layersMenuRef}>
            <button
              type="button"
              className={`apple-ios-toggle-btn ${showLayersMenu ? 'active' : ''}`}
              onClick={() => setShowLayersMenu(prev => !prev)}
              title="Toggle Map Overlays (DEM, Weather, UAV Range)"
              aria-expanded={showLayersMenu}
            >
              <Layers size={13} />
              <span>Layers</span>
              <span className="layers-count-badge">{activeLayersCount}</span>
              <ChevronDown size={11} className={showLayersMenu ? 'rotate-180' : ''} />
            </button>

            {showLayersMenu && (
              <div className="apple-layers-popover" onClick={e => e.stopPropagation()}>
                <div className="popover-header">
                  <span>Tactical Overlays</span>
                </div>
                
                <button
                  type="button"
                  className="popover-item"
                  onClick={() => setShowContours(p => !p)}
                >
                  <Mountain size={13} className="text-secondary" />
                  <span className="item-title">Topographic DEM Contours</span>
                  <span className={`apple-ios-switch-knob ${showContours ? 'on' : 'off'}`} />
                </button>

                <button
                  type="button"
                  className="popover-item"
                  onClick={() => setShowWeather(p => !p)}
                >
                  <CloudRain size={13} className="text-blue" />
                  <span className="item-title">Weather & Monsoon Radar</span>
                  <span className={`apple-ios-switch-knob ${showWeather ? 'on' : 'off'}`} />
                </button>

                <button
                  type="button"
                  className="popover-item"
                  onClick={() => setShowUavRadius(p => !p)}
                >
                  <Plane size={13} className="text-emerald" />
                  <span className="item-title">UAV Flight Envelope</span>
                  <span className={`apple-ios-switch-knob ${showUavRadius ? 'on' : 'off'}`} />
                </button>

                {showUavRadius && (
                  <div className="popover-uav-payload">
                    <span className="sub-label">UAV Payload:</span>
                    <div className="payload-pills">
                      {[5, 15, 25].map(kg => (
                        <button
                          key={kg}
                          type="button"
                          className={`payload-chip ${uavPayloadKg === kg ? 'active' : ''}`}
                          onClick={() => setUavPayloadKg(kg)}
                        >
                          {kg}kg
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="popover-divider" />
                <button
                  type="button"
                  className="popover-action-btn"
                  onClick={handleExportGeoJSON}
                >
                  <Download size={13} />
                  <span>Export Route GeoJSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Autonomous Sortie Dispatch Simulator Toggle */}
          <button
            type="button"
            className={`apple-ios-toggle-btn ${isSimulatingSortie ? 'active' : ''}`}
            onClick={() => {
              if (!isSimulatingSortie) {
                startSortie();
              } else {
                stopSortie();
              }
            }}
            title={isSimulatingSortie ? "Stop Sortie Simulation" : "Simulate Autonomous Convoy/UAV Sortie Dispatch"}
          >
            {isSimulatingSortie ? <Pause size={13} className="text-amber" /> : <Play size={13} className="text-emerald" />}
            <span>{isSimulatingSortie ? 'Sortie Active' : 'Sortie Sim'}</span>
          </button>

          {/* Multi-Hazard Weather Simulator Popover */}
          <div className="apple-layers-menu-wrapper" ref={hazardMenuRef}>
            <button
              type="button"
              className={`apple-ios-toggle-btn ${showHazardSim || simRainfall > 35 ? 'active' : ''}`}
              onClick={() => setShowHazardSim(prev => !prev)}
              title="Simulate Multi-Hazard Rainfall & Wind Disruptions"
              aria-expanded={showHazardSim}
            >
              <Flame size={13} className={simRainfall > 45 ? "text-rose" : "text-amber"} />
              <span>Hazard Sim</span>
              {simRainfall > 45 && <span className="layers-count-badge" style={{ background: 'var(--apple-red)' }}>!</span>}
              <ChevronDown size={11} className={showHazardSim ? 'rotate-180' : ''} />
            </button>

            {showHazardSim && (
              <div className="apple-hazard-popover" onClick={e => e.stopPropagation()}>
                <div className="apple-hazard-header">
                  <div className="apple-hazard-title">
                    <Flame size={14} className="text-amber" />
                    <span>Multi-Hazard Simulator</span>
                  </div>
                  <button
                    type="button"
                    className="apple-hazard-reset"
                    onClick={() => { setSimRainfall(24); setSimWind(16); }}
                    title="Reset to seasonal average"
                  >
                    Reset
                  </button>
                </div>

                {/* Rainfall Slider */}
                <div className="apple-hazard-slider-group">
                  <div className="apple-hazard-label-row">
                    <span className="apple-hazard-name">
                      <CloudRain size={12} className="text-blue" />
                      Precipitation
                    </span>
                    <span className="apple-hazard-val" style={{ color: simRainfall > 50 ? 'var(--apple-red)' : simRainfall > 30 ? 'var(--apple-amber)' : 'var(--apple-green)' }}>
                      {simRainfall} mm/h {simRainfall > 50 ? '(Cloudburst)' : simRainfall > 30 ? '(Heavy)' : '(Normal)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    value={simRainfall}
                    onChange={e => setSimRainfall(Number(e.target.value))}
                    className="apple-hazard-range-input"
                    aria-label="Precipitation Intensity Slider"
                  />
                </div>

                {/* Wind Shear Slider */}
                <div className="apple-hazard-slider-group">
                  <div className="apple-hazard-label-row">
                    <span className="apple-hazard-name">
                      <Wind size={12} className="text-emerald" />
                      Wind Velocity
                    </span>
                    <span className="apple-hazard-val" style={{ color: simWind > 55 ? 'var(--apple-red)' : 'var(--apple-text-primary)' }}>
                      {simWind} km/h {simWind > 55 ? '(Gale Shear)' : '(Moderate)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={simWind}
                    onChange={e => setSimWind(Number(e.target.value))}
                    className="apple-hazard-range-input"
                    aria-label="Peak Wind Shear Velocity Slider"
                  />
                </div>

                {/* Computed Risk Meter */}
                <div className="apple-hazard-risk-display">
                  <div className="apple-risk-meter-row">
                    <span className="apple-hazard-name">Road Disruption Risk:</span>
                    <strong style={{ color: computedHazardRisk > 70 ? 'var(--apple-red)' : computedHazardRisk > 40 ? 'var(--apple-amber)' : 'var(--apple-green)' }}>
                      {computedHazardRisk}%
                    </strong>
                  </div>
                  <div className="apple-risk-meter-bar">
                    <div
                      className="apple-risk-meter-fill"
                      style={{
                        width: `${computedHazardRisk}%`,
                        background: computedHazardRisk > 70 ? 'var(--apple-red)' : computedHazardRisk > 40 ? 'var(--apple-amber)' : 'var(--apple-green)'
                      }}
                    />
                  </div>
                  <div
                    className="apple-ai-recommendation-capsule"
                    style={{
                      background: computedHazardRisk > 70 ? 'rgba(255,69,58,0.12)' : 'rgba(0,113,227,0.12)',
                      color: hazardRecommendation.color
                    }}
                  >
                    <Zap size={13} />
                    <span>{hazardRecommendation.mode}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zoom In / Out / Reset Controls (70% to 100%) */}
          <div className="apple-map-zoom-pill-group" role="group" aria-label="Map Zoom Controls (70% to 100%)">
            <button
              type="button"
              className="apple-map-zoom-btn"
              onClick={zoomOut}
              disabled={zoomLevel <= MIN_ZOOM}
              title="Zoom out (min 70%)"
              aria-label="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <span
              className="apple-zoom-level-text"
              onClick={resetZoom}
              title="Click to reset zoom to 100%"
              style={{ cursor: 'pointer' }}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              className="apple-map-zoom-btn"
              onClick={zoomIn}
              disabled={zoomLevel >= MAX_ZOOM}
              title="Zoom in (max 100%)"
              aria-label="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            {(zoomLevel !== DEFAULT_ZOOM || panOffset.x !== 0 || panOffset.y !== 0) && (
              <button
                type="button"
                className="apple-map-zoom-btn reset"
                onClick={resetZoom}
                title="Reset zoom to 100%"
                aria-label="Reset zoom"
              >
                <RotateCcw size={11} />
              </button>
            )}
          </div>

          {/* Full Map / Zen Mode Toggle (Unobstructed View) */}
          {onToggleZenMap && (
            <button
              type="button"
              className={`apple-ios-toggle-btn zen-toggle ${isZenMapMode ? 'active' : ''}`}
              onClick={onToggleZenMap}
              title={isZenMapMode ? 'Exit Full Map mode' : 'Zen Focus (Hide surrounding UI)'}
              aria-pressed={isZenMapMode}
            >
              {isZenMapMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isZenMapMode ? 'Exit Zen' : 'Zen Map'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SVG Map Canvas (Crisp, Clean, Theme-Aware) */}
      <div
        className="apple-map-canvas-container"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          viewBox={currentViewBox}
          className="apple-map-svg"
          aria-label="Geospatial Map Canvas"
        >
          <defs>
            {/* Theme-Adaptive Background Gradient */}
            {isLight ? (
              <radialGradient id="tacticalMapBg" cx="50%" cy="45%" r="75%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="55%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </radialGradient>
            ) : (
              <radialGradient id="tacticalMapBg" cx="50%" cy="45%" r="75%">
                <stop offset="0%" stopColor="#0a1324" />
                <stop offset="55%" stopColor="#060c18" />
                <stop offset="100%" stopColor="#03060c" />
              </radialGradient>
            )}

            {/* Subtle Minimal Grid Dots */}
            <pattern id="appleMapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="0.8" fill={isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.12)"} />
            </pattern>

            {/* Soft Glow Filters */}
            <filter id="corridorGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hazardGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Soft glow for selected pin */}
            <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--apple-blue)" stopOpacity={isLight ? "0.3" : "0.5"} />
              <stop offset="100%" stopColor="var(--apple-blue)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Base Gradient Canvas & Discreet Grid Dots (Infinite Bounds for 20% Zoom) */}
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#tacticalMapBg)" />
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#appleMapGrid)" />

          {/* 2. Topographic Contours (Subtle Elevation Curves WITHOUT Cluttering Text) */}
          {showContours && (
            <g className="apple-contour-layer" opacity={isLight ? "0.6" : "0.45"}>
              <path
                d="M 50 430 Q 280 470 540 420 T 950 440"
                fill="none"
                stroke={isLight ? "rgba(2, 132, 199, 0.22)" : "rgba(56, 189, 248, 0.25)"}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <path
                d="M 50 320 Q 300 370 580 300 T 950 330"
                fill="none"
                stroke={isLight ? "rgba(100, 116, 139, 0.25)" : "rgba(148, 163, 184, 0.25)"}
                strokeWidth="1"
                strokeDasharray="6 4"
              />
              <path
                d="M 60 210 Q 280 150 560 230 T 940 190"
                fill="none"
                stroke={isLight ? "rgba(180, 83, 9, 0.25)" : "rgba(251, 191, 36, 0.28)"}
                strokeWidth="1.2"
                strokeDasharray="8 5"
              />
              <path
                d="M 70 120 Q 260 60 520 120 T 930 90"
                fill="none"
                stroke={isLight ? "rgba(220, 38, 38, 0.3)" : "rgba(244, 63, 94, 0.35)"}
                strokeWidth="1.2"
              />
            </g>
          )}

          {/* 3. Weather Overlay Zone (Clean Translucent Atmospheric Glow & Cloudburst Scaling) */}
          {(showWeather || simRainfall > 25) && (
            <g className="apple-weather-overlay">
              <circle
                cx="340"
                cy="210"
                r={Math.min(240, 90 + simRainfall * 1.2)}
                fill={simRainfall > 50 ? "var(--apple-red)" : "var(--apple-blue)"}
                opacity={isLight ? 0.05 + (simRainfall / 120) * 0.08 : 0.06 + (simRainfall / 120) * 0.1}
              />
              <circle
                cx="340"
                cy="210"
                r={Math.min(240, 90 + simRainfall * 1.2)}
                fill="none"
                stroke={simRainfall > 50 ? "var(--apple-red)" : "var(--apple-blue)"}
                strokeWidth={simRainfall > 50 ? "1.8" : "1"}
                strokeDasharray="6 4"
                opacity={isLight ? 0.35 + (simRainfall / 120) * 0.35 : 0.3 + (simRainfall / 120) * 0.3}
              />
              {simRainfall > 45 && (
                <text
                  x="340"
                  y="214"
                  textAnchor="middle"
                  fill={isLight ? "#dc2626" : "#ff453a"}
                  fontSize="9.5"
                  fontWeight="700"
                  opacity="0.9"
                >
                  Active Monsoon Surge ({simRainfall} mm/h)
                </text>
              )}
            </g>
          )}

          {/* 4. UAV Flight Radius & Return Margin (Clean Rings) */}
          {showUavRadius && filteredVillages.length > 0 && (() => {
            const targetVillage = selectedVillage || filteredVillages[0];
            const p = projection(targetVillage.coordinates);
            const radiusPx = Math.max(70, Math.round(150 - (uavPayloadKg - 5) * 3.4));
            const returnMarginPx = Math.round(radiusPx * 0.75);

            return (
              <g key="uav-radius-layer" className="apple-uav-envelope">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radiusPx}
                  fill="rgba(0, 113, 227, 0.04)"
                  stroke="var(--apple-blue)"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                  opacity={isLight ? "0.85" : "0.75"}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={returnMarginPx}
                  fill="none"
                  stroke="var(--apple-green)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity={isLight ? "0.7" : "0.6"}
                />
              </g>
            );
          })()}

          {/* 5. Route Vectors (Clean, High-Contrast Glowing Corridors) */}
          {filteredVillages.length > 1 && (
            <g className="apple-route-vectors">
              {filteredVillages.map((v, i) => {
                if (i === filteredVillages.length - 1) return null;
                const next = filteredVillages[i + 1];
                const p1 = projection(v.coordinates);
                const p2 = projection(next.coordinates);
                const isHighRisk = v.riskStatus === 'High' || next.riskStatus === 'High' || simRainfall > 50;

                return (
                  <g key={`leg-${v.id}-${next.id}`} className="apple-route-leg">
                    {/* Neon Glow Under-layer */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isHighRisk ? 'var(--apple-red)' : 'var(--apple-blue)'}
                      strokeWidth="6"
                      strokeOpacity={isLight ? "0.18" : "0.22"}
                      strokeLinecap="round"
                    />

                    {/* Crisp Core Route Line */}
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isHighRisk ? 'var(--apple-red)' : 'var(--apple-blue)'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={isHighRisk ? '7 5' : 'none'}
                    />

                    {/* Subtle Directional Dash Flow (Active Corridor) */}
                    {!isHighRisk && (
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={isLight ? '#0071e3' : '#ffffff'}
                        strokeWidth="1.5"
                        strokeDasharray="4 28"
                        className="apple-flow-dash-animation"
                        strokeLinecap="round"
                        opacity={isLight ? "0.6" : "0.7"}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 6. Settlement Waypoint Pins with Sleek Theme-Adaptive Frosted Capsules */}
          {filteredVillages.map((village) => {
            const pos = projection(village.coordinates);
            const isSelected = selectedVillage?.id === village.id;
            const isHovered = hoveredVillage?.id === village.id;

            const markerColor =
              village.riskStatus === 'High'
                ? 'var(--apple-red)'
                : village.riskStatus === 'Moderate'
                ? 'var(--apple-amber)'
                : 'var(--apple-green)';

            const textLengthApprox = (village.name?.length || 8) * 7.2 + (village.elevationMeters ? 45 : 14);

            return (
              <g
                key={village.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => onSelectVillage && onSelectVillage(village)}
                onMouseEnter={() => setHoveredVillage(village)}
                onMouseLeave={() => setHoveredVillage(null)}
                className={`apple-map-pin ${isSelected ? 'selected' : ''}`}
                tabIndex="0"
                role="button"
                aria-label={`${village.name}, ${village.riskStatus} risk, access score ${village.accessScore}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectVillage && onSelectVillage(village);
                  }
                }}
              >
                {/* Outer Selected Glow Ring & Pulse */}
                {isSelected && (
                  <>
                    <circle r="20" fill="url(#pinGlow)" opacity={isLight ? "0.5" : "0.7"} className="apple-pulse-ring" />
                    <circle r="14" fill="none" stroke="var(--apple-blue)" strokeWidth="1.8" strokeDasharray="3 2" />
                  </>
                )}

                {/* Main Beacon Dot */}
                <circle
                  r={isSelected ? '8' : isHovered ? '7.5' : '6'}
                  fill={markerColor}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.2' : '1.6'}
                  filter={isSelected ? 'url(#corridorGlow)' : undefined}
                />

                {/* Inner Center Dot */}
                <circle
                  r="2"
                  fill="#ffffff"
                />

                {/* Border Outpost Badge Indicator */}
                {village.borderZone && (
                  <circle cx="5.5" cy="-5.5" r="3" fill="var(--apple-amber)" stroke={isLight ? "#ffffff" : "#060c18"} strokeWidth="1" />
                )}

                {/* High-Contrast Frosted Settlement Capsule (Theme Adaptive) */}
                <g transform="translate(12, -10)" className="apple-map-village-pill">
                  <rect
                    x="0"
                    y="0"
                    width={textLengthApprox}
                    height="20"
                    rx="10"
                    fill={
                      isSelected
                        ? (isLight ? 'rgba(0, 113, 227, 0.15)' : 'rgba(0, 113, 227, 0.28)')
                        : (isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(8, 14, 26, 0.88)')
                    }
                    stroke={
                      isSelected
                        ? 'var(--apple-blue)'
                        : (isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.16)')
                    }
                    strokeWidth={isSelected ? '1.5' : '1'}
                  />
                  <text
                    x="8"
                    y="14"
                    fill={
                      isSelected
                        ? (isLight ? '#0071e3' : '#ffffff')
                        : (isLight ? '#0f172a' : '#ffffff')
                    }
                    fontSize="10.5"
                    fontWeight={isSelected ? '700' : '600'}
                  >
                    {village.name}
                  </text>
                  {village.elevationMeters && (
                    <text
                      x={textLengthApprox - 36}
                      y="14"
                      fill={
                        isSelected
                          ? (isLight ? '#0284c7' : '#60a5fa')
                          : (isLight ? '#64748b' : 'var(--apple-text-tertiary)')
                      }
                      fontSize="9"
                      fontWeight="500"
                    >
                      {village.elevationMeters}m
                    </text>
                  )}
                </g>
              </g>
            );
          })}

          {/* 6.5 Animated Sortie Vehicle Marker */}
          {isSimulatingSortie && currentSortiePosition && (
            <g
              className="apple-sortie-vehicle-marker"
              transform={`translate(${currentSortiePosition.x}, ${currentSortiePosition.y})`}
            >
              {/* Outer Radio Pulse */}
              <circle r="20" fill="none" stroke={sortieMode === 'UAV' ? "var(--apple-blue)" : "var(--apple-amber)"} strokeWidth="1.2" opacity="0.45" className="apple-pulse-ring" />
              
              {/* Heading Orientated Vehicle Group */}
              <g transform={`rotate(${currentSortiePosition.angle})`}>
                {sortieMode === 'UAV' ? (
                  <g>
                    {/* Forward searchlight beam */}
                    <polygon
                      points="0,0 55,-18 55,18"
                      fill={isLight ? "rgba(0,113,227,0.12)" : "rgba(0,113,227,0.22)"}
                      className="apple-drone-searchlight"
                    />
                    {/* Drone Arms */}
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#ffffff" strokeWidth="2.2" />
                    <line x1="-10" y1="10" x2="10" y2="-10" stroke="#ffffff" strokeWidth="2.2" />
                    {/* Spinning Propeller Discs */}
                    {[-10, 10].map(px => [-10, 10].map(py => (
                      <circle
                        key={`prop-${px}-${py}`}
                        cx={px}
                        cy={py}
                        r="5.5"
                        fill="rgba(0,113,227,0.35)"
                        stroke="var(--apple-blue)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        className="apple-rotor-blade"
                      />
                    )))}
                    {/* Drone Center Fuselage */}
                    <circle r="6" fill="var(--apple-blue)" stroke="#ffffff" strokeWidth="1.8" />
                    <circle r="2" fill="#ffffff" />
                  </g>
                ) : (
                  <g>
                    {/* Headlights beam */}
                    <polygon
                      points="0,0 45,-12 45,12"
                      fill={isLight ? "rgba(255,159,10,0.14)" : "rgba(255,159,10,0.25)"}
                    />
                    {/* Vehicle Body */}
                    <rect x="-12" y="-7" width="24" height="14" rx="3" fill="var(--apple-amber)" stroke="#ffffff" strokeWidth="1.8" />
                    <rect x="-5" y="-5" width="8" height="10" rx="1.5" fill="#0f172a" />
                    {/* Wheels */}
                    <rect x="-10" y="-9" width="5" height="3" rx="1" fill="#1e293b" />
                    <rect x="5" y="-9" width="5" height="3" rx="1" fill="#1e293b" />
                    <rect x="-10" y="6" width="5" height="3" rx="1" fill="#1e293b" />
                    <rect x="5" y="6" width="5" height="3" rx="1" fill="#1e293b" />
                  </g>
                )}
              </g>

              {/* Live Floating Altitude & Speed Tag above Marker */}
              <g transform="translate(0, -20)" className="apple-sortie-marker-tag">
                <rect
                  x="-42"
                  y="-14"
                  width="84"
                  height="16"
                  rx="3"
                  fill={isLight ? "rgba(255,255,255,0.94)" : "rgba(8,14,26,0.92)"}
                  stroke={sortieMode === 'UAV' ? "var(--apple-blue)" : "var(--apple-amber)"}
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="-3"
                  textAnchor="middle"
                  fill={isLight ? "#0f172a" : "#ffffff"}
                  fontSize="8.5"
                  fontWeight="700"
                >
                  {isConvoyBlocked ? 'BLOCKED' : sortieMode === 'UAV' ? `${currentSortiePosition.altitude}m • 65km/h` : `${currentSortiePosition.altitude}m • 32km/h`}
                </text>
              </g>
            </g>
          )}

          {/* 7. Minimal Discreet Compass Arrow (Top Right) */}
          <g transform={`translate(${SVG_WIDTH - 42}, 42)`} className="apple-compass-hud" opacity={isLight ? "0.85" : "0.6"}>
            <circle r="14" fill={isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(8, 14, 26, 0.7)"} stroke={isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)"} strokeWidth="0.8" />
            <polygon points="0,-10 3,0 -3,0" fill="var(--apple-red)" />
            <polygon points="0,10 3,0 -3,0" fill={isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)"} />
            <text x="0" y="-12" fill="var(--apple-red)" fontSize="7" fontWeight="800" textAnchor="middle">N</text>
          </g>

          {/* 8. Minimal Distance Scale Bar (Bottom Right) */}
          <g transform={`translate(${SVG_WIDTH - 120}, ${SVG_HEIGHT - 24})`} className="apple-scale-hud" opacity={isLight ? "0.8" : "0.65"}>
            <line x1="0" y1="0" x2="80" y2="0" stroke={isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.6)"} strokeWidth="1.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke={isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.6)"} strokeWidth="1.5" />
            <line x1="80" y1="-3" x2="80" y2="3" stroke={isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.6)"} strokeWidth="1.5" />
            <text x="40" y="-5" fill={isLight ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.6)"} fontSize="8" textAnchor="middle" fontWeight="500">50 km</text>
          </g>
        </svg>

        {/* Hover Tooltip Glass Card */}
        {hoveredVillage && (
          <div className="apple-map-hover-card">
            <div className="hover-card-title-row">
              <span className="hover-card-name">{hoveredVillage.name}</span>
              {hoveredVillage.borderZone && (
                <span className="hover-card-border-tag">
                  <ShieldAlert size={11} /> Border Outpost
                </span>
              )}
            </div>
            <div className="hover-card-details">
              <span>Terrain: {hoveredVillage.terrain || 'Mountain Ridge'} • Altitude: {hoveredVillage.elevationMeters || 1200}m</span>
              <span>
                Access Score: <strong className="text-blue">{hoveredVillage.accessScore}%</strong> • Status: <strong style={{ color: hoveredVillage.riskStatus === 'High' ? 'var(--apple-red)' : 'var(--apple-green)' }}>{hoveredVillage.riskStatus} Risk</strong>
              </span>
            </div>
            <span className="hover-card-prompt">Click waypoint to inspect operational dossier →</span>
          </div>
        )}

        {/* Floating Sortie Mission Telemetry HUD */}
        {isSimulatingSortie && (
          <div className="apple-sortie-hud" role="region" aria-label="Sortie Mission Telemetry">
            {/* Header: Mode & Leg info */}
            <div className="apple-sortie-header-row">
              <div className="apple-sortie-title-group">
                <span className={`apple-sortie-badge ${sortieMode === 'CONVOY' ? 'convoy' : ''}`}>
                  {sortieMode === 'UAV' ? <Plane size={12} /> : <Truck size={12} />}
                  <span>{sortieMode === 'UAV' ? 'Heavy Cargo UAV' : '4WD Road Convoy'}</span>
                </span>
                <span className="apple-sortie-leg-info">
                  {currentSortiePosition ? (
                    <>
                      <span>Leg {currentSortiePosition.legIndex}/{currentSortiePosition.totalLegs}:</span>
                      <strong className="text-blue">{currentSortiePosition.fromName} → {currentSortiePosition.toName}</strong>
                    </>
                  ) : (
                    <span>Sortie En Route...</span>
                  )}
                </span>
              </div>

              {/* Control Action Buttons */}
              <div className="apple-sortie-actions">
                {/* Mode Selector */}
                <button
                  type="button"
                  className={`apple-sortie-ctrl-btn ${sortieMode === 'UAV' ? 'active' : ''}`}
                  onClick={() => setSortieMode('UAV')}
                  title="Switch to Drone Sortie"
                >
                  <Plane size={11} /> UAV
                </button>
                <button
                  type="button"
                  className={`apple-sortie-ctrl-btn ${sortieMode === 'CONVOY' ? 'active' : ''}`}
                  onClick={() => { setSortieMode('CONVOY'); setIsConvoyBlocked(false); }}
                  title="Switch to Surface 4WD Convoy"
                >
                  <Truck size={11} /> 4WD
                </button>

                {/* Speed Multiplier */}
                {[1, 2, 5].map(mult => (
                  <button
                    key={mult}
                    type="button"
                    className={`apple-sortie-ctrl-btn ${sortieSpeedMultiplier === mult ? 'active' : ''}`}
                    onClick={() => setSortieSpeedMultiplier(mult)}
                    title={`Run at ${mult}x speed`}
                  >
                    {mult}x
                  </button>
                ))}

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  className="apple-sortie-ctrl-btn"
                  onClick={isSortiePaused ? resumeSortie : pauseSortie}
                  title={isSortiePaused ? "Resume sortie" : "Pause sortie"}
                >
                  {isSortiePaused ? <Play size={12} className="text-emerald" /> : <Pause size={12} />}
                </button>

                {/* Reset Sortie */}
                <button
                  type="button"
                  className="apple-sortie-ctrl-btn"
                  onClick={resetSortie}
                  title="Restart from beginning"
                >
                  <RotateCcw size={11} />
                </button>

                {/* Close Sortie */}
                <button
                  type="button"
                  className="apple-sortie-ctrl-btn close"
                  onClick={stopSortie}
                  title="Dismiss Sortie Simulation"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Simulated Landslide Block Alert for Convoy */}
            {isConvoyBlocked && (
              <div className="apple-sortie-blocked-banner">
                <div className="apple-blocked-text">
                  <AlertTriangle size={15} className="text-rose" />
                  <span>
                    <strong>CONVOY HALTED:</strong> Mountain landslide and mudflow block road corridor at {simRainfall} mm/h rainfall!
                  </span>
                </div>
                <button
                  type="button"
                  className="apple-reroute-btn"
                  onClick={handleRerouteToDrone}
                  title="Reroute payload over blockage via autonomous UAV air-drop"
                >
                  <Zap size={12} />
                  <span>Reroute via Cargo UAV</span>
                </button>
              </div>
            )}

            {/* Progress Track */}
            <div className="apple-sortie-progress-track">
              <div
                className="apple-sortie-progress-fill"
                style={{ width: `${Math.round(sortieProgress * 100)}%` }}
              />
            </div>

            {/* Telemetry Cells */}
            <div className="apple-sortie-telemetry-grid">
              <div className="apple-telemetry-cell">
                <span className="t-label">Ground Velocity</span>
                <span className="t-value text-blue">
                  {isConvoyBlocked ? '0 km/h (Blocked)' : sortieMode === 'UAV' ? `${Math.round(62 + Math.sin(sortieProgress * 20) * 4)} km/h` : `${Math.round(32 - (currentSortiePosition?.altitude > 2500 ? 10 : 0))} km/h`}
                </span>
              </div>

              <div className="apple-telemetry-cell">
                <span className="t-label">DEM Altitude</span>
                <span className="t-value">
                  {currentSortiePosition ? `${currentSortiePosition.altitude}m ASL` : '2,100m ASL'}
                </span>
              </div>

              <div className="apple-telemetry-cell">
                <span className="t-label">{sortieMode === 'UAV' ? 'Battery Margin' : 'Fuel Reserve'}</span>
                <span className="t-value text-emerald">
                  {Math.max(12, Math.round(100 - sortieProgress * 32))}% (RTB Safe)
                </span>
              </div>

              <div className="apple-telemetry-cell">
                <span className="t-label">Corridor Completion</span>
                <span className="t-value">
                  {Math.round(sortieProgress * 100)}% {isSortieCompleted ? '(Delivered)' : ''}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
