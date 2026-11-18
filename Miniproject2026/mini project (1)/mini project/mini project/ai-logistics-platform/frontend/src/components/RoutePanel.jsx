import React, { useState } from 'react';
import { Compass, Sparkles, RefreshCw, CheckCircle2, Navigation } from 'lucide-react';

const RoutePanel = ({ routes = [], onOptimize, optimizationSummary }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimizeClick = async () => {
    setIsOptimizing(true);
    try {
      if (onOptimize) await onOptimize();
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg, 16px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm, 8px)',
            background: 'var(--apple-blue-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={18} color="var(--apple-blue)" />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Active Route Matrix
          </h3>
        </div>
        <button
          type="button"
          onClick={handleOptimizeClick}
          disabled={isOptimizing}
          className="btn btn-primary"
          style={{
            padding: '6px 14px',
            fontSize: '0.78rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isOptimizing ? (
            <>
              <RefreshCw size={13} className="spin-icon" />
              <span>Optimizing Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>Optimize All Routes</span>
            </>
          )}
        </button>
      </div>

      {/* Optimization Summary Alert */}
      {optimizationSummary && (
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md, 14px)',
          background: 'var(--apple-green-subtle)',
          border: '1px solid rgba(48, 209, 88, 0.25)',
          marginBottom: '1rem',
          fontSize: '0.76rem',
          color: 'var(--text-primary)'
        }}>
          <div style={{ fontWeight: 600, color: 'var(--apple-green)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} />
            <span>Multi-Modal AI Path Optimization Applied</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
            <span>Est. Duration: <strong style={{ color: 'var(--text-primary)' }}>{optimizationSummary.estimatedDuration}</strong></span>
            <span>Road Distance: <strong style={{ color: 'var(--text-primary)' }}>{optimizationSummary.roadDistanceKm} km</strong></span>
            <span>Fuel Cost: <strong style={{ color: 'var(--text-primary)' }}>₹{optimizationSummary.estimatedFuelCostInr}</strong></span>
            <span>Carbon: <strong style={{ color: 'var(--text-primary)' }}>{optimizationSummary.totalCarbonKg} kg</strong></span>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {routes.map((route) => {
          const isTransit = route.status === 'In Transit';
          return (
            <div
              key={route.id}
              style={{
                background: 'var(--bg-card)',
                padding: '0.9rem 1.1rem',
                borderRadius: 'var(--radius-md, 14px)',
                border: `1px solid ${isTransit ? 'var(--apple-blue-border)' : 'var(--border-subtle)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                transition: 'all var(--timing-fast) var(--ease-spring)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isTransit ? 'var(--apple-blue)' : 'var(--apple-amber)',
                    boxShadow: isTransit ? '0 0 8px var(--apple-blue)' : 'none'
                  }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{route.name}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{route.totalStops} Waypoints</span>
                  <span>•</span>
                  <span>ETA: <strong style={{ color: 'var(--text-primary)' }}>{route.estimatedDuration}</strong></span>
                  <span>•</span>
                  <span>Mode: <strong style={{ color: 'var(--text-primary)' }}>{route.mode || '4WD Road'}</strong></span>
                </div>
              </div>

              <span className={`badge ${isTransit ? 'badge-info' : 'badge-warning'}`}>
                {route.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoutePanel;
