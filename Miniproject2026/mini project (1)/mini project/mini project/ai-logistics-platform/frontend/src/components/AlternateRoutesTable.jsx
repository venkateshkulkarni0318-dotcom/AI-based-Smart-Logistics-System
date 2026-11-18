import React, { useState } from 'react';
import { Plane, Truck, Shield, Train, Scale, Check } from 'lucide-react';
import DataBadge from './DataBadge';
import { playSuccessChime } from '../utils/soundEffects';

/**
 * AlternateRoutesTable Component (Phase 3 Requirement 6.2 - Objective 04)
 * Multi-criteria comparative evaluation: Fastest vs Safest vs Cheapest vs Greenest.
 */
const AlternateRoutesTable = ({ onSelectRoute }) => {
  const [selectedRouteId, setSelectedRouteId] = useState('safest');
  const [weights, setWeights] = useState({ speed: 40, safety: 40, cost: 20 });

  const routeOptions = [
    {
      id: 'fastest',
      name: 'Option A: Aerial Point-to-Point (Fastest)',
      tag: 'FASTEST',
      tagColor: '#f43f5e',
      Icon: Plane,
      mode: 'Heavy-Lift Cargo UAV (T-40)',
      duration: '55 min',
      durationMinutes: 55,
      risk: 18,
      riskLabel: 'Low (Overflies Blockades)',
      maxSlope: 'N/A (Airborne)',
      slopeColor: '#10b981',
      costPerTonneKm: 18.5,
      carbonKg: 1.2,
      payloadCeiling: '40 kg',
      directive: 'Optimal for emergency blood, anti-venom, and critical medicine delivery.',
      weatherLimit: 'Grounded if wind shear > 45 km/h or dense blizzard'
    },
    {
      id: 'safest',
      name: 'Option B: Escorted Ridge 4WD Convoy (Safest)',
      tag: 'SAFEST',
      tagColor: '#10b981',
      Icon: Shield,
      mode: 'High-Clearance 4WD + BRO Dozer Escort',
      duration: '4h 10m',
      durationMinutes: 250,
      risk: 24,
      riskLabel: 'Low-Moderate (Controlled Pace)',
      maxSlope: '11.4° (Medium Gradient)',
      slopeColor: '#f59e0b',
      costPerTonneKm: 14.0,
      carbonKg: 8.4,
      payloadCeiling: '1,200 kg',
      directive: 'Recommended for personnel evacuation, generator fuel, and heavy triage kits.',
      weatherLimit: 'Speed capped to 25 km/h during rain; escorted single-file'
    },
    {
      id: 'cheapest',
      name: 'Option C: Low-Valley Road Freight (Cheapest)',
      tag: 'CHEAPEST',
      tagColor: '#38bdf8',
      Icon: Truck,
      mode: 'Standard Commercial 3-Axle Truck',
      duration: '5h 45m',
      durationMinutes: 345,
      risk: 54,
      riskLabel: 'Elevated (Vulnerable to Washout)',
      maxSlope: '7.2° (Low Gradient)',
      slopeColor: '#10b981',
      costPerTonneKm: 8.5,
      carbonKg: 14.8,
      payloadCeiling: '8,500 kg',
      directive: 'Lowest economic cost per ton; high risk of multi-hour mudslide delays.',
      weatherLimit: 'Prohibited when soil saturation exceeds 70%'
    },
    {
      id: 'greenest',
      name: 'Option D: Hybrid Rail & Pack-Animal (Greenest)',
      tag: 'GREENEST',
      tagColor: '#a855f7',
      Icon: Train,
      mode: 'Feeder Mountain Rail + Mule Caravan',
      duration: '7h 15m',
      durationMinutes: 435,
      risk: 32,
      riskLabel: 'Moderate (Weather-Insensitive)',
      maxSlope: '14.8° (Footpath Trail)',
      slopeColor: '#f43f5e',
      costPerTonneKm: 6.2,
      carbonKg: 0.6,
      payloadCeiling: '2,400 kg',
      directive: 'Near-zero carbon footprint; reliable non-mechanized backup during fuel supply shocks.',
      weatherLimit: 'Operates in sub-zero snow and dense fog'
    }
  ];

  const handleSelect = (route) => {
    setSelectedRouteId(route.id);
    if (onSelectRoute) onSelectRoute(route);
  };

  const applyPreset = (presetName, newWeights, targetRouteId) => {
    setWeights(newWeights);
    setSelectedRouteId(targetRouteId);
    playSuccessChime();
    if (onSelectRoute) {
      const match = routeOptions.find((r) => r.id === targetRouteId);
      if (match) onSelectRoute(match);
    }
  };

  const active = routeOptions.find((r) => r.id === selectedRouteId) || routeOptions[0];

  return (
    <div className="card-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Multi-Criteria Route Optimization Matrix
            </h3>
            <DataBadge isReal={false} label="Simulated Path Engine" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Dynamic route evaluation across transit speed, slope safety, freight cost, and carbon intensity.
          </p>
        </div>

        {/* Selected Route Badge */}
        <div style={{
          fontSize: '0.75rem',
          padding: '4px 10px',
          borderRadius: '4px',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          fontWeight: 600
        }}>
          Active Dispatch Route: <strong>{active.tag}</strong>
        </div>
      </div>

      {/* Multi-Criteria Optimization Presets Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.6rem 0.85rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <Scale size={14} color="var(--apple-blue)" />
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Objective Priority Weights:
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
            Speed: {weights.speed}% • Safety: {weights.safety}% • Cost: {weights.cost}%
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { label: 'Emergency Air', weights: { speed: 80, safety: 20, cost: 0 }, target: 'fastest' },
            { label: 'Maximum Safety', weights: { speed: 15, safety: 75, cost: 10 }, target: 'safest' },
            { label: 'Lowest Freight Cost', weights: { speed: 15, safety: 15, cost: 70 }, target: 'cheapest' },
            { label: 'Eco Hybrid', weights: { speed: 10, safety: 45, cost: 45 }, target: 'greenest' }
          ].map((p) => (
            <button
              key={p.target}
              type="button"
              onClick={() => applyPreset(p.label, p.weights, p.target)}
              style={{
                fontSize: '0.68rem',
                fontWeight: selectedRouteId === p.target ? 700 : 500,
                padding: '4px 10px',
                borderRadius: '4px',
                background: selectedRouteId === p.target ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: selectedRouteId === p.target ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${selectedRouteId === p.target ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                cursor: 'pointer'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparative Matrix Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="table" style={{ fontSize: '0.75rem', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '32px' }}>Route</th>
              <th>Pathway Profile</th>
              <th>Mode</th>
              <th>ETA</th>
              <th>Hazard Risk</th>
              <th>Max Slope</th>
              <th>Unit Freight</th>
              <th>CO2</th>
              <th>Capacity</th>
              <th>Dispatch</th>
            </tr>
          </thead>
          <tbody>
            {routeOptions.map((r) => {
              const isSelected = selectedRouteId === r.id;
              const OptionIcon = r.Icon;
              return (
                <tr
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: `${r.tagColor}22`,
                      color: r.tagColor,
                      fontSize: '0.65rem',
                      fontWeight: 800
                    }}>
                      {r.tag}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {r.name.split(':')[1]?.trim() || r.name}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.62rem', color: 'var(--accent-emerald)', fontWeight: 800, marginLeft: '4px' }}>
                          [Active]
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <OptionIcon size={14} color="var(--apple-blue)" />
                      <span>{r.mode}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: r.id === 'fastest' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                    {r.duration}
                  </td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: r.risk <= 25 ? 'var(--accent-emerald)' : r.risk <= 45 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                    }}>
                      {r.risk}%
                    </span>
                  </td>
                  <td style={{ color: r.slopeColor, fontWeight: 600 }}>
                    {r.maxSlope}
                  </td>
                  <td style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                    ₹{r.costPerTonneKm}
                  </td>
                  <td>{r.carbonKg} kg</td>
                  <td style={{ fontWeight: 600 }}>{r.payloadCeiling}</td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(r);
                      }}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={11} />}
                      <span>{isSelected ? 'Active' : 'Select'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Option Operational Protocol Directive */}
      <div style={{
        marginTop: '0.85rem',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        background: 'var(--bg-surface-elevated)',
        borderLeft: `4px solid ${active.tagColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.75rem'
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
            Tactical Deployment Directive: {active.name}
          </strong>
          <span style={{ color: 'var(--text-secondary)' }}>
            {active.directive}
          </span>
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--accent-rose)',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(244, 63, 94, 0.1)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          Safety Constraint: {active.weatherLimit}
        </div>
      </div>
    </div>
  );
};

export default AlternateRoutesTable;
