import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Syringe, Droplets, Package, FlaskConical, AlertTriangle, Check } from 'lucide-react';
import { playDispatchChirp } from '../utils/soundEffects';

/**
 * StockpileDepletionWidget Component
 * Calculates vital inventory burn-rates (insulin, blood, dry rations, antivenom)
 * against winter/monsoon cutoff duration for isolated settlements.
 */
const StockpileDepletionWidget = ({ village }) => {
  const navigate = useNavigate();
  const [requestedItem, setRequestedItem] = useState(null);

  if (!village) return null;

  const pop = village.population || 850;
  const cutoffDays = village.seasonalCutoffDays || 60;

  // Inventory burn-rates calibrated to population and isolation window
  const inventory = [
    {
      id: 'insulin',
      name: 'Cold-Chain Insulin & Vaccines',
      Icon: Syringe,
      unit: 'Vials',
      currentStock: Math.round(pop * 0.08),
      burnRatePerDay: (pop * 0.003).toFixed(1),
      daysLeft: Math.max(3, Math.round((pop * 0.08) / (pop * 0.003))),
      recommendedCarrier: 'Cargo UAV'
    },
    {
      id: 'blood',
      name: 'O-Negative Blood Units',
      Icon: Droplets,
      unit: 'Units',
      currentStock: Math.max(4, Math.round(pop * 0.015)),
      burnRatePerDay: (pop * 0.0018).toFixed(1),
      daysLeft: Math.max(2, Math.round((pop * 0.015) / (pop * 0.0018))),
      recommendedCarrier: 'Cargo UAV'
    },
    {
      id: 'rations',
      name: 'Fortified Food Rations & Grain',
      Icon: Package,
      unit: 'kg',
      currentStock: Math.round(pop * 38),
      burnRatePerDay: Math.round(pop * 0.75),
      daysLeft: Math.round((pop * 38) / (pop * 0.75)),
      recommendedCarrier: '6x6 Convoy / Barge'
    },
    {
      id: 'antivenom',
      name: 'Anti-Venom & Trauma Kits',
      Icon: FlaskConical,
      unit: 'Kits',
      currentStock: Math.max(6, Math.round(pop * 0.02)),
      burnRatePerDay: (pop * 0.0012).toFixed(1),
      daysLeft: Math.round((pop * 0.02) / (pop * 0.0012)),
      recommendedCarrier: 'Cargo UAV'
    }
  ];

  const handleRequisition = (item) => {
    playDispatchChirp();
    setRequestedItem(item.id);
    setTimeout(() => {
      navigate('/disaster');
    }, 400);
  };

  return (
    <div style={{
      marginTop: '1rem',
      paddingTop: '0.85rem',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={16} color="var(--apple-blue)" />
          <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)' }}>
            Depot Stockpile &amp; Burn-Rate Depletion Forecast
          </strong>
          <span style={{
            fontSize: '0.65rem',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--accent-primary)',
            fontWeight: 700
          }}>
            ISOLATION: {cutoffDays} DAYS
          </span>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Automated consumption rate based on {pop.toLocaleString()} residents
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.75rem'
      }}>
        {inventory.map((item) => {
          const isDeficit = item.daysLeft < cutoffDays;
          const statusColor =
            item.daysLeft <= 10
              ? 'var(--accent-rose)'
              : item.daysLeft <= 30
              ? 'var(--accent-amber)'
              : 'var(--accent-emerald)';

          const percent = Math.min(100, Math.round((item.daysLeft / cutoffDays) * 100));

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: `1px solid ${isDeficit ? 'rgba(244, 63, 94, 0.4)' : 'var(--border-subtle)'}`,
                borderLeft: `3px solid ${statusColor}`,
                borderRadius: 'var(--radius-md, 14px)',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.Icon && <item.Icon size={14} color="var(--apple-blue)" />}
                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                      {item.name}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: statusColor }}>
                    {item.daysLeft}d left
                  </span>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Stock: {item.currentStock} {item.unit}</span>
                  <span>Burn: {item.burnRatePerDay}/day</span>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: 'var(--bg-canvas)',
                  borderRadius: '2px',
                  marginTop: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: statusColor,
                    borderRadius: '2px'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                <span style={{
                  fontSize: '0.65rem',
                  color: isDeficit ? 'var(--accent-rose)' : 'var(--text-muted)',
                  fontWeight: isDeficit ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isDeficit ? <AlertTriangle size={11} color="var(--accent-rose)" /> : <Check size={11} color="var(--apple-green)" />}
                  <span>{isDeficit ? `Cutoff Deficit (${cutoffDays - item.daysLeft}d)` : 'Stock Adequate'}</span>
                </span>

                {isDeficit && (
                  <button
                    type="button"
                    onClick={() => handleRequisition(item)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--accent-rose)',
                      color: 'var(--accent-rose)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title={`Requisition urgent ${item.recommendedCarrier} resupply`}
                  >
                    {requestedItem === item.id ? 'Queued' : `+ ${item.recommendedCarrier}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockpileDepletionWidget;
