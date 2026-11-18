import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  X,
  Siren,
  Landmark,
  Plane,
  Radio,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Flame,
  Zap,
  Globe,
  Compass,
  LayoutDashboard,
  Truck,
  Brain,
  MapPin,
  Route,
  Mountain
} from 'lucide-react';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { useCommandRole } from '../context/CommandRoleContext';

const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    isDisasterMode,
    toggleDisasterMode,
    liteMode,
    toggleLiteMode,
    viewMode,
    toggleViewMode,
    soundEnabled,
    toggleSound,
    setExaminerOpen,
    setWalkthroughOpen,
    setGlossaryOpen,
    language,
    setLanguage,
    t
  } = useUiPreferences();

  const { activeRoleId, setRole, allRoles } = useCommandRole();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [commandPaletteOpen]);

  const allActions = useMemo(() => [
    // Navigation items
    { id: 'nav-home', category: 'Navigation', icon: <LayoutDashboard size={16} />, title: 'Command Overview', detail: 'Real-time telemetry & operational status', action: () => navigate('/') },
    { id: 'nav-dashboard', category: 'Navigation', icon: <Compass size={16} />, title: 'Tactical Command Map', detail: 'Full-screen map-first operations view', action: () => navigate('/dashboard') },
    { id: 'nav-multimodal', category: 'Navigation', icon: <Truck size={16} />, title: 'Obj 01: Multi-Modal Transport', detail: 'Road, Rail, Waterway & UAV unit economics', action: () => navigate('/multimodal') },
    { id: 'nav-mlrisk', category: 'Navigation', icon: <Brain size={16} />, title: 'Obj 02: ML Risk Predictor', detail: 'TreeSHAP attribution & Random Forest', action: () => navigate('/ml-risk') },
    { id: 'nav-villages', category: 'Navigation', icon: <MapPin size={16} />, title: 'Obj 03: Settlement Database', detail: '585K SHRUG settlements & border outposts', action: () => navigate('/villages') },
    { id: 'nav-routes', category: 'Navigation', icon: <Route size={16} />, title: 'Obj 04: Route Intelligence', detail: 'SRTM elevation gradients & AI dispatch', action: () => navigate('/routes') },
    { id: 'nav-disaster', category: 'Navigation', icon: <Siren size={16} />, title: 'Obj 05: Disaster Center', detail: 'Emergency village SOS queues & UAV relief', action: () => navigate('/disaster') },
    { id: 'nav-casestudies', category: 'Navigation', icon: <Mountain size={16} />, title: 'Obj 06: Corridors & Case Studies', detail: 'Himalayan, Brahmaputra & Thar corridors', action: () => navigate('/case-studies') },

    // Role switching
    { id: 'role-ndrf', category: 'Operational Perspective', icon: <Siren size={16} className="text-rose" />, title: 'Switch Role: NDRF Cmdr', detail: 'Crisis command & high-priority life safety', action: () => setRole('ndrf') },
    { id: 'role-magistrate', category: 'Operational Perspective', icon: <Landmark size={16} className="text-blue" />, title: 'Switch Role: District DM', detail: 'Civil administration & SHRUG demographic audit', action: () => setRole('magistrate') },
    { id: 'role-drone', category: 'Operational Perspective', icon: <Plane size={16} className="text-emerald" />, title: 'Switch Role: UAV Pilot', detail: 'Himalayan drone squadron & 4,200m ASL flight ceiling', action: () => setRole('drone_pilot') },
    { id: 'role-sarpanch', category: 'Operational Perspective', icon: <Radio size={16} className="text-amber" />, title: 'Switch Role: Field Outpost', detail: 'Low-bandwidth checklist view & local supplies', action: () => setRole('sarpanch') },

    // Tools & Examiner
    { id: 'tool-examiner', category: 'Evaluator Tools', icon: <GraduationCap size={16} className="text-indigo" />, title: 'Launch Examiner Viva Tests', detail: '1-click demonstration scenarios for project evaluation', action: () => setExaminerOpen(true) },
    { id: 'tool-walkthrough', category: 'Evaluator Tools', icon: <PlayCircle size={16} className="text-amber" />, title: 'Launch 5-Step Guided Scenario', detail: 'Zanskar Pass avalanche & UAV airdrop walkthrough', action: () => setWalkthroughOpen(true) },
    { id: 'tool-glossary', category: 'Evaluator Tools', icon: <BookOpen size={16} />, title: 'Open Technical Glossary', detail: 'Definitions for SHRUG, SRTM, TreeSHAP, and NavIC', action: () => setGlossaryOpen(true) },

    // System Toggles
    { id: 'toggle-disaster', category: 'System Controls', icon: <Flame size={16} className="text-rose" />, title: isDisasterMode ? 'Deactivate Crisis Response' : 'Activate Disaster Management Mode', detail: 'Toggle high-contrast solid panels & emergency pinning', action: toggleDisasterMode },
    { id: 'toggle-viewmode', category: 'System Controls', icon: <SlidersHorizontal size={16} />, title: `Switch to ${viewMode === 'simple' ? 'Technical (Engineering)' : 'Simple (Officer)'} View`, detail: 'Toggle advanced metrics vs executive summary', action: toggleViewMode },
    { id: 'toggle-litemode', category: 'System Controls', icon: <Zap size={16} />, title: `Turn Lite Mode ${liteMode ? 'OFF' : 'ON'}`, detail: 'Disables frosted glass blur & animations for low-end hardware', action: toggleLiteMode },
    { id: 'toggle-sound', category: 'System Controls', icon: soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />, title: soundEnabled ? 'Mute Tactical Audio Alerts' : 'Enable Tactical Audio Alerts', detail: 'Audio chimes for priority triggers & dispatches', action: toggleSound },

    // Languages
    { id: 'lang-en', category: 'Language', icon: <Globe size={16} />, title: 'Language: English (EN)', detail: 'Default operational language', action: () => setLanguage('en') },
    { id: 'lang-hi', category: 'Language', icon: <Globe size={16} />, title: 'Language: हिन्दी (Hindi)', detail: 'क्षेत्रीय राजभाषा अनुवाद', action: () => setLanguage('hi') },
    { id: 'lang-kn', category: 'Language', icon: <Globe size={16} />, title: 'Language: ಕನ್ನಡ (Kannada)', detail: 'ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ಅನುವಾದ', action: () => setLanguage('kn') }
  ], [isDisasterMode, liteMode, viewMode, soundEnabled, navigate, setRole, toggleDisasterMode, toggleLiteMode, toggleViewMode, toggleSound, setExaminerOpen, setWalkthroughOpen, setGlossaryOpen, setLanguage]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return allActions;
    const q = query.toLowerCase();
    return allActions.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.detail.toLowerCase().includes(q)
    );
  }, [allActions, query]);

  const handleSelect = (action) => {
    action.action();
    setCommandPaletteOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredActions.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        handleSelect(filteredActions[selectedIndex]);
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      className="apple-modal-backdrop"
      onClick={() => setCommandPaletteOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="apple-command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="apple-command-header">
          <Search size={18} className="apple-command-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="apple-command-input"
            placeholder="Type a command, objective, role, or tool..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="apple-kbd">ESC</kbd>
          <button
            type="button"
            className="apple-command-close-btn"
            onClick={() => setCommandPaletteOpen(false)}
            aria-label="Close Command Palette"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="apple-command-list" role="listbox">
          {filteredActions.length === 0 ? (
            <div className="apple-command-empty">
              No matching actions found for "{query}"
            </div>
          ) : (
            filteredActions.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`apple-command-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="apple-command-item-icon">
                    {item.icon}
                  </div>
                  <div className="apple-command-item-text">
                    <div className="apple-command-item-title">
                      {item.title}
                    </div>
                    <div className="apple-command-item-detail">
                      {item.detail}
                    </div>
                  </div>
                  <div className="apple-command-item-badge">
                    {item.category}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="apple-command-footer">
          <span>Use <kbd className="apple-kbd">↑</kbd> <kbd className="apple-kbd">↓</kbd> to navigate</span>
          <span><kbd className="apple-kbd">↵</kbd> to select</span>
          <span><kbd className="apple-kbd">Ctrl+K</kbd> to open anytime</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
