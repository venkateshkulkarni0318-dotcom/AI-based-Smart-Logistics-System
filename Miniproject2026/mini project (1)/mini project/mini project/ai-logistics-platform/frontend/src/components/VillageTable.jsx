import React, { useState } from 'react';
import { MapPin, Shield, Calculator, Zap } from 'lucide-react';
import { scoreVillageAccessibility } from '../services/api';

const VillageTable = ({ villages = [], onSelectVillage, selectedVillage }) => {
  const [search, setSearch] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [borderOnly, setBorderOnly] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Dynamic Calculator state
  const [calcInputs, setCalcInputs] = useState({
    seasonalCutoffDays: 60,
    distanceToPavedRoadKm: 12,
    terrainElevationM: 2800,
    slopeGradientDeg: 18,
    hasAllWeatherBridge: false,
    hasMobileTowerConnectivity: true,
    healthSubcenterDistanceKm: 15
  });
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const handleRunCalculator = async (e) => {
    e?.preventDefault();
    setCalculating(true);
    try {
      const res = await scoreVillageAccessibility(calcInputs);
      if (res?.success) setCalcResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const filtered = villages.filter(v => {
    const term = search.toLowerCase();
    const matchesSearch =
      !term ||
      v.name?.toLowerCase().includes(term) ||
      v.district?.toLowerCase().includes(term) ||
      v.terrain?.toLowerCase().includes(term) ||
      v.state?.toLowerCase().includes(term);
    const matchesRisk = selectedRiskFilter === 'ALL' || v.riskStatus?.toUpperCase() === selectedRiskFilter;
    const matchesBorder = !borderOnly || v.borderZone;
    return matchesSearch && matchesRisk && matchesBorder;
  });

  return (
    <div className="card-panel" style={{ padding: '1.25rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--apple-blue)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Settlement Accessibility Registry &amp; SHRUG Linkage
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Scoring isolation risk, seasonal cutoff probability, elevation gradients, and strategic border posts
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Border Filter Toggle */}
          <button
            type="button"
            className={`btn ${borderOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setBorderOnly(!borderOnly)}
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Shield size={13} />
            <span>Border Outposts {borderOnly ? 'Active' : 'All'}</span>
          </button>

          {/* Dynamic Scoring Calculator Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setShowCalculator(!showCalculator);
              if (!calcResult) handleRunCalculator();
            }}
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Calculator size={13} />
            <span>{showCalculator ? 'Hide Calculator' : 'Dynamic Score Calculator'}</span>
          </button>

          {/* Search Box */}
          <input
            type="text"
            className="input-control"
            placeholder="Search settlement, terrain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '180px', padding: '4px 8px', fontSize: '0.75rem' }}
            aria-label="Search settlement by name, terrain, or state"
          />

          {/* Risk Level Filter */}
          <select
            className="input-control"
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            style={{ width: '120px', padding: '4px 8px', fontSize: '0.75rem' }}
            aria-label="Filter settlements by risk level"
          >
            <option value="ALL">All Risk</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High Risk</option>
          </select>
        </div>
      </div>

      {/* Dynamic Calculator Drawer */}
      {showCalculator && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: 'var(--bg-canvas)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} color="var(--apple-blue)" />
              <span>Objective 03: Multi-Parameter Accessibility Scoring Tool</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Adjust parameters to evaluate settlement isolation index
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                Seasonal Cutoff Days: <strong>{calcInputs.seasonalCutoffDays} d/yr</strong>
              </label>
              <input
                type="range"
                min="0"
                max="180"
                value={calcInputs.seasonalCutoffDays}
                onChange={(e) => setCalcInputs({ ...calcInputs, seasonalCutoffDays: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                Unpaved Track Distance: <strong>{calcInputs.distanceToPavedRoadKm} km</strong>
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={calcInputs.distanceToPavedRoadKm}
                onChange={(e) => setCalcInputs({ ...calcInputs, distanceToPavedRoadKm: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                Elevation: <strong>{calcInputs.terrainElevationM} m</strong>
              </label>
              <input
                type="range"
                min="100"
                max="4500"
                step="50"
                value={calcInputs.terrainElevationM}
                onChange={(e) => setCalcInputs({ ...calcInputs, terrainElevationM: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={calcInputs.hasAllWeatherBridge}
                  onChange={(e) => setCalcInputs({ ...calcInputs, hasAllWeatherBridge: e.target.checked })}
                />
                All-Weather Bridge Link
              </label>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={calcInputs.hasMobileTowerConnectivity}
                  onChange={(e) => setCalcInputs({ ...calcInputs, hasMobileTowerConnectivity: e.target.checked })}
                />
                Mobile Telemetry Signal
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRunCalculator}
              disabled={calculating}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              {calculating ? 'Evaluating...' : 'Recalculate Accessibility Index'}
            </button>
            {calcResult && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginLeft: '8px' }}>
                Computed Index: <strong style={{ color: calcResult.accessScore >= 60 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontSize: '0.95rem' }}>{calcResult.accessScore}%</strong> ({calcResult.rating})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="data-table" aria-label="Settlement accessibility and risk registry">
          <thead>
            <tr>
              <th scope="col">Settlement Name</th>
              <th scope="col">Corridor / District</th>
              <th scope="col">Population</th>
              <th scope="col">Terrain Profile</th>
              <th scope="col">Elevation (DEM)</th>
              <th scope="col">Seasonal Cutoff</th>
              <th scope="col">Access Score</th>
              <th scope="col">Risk Classification</th>
              <th scope="col">Recommended Lifeline</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No settlements match your search query or filter.
                </td>
              </tr>
            ) : (
              filtered.map((v) => {
                const isSelected = selectedVillage?.id === v.id;
                return (
                  <tr
                    key={v.id}
                    onClick={() => onSelectVillage && onSelectVillage(v)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'var(--accent-primary-subtle)' : 'transparent'
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</span>
                        {v.borderZone && (
                          <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                            Border
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {v.shrid || v.id}
                      </span>
                    </td>
                    <td>
                      <div>{v.district}, {v.state}</div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{v.corridorName}</span>
                    </td>
                    <td>{v.population?.toLocaleString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.terrain}</td>
                    <td>{v.elevationMeters ? `${v.elevationMeters}m` : '-'}</td>
                    <td>
                      <span style={{ color: v.seasonalCutoffDays > 60 ? 'var(--accent-rose)' : 'var(--text-secondary)', fontWeight: v.seasonalCutoffDays > 60 ? 600 : 400 }}>
                        {v.seasonalCutoffDays} d/yr
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '45px', height: '5px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${v.accessScore}%`,
                              height: '100%',
                              background: v.accessScore >= 70 ? 'var(--accent-emerald)' : v.accessScore >= 40 ? 'var(--accent-amber)' : 'var(--accent-rose)'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 600 }}>{v.accessScore}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${v.riskStatus === 'High' ? 'badge-danger' : v.riskStatus === 'Moderate' ? 'badge-warning' : 'badge-success'}`}>
                        {v.riskStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {v.recommendedMode || 'All-Terrain 4WD'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Showing {filtered.length} of {villages.length} registered settlements</span>
        <span>Linked with Development Data Lab SHRUG v2.2</span>
      </div>
    </div>
  );
};

export default VillageTable;
