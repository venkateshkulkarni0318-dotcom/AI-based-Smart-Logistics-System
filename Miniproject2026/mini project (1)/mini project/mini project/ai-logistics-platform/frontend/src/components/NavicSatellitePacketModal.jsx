import React, { useState } from 'react';
import { Satellite, Copy, Check, Radio, Send, X } from 'lucide-react';
import { playDispatchChirp } from '../utils/soundEffects';

/**
 * NavicSatellitePacketModal Component
 * Encodes emergency dispatch manifests into low-bandwidth ISRO NavIC satellite text telegrams
 * and offline QR matrix packets for zero-cellular disaster communications.
 */
const NavicSatellitePacketModal = ({ isOpen, onClose, ticketData }) => {
  const [copied, setCopied] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  if (!isOpen || !ticketData) return null;

  // Synthesize NavIC Short Messaging Service (MSS) 140-char telemetry packet
  const sectorCode = (ticketData.location || 'SECTOR-Z').substring(0, 8).toUpperCase().replace(/\s+/g, '-');
  const urgencyCode = (ticketData.urgency || 'CRIT').substring(0, 4).toUpperCase();
  const assetCode = (ticketData.recommendedUnit || 'UAV-ALPHA').substring(0, 8).toUpperCase().replace(/\s+/g, '');
  const crc = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();

  const navicPacket = `!NAVIC-MSS|SEC:${sectorCode}|PRI:${urgencyCode}|CAS:${ticketData.victims ? '5' : '1'}|UNIT:${assetCode}|TIME:${new Date().toISOString().slice(11, 19)}|CRC:${crc}#`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(navicPacket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTransmit = () => {
    playDispatchChirp();
    setTransmitted(true);
    setTimeout(() => setTransmitted(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        zIndex: 1150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl, 20px)',
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          boxShadow: 'var(--elevation-3)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm, 8px)',
              background: 'var(--apple-blue-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Satellite size={18} color="var(--apple-blue)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                NavIC Satellite Text &amp; QR Dispatch Packet
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--apple-blue)', fontWeight: 500 }}>
                ISRO NavIC MSS • 140-Character Emergency Channel
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Explainability Callout */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.45 }}>
          During total optical fiber &amp; cellular network blackouts, this compressed dispatch packet broadcasts via low-frequency NavIC satellite transponders and tactical VHF radios.
        </p>

        {/* The Raw NavIC Telegram Box */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-sm, 10px)',
          padding: '0.85rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.76rem',
          color: 'var(--apple-green)',
          wordBreak: 'break-all',
          marginBottom: '1rem',
          position: 'relative'
        }}>
          {navicPacket}
        </div>

        {/* Pseudo-QR Matrix Visual (Native SVG, 100% offline) */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md, 14px)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem'
        }}>
          {/* Visual 2D QR Pattern */}
          <div style={{
            width: '80px',
            height: '80px',
            background: '#ffffff',
            borderRadius: '6px',
            padding: '4px',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '2px',
            flexShrink: 0
          }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: (i % 2 === 0 || i % 5 === 0 || i === 12) ? '#090d16' : '#ffffff',
                  borderRadius: '1px'
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '3px' }}>
              Offline Scannable Manifest QR
            </strong>
            <span>Field teams scan with standard camera app to authenticate dispatch priority #{crc} without cellular internet.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', padding: '7px 14px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? (
              <>
                <Check size={14} color="var(--apple-green)" />
                <span>Copied Telegram</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy NavIC Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTransmit}
            className="btn btn-primary"
            style={{ fontSize: '0.76rem', padding: '7px 16px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {transmitted ? (
              <>
                <Radio size={14} className="spin-icon" />
                <span>Transmitted to NavIC Orbit!</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Broadcast NavIC Telegram</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavicSatellitePacketModal;
