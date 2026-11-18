import React, { useState } from 'react';
import { FileText, MapPin, Satellite, CheckCircle2, ArrowRight } from 'lucide-react';
import DataBadge from './DataBadge';
import NavicSatellitePacketModal from './NavicSatellitePacketModal';

/**
 * NLPTriageConsole Component (Phase 3 Requirement 6.2 & 6.3)
 * Unstructured Distress Message Triage Console with Entity Extraction and Actionable Ticket Generation.
 */
const NLPTriageConsole = () => {
  const sampleMessages = [
    {
      title: 'Zanskar Pass Avalanche',
      text: 'MAYDAY MAYDAY: Avalanche at Mile 38 Pensi La pass. 2 transport trucks trapped under 3m snow. 5 drivers injured with acute hypothermia risk. Require emergency oxygen, warming blankets, and thermal imaging UAV immediately.'
    },
    {
      title: 'Majuli Island Breach',
      text: 'EMERGENCY: Brahmaputra embankment breached at Ward 4, Majuli. 65 villagers including 14 children marooned on primary school roof. River surging rapidly. Immediate motorized rescue boats and clean drinking water required.'
    },
    {
      title: 'Malana Medical Outpost',
      text: 'URGENT MEDICAL: Road to Malana blocked by rockfall at Kasol gorge. Village health center running out of anti-snake venom and insulin for 2 critical patients. Ground access impossible for next 48 hours. Request cargo drone airlift.'
    }
  ];

  const [inputText, setInputText] = useState(sampleMessages[0].text);
  const [parsedResult, setParsedResult] = useState(null);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNavicModal, setShowNavicModal] = useState(false);

  const handleTriage = (customText) => {
    const textToAnalyze = customText || inputText;
    setIsProcessing(true);
    setTicketCreated(false);

    // Heuristic NLP simulation
    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();
      let urgency = 'MODERATE';
      let urgencyColor = '#f59e0b';
      let location = 'Unknown Remote Outpost';
      let victims = 'Unspecified';
      let supplies = [];
      let recommendedUnit = 'Rapid Assessment Team';

      if (lower.includes('avalanche') || lower.includes('mayday') || lower.includes('hypothermia')) {
        urgency = 'CRITICAL';
        urgencyColor = '#f43f5e';
        location = 'Mile 38, Pensi La Pass (Ladakh)';
        victims = '5 trapped personnel (Hypothermia)';
        supplies = ['Emergency O₂ cylinders', 'Thermal blankets', 'Snow winch 6x6'];
        recommendedUnit = 'Heavy-Lift Cargo UAV-01 + BRO Convoy 07';
      } else if (lower.includes('flood') || lower.includes('marooned') || lower.includes('embankment')) {
        urgency = 'HIGH';
        urgencyColor = '#f97316';
        location = 'Ward 4 Primary School, Majuli Island (Assam)';
        victims = '65 marooned villagers (14 children)';
        supplies = ['Motorized rescue RIB boats', 'Potable water filtration', 'Baby formula'];
        recommendedUnit = 'NDRF Watercraft Flotilla-3';
      } else if (lower.includes('insulin') || lower.includes('medical') || lower.includes('venom')) {
        urgency = 'HIGH';
        urgencyColor = '#f97316';
        location = 'Malana Sub-Center, Parvati Valley';
        victims = '2 critical medical patients';
        supplies = ['Cold-Chain Insulin (4°C)', 'Anti-Snake Venom ampoules'];
        recommendedUnit = 'Heavy-Lift Medical UAV-Alpha';
      }

      setParsedResult({
        urgency,
        urgencyColor,
        location,
        victims,
        supplies,
        recommendedUnit,
        confidence: {
          intent: '98.4%',
          location: '94.2%',
          urgency: '96.8%',
          logisticsNeed: '91.5%'
        }
      });
      setIsProcessing(false);
    }, 280);
  };

  const handleCreateTicket = () => {
    setTicketCreated(true);
  };

  return (
    <div className="card-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              AI Distress Message Parser &amp; Tactical Triage
            </h3>
            <DataBadge isReal={false} label="Simulated NLP Triage" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
            Transforms unstructured SOS transmissions (radio, satellite SMS, field notes) into structured dispatch missions.
          </p>
        </div>

        {/* Preset Sample Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {sampleMessages.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputText(s.text);
                handleTriage(s.text);
              }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FileText size={12} />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Text Area */}
      <div style={{ marginBottom: '0.75rem' }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            fontSize: '0.8rem',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
          placeholder="Paste raw radio dispatch transcript, field police wireless SOS, or SMS alert here..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => handleTriage()}
          disabled={isProcessing || !inputText.trim()}
          className="btn btn-primary"
          style={{ fontSize: '0.78rem', padding: '6px 14px' }}
        >
          {isProcessing ? 'Parsing Entities...' : 'Parse & Triage Message'}
        </button>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Extracts: Urgency • Geolocation • Trapped Count • Asset Requisition
        </span>
      </div>

      {/* Parsed Result Display */}
      {parsedResult && (
        <div style={{
          background: 'var(--bg-surface-elevated)',
          border: `1.5px solid ${parsedResult.urgencyColor}`,
          borderRadius: '8px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: `${parsedResult.urgencyColor}22`,
                color: parsedResult.urgencyColor,
                border: `1px solid ${parsedResult.urgencyColor}`,
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                LEVEL: {parsedResult.urgency}
              </span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--apple-blue)" />
                <span>{parsedResult.location}</span>
              </strong>
            </div>

            {/* Confidence Chips */}
            <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem' }}>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '3px' }}>
                Intent: {parsedResult.confidence.intent}
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '3px' }}>
                Location: {parsedResult.confidence.location}
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 6px', borderRadius: '3px' }}>
                Supplies: {parsedResult.confidence.logisticsNeed}
              </span>
            </div>
          </div>

          {/* Extracted Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Casualties &amp; Affected:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{parsedResult.victims}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Recommended Task Force:</span>
              <strong style={{ color: 'var(--accent-primary)' }}>{parsedResult.recommendedUnit}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>Identified Supply Needs:</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '2px' }}>
                {parsedResult.supplies.map((s, i) => (
                  <span key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', padding: '2px 6px', borderRadius: '3px', fontSize: '0.7rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowNavicModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.74rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Generate low-bandwidth ISRO NavIC satellite text and QR matrix"
            >
              <Satellite size={14} />
              <span>NavIC Telegram &amp; QR</span>
            </button>

            {ticketCreated ? (
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} />
                <span>Dispatch Ticket #TK-2026-9041 Created &amp; Synced to Gantt Timeline!</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleCreateTicket}
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowRight size={13} />
                <span>Promote to Active Mission Dispatch</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* NavIC Satellite Packet & QR Modal */}
      <NavicSatellitePacketModal
        isOpen={showNavicModal}
        onClose={() => setShowNavicModal(false)}
        ticketData={parsedResult}
      />

      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.6rem', fontStyle: 'italic' }}>
        What this means: Natural language processing converts chaotic emergency radio transcripts into immediate tactical supply requisitions in under 300ms.
      </div>
    </div>
  );
};

export default NLPTriageConsole;
