import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '400px'
        }}
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          const accentColor = isError
            ? 'var(--apple-red)'
            : isSuccess
            ? 'var(--apple-green)'
            : isWarning
            ? 'var(--apple-amber)'
            : 'var(--apple-blue)';

          const IconComponent = isError
            ? AlertCircle
            : isSuccess
            ? CheckCircle2
            : isWarning
            ? AlertTriangle
            : Info;

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md, 14px)',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                background: 'rgba(18, 24, 38, 0.88)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                boxShadow: 'var(--elevation-2)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderLeft: `4px solid ${accentColor}`,
                transition: 'all var(--timing-fast) var(--ease-spring)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconComponent size={16} color={accentColor} style={{ flexShrink: 0 }} />
                <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  marginLeft: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: 'var(--radius-full)',
                  transition: 'color 0.15s ease'
                }}
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: (msg) => console.log('[Toast Notice]:', msg),
      removeToast: () => {}
    };
  }
  return ctx;
};

export default ToastProvider;
