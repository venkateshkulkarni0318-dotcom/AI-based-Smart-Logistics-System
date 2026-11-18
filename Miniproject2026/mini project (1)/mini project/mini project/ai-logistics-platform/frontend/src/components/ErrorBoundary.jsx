import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2.5rem',
          maxWidth: '640px',
          margin: '3rem auto',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--accent-rose)',
          boxShadow: 'var(--shadow-lg)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <AlertTriangle size={36} color="var(--apple-red)" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Component Rendering Error
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            An unexpected error occurred while rendering this view.
          </p>

          {this.state.error && (
            <div style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-rose)',
              marginBottom: '1.25rem',
              overflowX: 'auto',
              maxHeight: '160px'
            }}>
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReset}
              style={{ padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} />
              Reload Dashboard
            </button>
            <a
              href="/"
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Home size={14} />
              Go to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
