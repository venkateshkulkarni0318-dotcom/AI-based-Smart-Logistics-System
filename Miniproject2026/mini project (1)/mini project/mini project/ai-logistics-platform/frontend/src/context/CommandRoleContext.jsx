import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  ndrf: {
    id: 'ndrf',
    label: 'NDRF Incident Commander',
    shortName: 'NDRF Cmdr',
    icon: 'ndrf',
    agency: 'National Disaster Response Force (Ops Directorate)',
    accent: '#ef4444',
    bgBadge: 'rgba(239, 68, 68, 0.15)',
    mission: 'EMERGENCY AIR-DROP & CRISIS EVACUATION • High Priority Life-Safety Dispatch Active',
    badge: 'CRISIS COMMAND',
    defaultCorridor: 'corridor-delta',
    focusMetrics: [
      { label: 'Active Alerts', value: '4 Critical' },
      { label: 'Air-Drop Readiness', value: '100% Armed' },
      { label: 'Evac Corridor', value: 'Brahm. Riverine' }
    ]
  },
  magistrate: {
    id: 'magistrate',
    label: 'District Logistics Magistrate',
    shortName: 'District DM',
    icon: 'magistrate',
    agency: 'District Disaster Management Authority (DDMA)',
    accent: '#3b82f6',
    bgBadge: 'rgba(59, 130, 246, 0.15)',
    mission: 'MULTI-MODAL FISCAL AUDIT • 585K SHRUG Village Demographic Planning & Accessibility',
    badge: 'CIVIL ADMIN',
    defaultCorridor: 'corridor-himalaya',
    focusMetrics: [
      { label: 'SHRUG Constituencies', value: '4,149 ACs' },
      { label: 'Budget Efficiency', value: '₹14.2 / t-km' },
      { label: 'Seasonal Buffer', value: '92 Days' }
    ]
  },
  drone_pilot: {
    id: 'drone_pilot',
    label: 'Tactical UAV Flight Operator',
    shortName: 'UAV Pilot',
    icon: 'drone_pilot',
    agency: 'Himalayan Heavy-Lift Drone Squadron (DGCA Authorized)',
    accent: '#10b981',
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    mission: 'SRTM ALTITUDE TRANSECT ENVELOPE • 4,200m ASL Ceiling Check & Battery Range Model',
    badge: 'AIR OPS',
    defaultCorridor: 'corridor-himalaya',
    focusMetrics: [
      { label: 'Operating Ceiling', value: '4,200 m ASL' },
      { label: 'Max Payload (T-40)', value: '40 kg' },
      { label: 'Wind Resistance', value: '45 km/h Safe' }
    ]
  },
  sarpanch: {
    id: 'sarpanch',
    label: 'Village Sarpanch / Outpost Lead',
    shortName: 'Field Outpost',
    icon: 'sarpanch',
    agency: 'Gram Panchayat & ITBP Remote Border Outpost Relay',
    accent: '#f59e0b',
    bgBadge: 'rgba(245, 158, 11, 0.15)',
    mission: 'COMMUNITY DISTRESS RELAY • Local Medicine & Essential Ration Stockpile Monitored',
    badge: 'FIELD LEVEL',
    defaultCorridor: 'corridor-desert',
    focusMetrics: [
      { label: 'Emergency Stock', value: '18 Days Supply' },
      { label: 'Pass Status', value: 'Seasonal Warning' },
      { label: 'Nearest Depot', value: '38.4 km (Base)' }
    ]
  }
};

const CommandRoleContext = createContext(null);

export const CommandRoleProvider = ({ children }) => {
  const [activeRoleId, setActiveRoleId] = useState(() => {
    return localStorage.getItem('ai_logix_command_role') || 'ndrf';
  });

  useEffect(() => {
    localStorage.setItem('ai_logix_command_role', activeRoleId);
  }, [activeRoleId]);

  const activeRole = ROLES[activeRoleId] || ROLES.ndrf;

  const setRole = (roleId) => {
    if (ROLES[roleId]) {
      setActiveRoleId(roleId);
    }
  };

  return (
    <CommandRoleContext.Provider value={{ activeRole, activeRoleId, setRole, allRoles: ROLES }}>
      {children}
    </CommandRoleContext.Provider>
  );
};

export const useCommandRole = () => {
  const context = useContext(CommandRoleContext);
  if (!context) {
    throw new Error('useCommandRole must be used within a CommandRoleProvider');
  }
  return context;
};
