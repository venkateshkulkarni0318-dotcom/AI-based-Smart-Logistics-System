import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Landmark,
  Plane,
  Radio,
  Siren,
  SlidersHorizontal,
  GraduationCap,
  PlayCircle,
  BookOpen,
  Volume2,
  VolumeX,
  Zap,
  Command,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useCommandRole } from '../context/CommandRoleContext';
import { useUiPreferences } from '../context/UiPreferencesContext';

const ROLE_ICONS = {
  ndrf: ShieldAlert,
  magistrate: Landmark,
  drone_pilot: Plane,
  sarpanch: Radio
};

const CommandRoleSwitcher = () => {
  const { activeRole, activeRoleId, setRole, allRoles } = useCommandRole();
  const {
    viewMode,
    isSimpleMode,
    toggleViewMode,
    language,
    setLanguage,
    t,
    isDisasterMode,
    toggleDisasterMode,
    liteMode,
    toggleLiteMode,
    setWalkthroughOpen,
    setGlossaryOpen,
    setExaminerOpen,
    setCommandPaletteOpen,
    soundEnabled,
    toggleSound
  } = useUiPreferences();

  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    if (toolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toolsOpen]);

  // If role is Field Outpost (sarpanch), automatically sync lite mode if not already set
  useEffect(() => {
    if (activeRoleId === 'sarpanch' && !liteMode) {
      toggleLiteMode();
    }
  }, [activeRoleId]);

  return (
    <header
      className={`apple-top-bar ${isDisasterMode ? 'emergency-active' : ''}`}
      role="toolbar"
      aria-label="Command Perspectives and Operational Roles"
    >
      {/* Left: Role Selection Segmented Control */}
      <div className="apple-role-group">
        <span className="apple-role-label">Role:</span>
        <div className="apple-segmented-control" role="radiogroup" aria-label="Operational Role Selection">
          {Object.values(allRoles).map((role) => {
            const isSelected = activeRoleId === role.id;
            const IconComponent = ROLE_ICONS[role.id] || ShieldAlert;
            return (
              <button
                key={role.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setRole(role.id)}
                className={`apple-segmented-item ${isSelected ? 'active' : ''}`}
                style={{
                  '--role-accent': role.accent,
                  '--role-bg-badge': role.bgBadge
                }}
              >
                <IconComponent size={14} className="apple-role-icon" />
                <span className="apple-role-name">{role.shortName}</span>
                {isSelected && <span className="apple-active-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Disaster Management Mode + Language + Tools Menu + Search / Command Palette */}
      <div className="apple-topbar-actions">
        {/* Disaster Management Mode - iOS Style Pill Button with Emergency State */}
        <button
          type="button"
          onClick={toggleDisasterMode}
          className={`apple-disaster-toggle ${isDisasterMode ? 'active' : ''}`}
          aria-pressed={isDisasterMode}
          title={isDisasterMode ? 'Disaster Mode Active - Click to return to normal' : 'Activate Disaster Management Mode'}
        >
          <Siren size={15} className={`apple-siren-icon ${isDisasterMode ? 'pulsing' : ''}`} />
          <span className="apple-disaster-label">
            {isDisasterMode ? t('crisisActiveLabel') : t('disasterModeLabel')}
          </span>
          <span className={`apple-switch-knob ${isDisasterMode ? 'on' : 'off'}`} aria-hidden="true" />
        </button>

        {/* Language Selector: iOS Segmented Capsule */}
        <div className="apple-language-segmented" role="group" aria-label="Language Selector">
          <Globe size={13} className="apple-lang-icon" />
          {[
            { id: 'en', label: 'EN' },
            { id: 'hi', label: 'हिन्दी' },
            { id: 'kn', label: 'ಕನ್ನಡ' }
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={`apple-lang-btn ${language === l.id ? 'active' : ''}`}
              aria-pressed={language === l.id}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Tools Menu Glass Dropdown */}
        <div className="apple-tools-wrapper" ref={toolsMenuRef}>
          <button
            type="button"
            className={`apple-tools-trigger ${toolsOpen ? 'open' : ''}`}
            onClick={() => setToolsOpen(prev => !prev)}
            aria-expanded={toolsOpen}
            aria-haspopup="true"
            title="Tools, Walkthroughs & Technical Options"
          >
            <SlidersHorizontal size={14} />
            <span>Tools</span>
            <ChevronDown size={12} className={`apple-chevron ${toolsOpen ? 'rotate' : ''}`} />
          </button>

          {toolsOpen && (
            <div className="apple-tools-dropdown" role="menu">
              <div className="apple-dropdown-section-title">Evaluation & Scenarios</div>
              <button
                type="button"
                className="apple-dropdown-item primary"
                onClick={() => { setExaminerOpen(true); setToolsOpen(false); }}
                role="menuitem"
              >
                <GraduationCap size={15} className="text-indigo" />
                <div className="apple-dropdown-item-content">
                  <span className="title">Examiner Tests</span>
                  <span className="desc">1-Click viva challenge verification</span>
                </div>
              </button>

              <button
                type="button"
                className="apple-dropdown-item"
                onClick={() => { setWalkthroughOpen(true); setToolsOpen(false); }}
                role="menuitem"
              >
                <PlayCircle size={15} className="text-amber" />
                <div className="apple-dropdown-item-content">
                  <span className="title">Scenario Walkthrough</span>
                  <span className="desc">5-step Zanskar Pass avalanche demo</span>
                </div>
              </button>

              <button
                type="button"
                className="apple-dropdown-item"
                onClick={() => { setGlossaryOpen(true); setToolsOpen(false); }}
                role="menuitem"
              >
                <BookOpen size={15} />
                <div className="apple-dropdown-item-content">
                  <span className="title">Technical Glossary</span>
                  <span className="desc">SHRUG, SRTM & TreeSHAP standards</span>
                </div>
              </button>

              <div className="apple-dropdown-divider" />
              <div className="apple-dropdown-section-title">Display & Performance</div>

              <button
                type="button"
                className="apple-dropdown-item"
                onClick={() => { toggleViewMode(); }}
                role="menuitem"
              >
                <SlidersHorizontal size={15} />
                <div className="apple-dropdown-item-content">
                  <span className="title">{isSimpleMode ? 'Switch to Technical View' : 'Switch to Simple View'}</span>
                  <span className="desc">{isSimpleMode ? 'Show engineering loss curves & SHAP' : 'Show simplified officer summary'}</span>
                </div>
              </button>

              <button
                type="button"
                className="apple-dropdown-item"
                onClick={() => { toggleLiteMode(); }}
                role="menuitem"
              >
                <Zap size={15} className={liteMode ? 'text-amber' : ''} />
                <div className="apple-dropdown-item-content">
                  <span className="title">Lite Mode {liteMode ? '(Active)' : '(Disabled)'}</span>
                  <span className="desc">Disables frosted blur for low bandwidth</span>
                </div>
              </button>

              <button
                type="button"
                className="apple-dropdown-item"
                onClick={() => { toggleSound(); }}
                role="menuitem"
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="text-rose" />}
                <div className="apple-dropdown-item-content">
                  <span className="title">{soundEnabled ? 'Tactical Audio: On' : 'Tactical Audio: Muted'}</span>
                  <span className="desc">Audible cues for alert triggers</span>
                </div>
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default CommandRoleSwitcher;
