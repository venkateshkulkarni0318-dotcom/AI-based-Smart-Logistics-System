import React from 'react';
import { FileCheck, AlertTriangle, ShieldCheck, Scale, Cpu, MapPin } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const TermsConditionsPage = () => {
  return (
    <PageLayout
      title="Operational Terms &amp; Conditions of Deployment"
      subtitle="Operational rules of engagement, human-in-the-loop protocols, and tactical airspace compliance."
      badge="Protocol Standard SOP-402"
    >
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Mandate Card */}
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
              <FileCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Operational Deployment Mandate
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--apple-text-tertiary)' }}>
                Authorized Use: Civil Administration, Disaster Response Forces &amp; Logistics Units
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--apple-text-secondary)', lineHeight: 1.6, margin: 0 }}>
            By initializing or operating the AI-LOGIX Command Platform, authorized disaster management personnel, district emergency operating centers, and relief coordinators agree to abide by these Terms and Conditions of Deployment. This software provides computational decision-support tools to accelerate life-saving aid distribution during extreme terrain and weather crises.
          </p>
        </div>

        {/* Operational Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Cpu size={18} color="var(--apple-blue)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Human-in-the-Loop Imperative
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              AI risk predictions, cost break-even analyses, and sortie routing algorithms are advisory recommendations. The designated On-Scene Commander or Incident Commander retains sole legal authority and responsibility for authorizing physical convoy movements or UAV take-offs.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--apple-green)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Airspace &amp; DGCA Adherence
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              All Beyond Visual Line of Sight (BVLOS) autonomous drone sortie simulations assume operation within sanctioned Red/Yellow emergency corridors under Civil Aviation disaster exemptions. Operators must verify local NOTAM restrictions before physical launch.
            </p>
          </div>

          <div className="card-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Scale size={18} color="var(--apple-amber)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--apple-text-primary)' }}>
                Elevation &amp; Hydrography Ceilings
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--apple-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              The platform incorporates SRTM 30m terrain elevations. Operators must respect calculated density altitude limits (4,200m ASL for heavy quadcopters) and water draft thresholds (1.8m minimum for riverine freight barges).
            </p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="card-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              1. Accuracy of Simulated vs. Real-World Terrain Feeds
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              While the system binds authoritative datasets (SHRUG v1.5, SRTM DEM, Open-Meteo), geological conditions such as fresh rockfalls, flash flooding, or seismically altered roadbeds can evolve rapidly. Ground patrol spotters must confirm pass clearances prior to heavy vehicle transit.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              2. Integrity of Emergency SOS NLP Triage Tickets
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              The multilingual SOS triage console processes Hindi, Kannada, and English emergency transmissions. Triage priority rankings (Critical SOS vs. Non-Urgent) must be cross-checked with district emergency radio channels before final dispatch signoff.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--apple-text-primary)', marginBottom: '0.35rem' }}>
              3. Operational Software Warranty &amp; Liability Limitation
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--apple-text-secondary)', lineHeight: 1.55 }}>
              This platform is provided for tactical relief support under standard academic and humanitarian disaster relief licenses. Developers and supporting academic institutions assume no liability for physical mission deviations resulting from unmodelled force-majeure meteorological occurrences.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--apple-text-tertiary)', padding: '0.5rem 0 1.5rem' }}>
          AI-LOGIX Tactical Command &bull; Operating Standard SOP-402 &bull; NDMA Approved Protocols
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsConditionsPage;
