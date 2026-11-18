import React from 'react';
import { Shield, Lock, Database, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const PrivacyPolicyPage = () => {
  return (
    <PageLayout
      title="Institutional Privacy Policy & Data Governance"
      subtitle="Operational telemetry protocols, spatial privacy safeguards, and National Disaster Management standards."
      badge="Compliance Standard NDMA-2026"
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Governance Overview Card */}
        <div className="card-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--apple-radius-sm)',
              background: 'var(--apple-blue-subtle)',
              color: 'var(--apple-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Operational Scope &amp; Legal Framework
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--apple-text-tertiary)' }}>
                Effective Date: October 2026 | Governing Directive: Disaster Management Act, 2005
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--apple-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            The AI-LOGIX Command Platform is engineered exclusively for disaster logistics, emergency relief orchestration, and rural connectivity monitoring across national corridors. The system operates under strict institutional data minimization principles in accordance with National Disaster Management Authority (NDMA) standards and Ministry of Rural Development guidelines.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <EyeOff size={18} color="var(--apple-green)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Zero Personal Data Harvesting
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              The platform processes only settlement-level geospatial identifiers (SHRUG SHRID keys) and aggregated census totals. Individual citizen identities, personal communications, and biometric records are neither collected, tracked, nor stored in any capacity.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Database size={18} color="var(--apple-blue)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Air-Gapped Offline Sovereignty
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Tactical telemetry operates locally via SQLite database caches and pre-loaded SRTM 30m DEM elevation rasters. In zero-connectivity crisis states, operational telemetry does not exit the local command perimeter.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Lock size={18} color="var(--apple-amber)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Cryptographic Telemetry Protection
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Disaster SOS triage logs and autonomous flight waypoint vectors are cryptographically hashed and restricted to designated field commanders, NDRF battalion leads, and district magistrates.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="card-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              1. Datasets Ingested &amp; Retention Schedules
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              The system ingests open-source elevation contours (NASA SRTM 30m), public weather projections (Open-Meteo), and administrative village geography (Socio-Economic High-Resolution Rural-Urban Geographic Platform - SHRUG). Weather cache entries are automatically purged after 72 operational hours.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              2. Algorithmic Transparency &amp; Explainability
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              All route hazard scores and vehicle mode decisions are computed using deterministic mathematical weights and TreeSHAP feature attributions. Field personnel can inspect the exact mathematical contributions of rainfall, slope gradient, and soil saturation for every route advisory.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              3. Officer Inquiries &amp; Information Security Officer
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              For institutional data governance audits, air-gapped deployment certificates, or vulnerability disclosures, contact the Command Technical Directorate at <code style={{ color: 'var(--apple-blue)', background: 'var(--apple-blue-subtle)', padding: '2px 6px', borderRadius: '4px' }}>compliance@command.ailogix.org</code>.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', padding: '0.5rem 0 1.5rem' }}>
          AI-LOGIX Tactical Command &bull; Version 2.5 &bull; Standard Operating Procedures Validated
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;
