import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Truck,
  Brain,
  MapPin,
  Route,
  Siren,
  Mountain,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Database,
  RadioTower
} from 'lucide-react';
import { getGeoStatus } from '../services/api';

const navItems = [
  {
    section: 'Overview',
    links: [
      { to: '/', icon: LayoutDashboard, label: 'Command Overview', exact: true },
      { to: '/dashboard', icon: Compass, label: 'Tactical Command Map' }
    ]
  },
  {
    section: 'Core Objectives',
    links: [
      { to: '/multimodal', icon: Truck, label: 'Multi-Modal Transport', badge: 'Obj 01' },
      { to: '/ml-risk', icon: Brain, label: 'ML Risk Predictor', badge: 'Obj 02' },
      { to: '/villages', icon: MapPin, label: 'Settlement Database', badge: 'Obj 03' },
      { to: '/routes', icon: Route, label: 'Route Intelligence', badge: 'Obj 04' },
      { to: '/disaster', icon: Siren, label: 'Disaster Command', badge: 'Obj 05' },
      { to: '/case-studies', icon: Mountain, label: 'Case Studies', badge: 'Obj 06' }
    ]
  }
];

const Sidebar = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [geoStatus, setGeoStatus] = useState(null);

  useEffect(() => {
    getGeoStatus()
      .then(res => {
        if (res?.success) setGeoStatus(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`apple-sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`apple-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Header / Brand Area */}
        <div className="apple-sidebar-header">
          {!isCollapsed ? (
            <div className="apple-brand-wrapper">
              <div className="apple-brand-badge">
                <RadioTower size={18} className="apple-brand-icon" />
              </div>
              <div className="apple-brand-text">
                <span className="apple-brand-title">AI-LOGIX</span>
                <span className="apple-brand-subtitle">Rural Logistics Command</span>
              </div>
            </div>
          ) : (
            <div
              className="apple-brand-badge collapsed"
              onClick={onToggleCollapse}
              title="AI-LOGIX Command Platform"
            >
              <RadioTower size={18} className="apple-brand-icon" />
            </div>
          )}

          {/* Sidebar Collapse Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              className="apple-sidebar-toggle-btn"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>



        {/* Navigation Sections */}
        <nav className="apple-sidebar-nav">
          {navItems.map((section) => (
            <div key={section.section} className="apple-sidebar-section">
              {!isCollapsed ? (
                <div className="apple-sidebar-section-title">{section.section}</div>
              ) : (
                <div className="apple-sidebar-section-divider" title={section.section} />
              )}

              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.exact}
                    className={({ isActive }) => `apple-sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                    title={isCollapsed ? `${link.label} ${link.badge ? `(${link.badge})` : ''}` : undefined}
                  >
                    <div className="apple-item-icon-wrapper">
                      <Icon size={17} />
                    </div>
                    {!isCollapsed && <span className="apple-item-label">{link.label}</span>}
                    {!isCollapsed && link.badge && (
                      <span className="apple-item-badge">{link.badge}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Area: Dataset Status & Theme Toggle */}
        <div className="apple-sidebar-footer">
          {!isCollapsed ? (
            <>
              {/* Telemetry pill */}
              <div className="apple-sidebar-telemetry">
                <Database size={13} className="text-blue" />
                <div className="apple-telemetry-text">
                  <span>SHRUG 585K • SRTM 30m</span>
                  <span className="apple-telemetry-sub">
                    {geoStatus?.totalFeatures ? `${geoStatus.totalFeatures} Topo Nodes Active` : 'All Geodatasets Loaded'}
                  </span>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                className="apple-sidebar-theme-btn"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Appearance' : 'Switch to Dark Appearance'}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}</span>
              </button>

              {/* Compliance & Legal Navigation Links */}
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.68rem', color: 'var(--apple-text-tertiary)', marginTop: '8px', justifyContent: 'center' }}>
                <NavLink to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }} onClick={onClose}>
                  Privacy Policy
                </NavLink>
                <span>&bull;</span>
                <NavLink to="/terms" style={{ color: 'inherit', textDecoration: 'none' }} onClick={onClose}>
                  Terms &amp; Conditions
                </NavLink>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="apple-sidebar-theme-btn-collapsed"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Light Appearance' : 'Dark Appearance'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
