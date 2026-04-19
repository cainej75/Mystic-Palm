import React from 'react';
import { Link } from 'react-router-dom';

const C = {
  bg:    '#080510',
  gold:  '#c9a84c',
  rose:  '#b0405a',
  cream: '#e8d5b8',
  muted: '#6a5870',
};

export default function PalmScanChoice({ isPartner = false, name = "", onScanLive, onUpload, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: '#080510',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      boxSizing: 'border-box',
      minHeight: '100vh',
    }}>

      {/* Hero image with top padding */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 440, flexShrink: 0, paddingTop: 24 }}>
        <img
          src="/palm-scan-choice-hero.webp"
          alt="Palm reading by candlelight"
          width="700"
          height="443"
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', borderRadius: '0 0 4px 4px' }}
        />
        {/* Subtle fade at the bottom edge of the image into page bg */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #080510)',
          pointerEvents: 'none',
        }}/>
      </div>

      {/* Content — sits cleanly below the image */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 440,
        padding: '20px 24px 36px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 24,
      }}>

        {/* Heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(22px, 6vw, 30px)',
            fontWeight: 700,
            color: C.gold,
            margin: '0 0 10px',
            letterSpacing: 1,
            textShadow: '0 0 24px rgba(201,168,76,0.5)',
          }}>
            Madame Zafira must<br />read your palm{name ? `, ${name}` : ''}
          </h1>
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontStyle: 'italic',
            color: 'rgba(232,213,184,0.80)',
            margin: 0, lineHeight: 1.55,
          }}>
            {isPartner
              ? 'To reveal your compatibility, she needs to see both palms.'
              : 'To reveal your fortune, she needs to study the lines of your hand.'}
          </p>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)',
        }}/>

        {/* Options */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Primary: Scan Live */}
          <button
            onClick={onScanLive}
            style={{
              width: '100%', padding: '18px 20px',
              background: 'linear-gradient(135deg, #1a0a2e, #2e1250, #1a0a2e)',
              border: `2px solid ${C.gold}`, borderRadius: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
              textAlign: 'left', transition: 'box-shadow 0.25s',
              boxShadow: '0 4px 24px rgba(201,168,76,0.15)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 32px rgba(201,168,76,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.15)'}
          >
            <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>📷</span>
            <div>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px, 3.5vw, 16px)',
                fontWeight: 700, color: C.gold, letterSpacing: 0.5, marginBottom: 3,
              }}>Scan My Palm Live</div>
              <div style={{
                fontFamily: "'Crimson Text', serif", fontSize: 'clamp(14px, 3.8vw, 17px)',
                color: 'rgba(232,213,184,0.70)', lineHeight: 1.3,
              }}>Use your camera for the full mystical experience</div>
            </div>
          </button>

          {/* Secondary: Upload */}
          <button
            onClick={onUpload}
            style={{
              width: '100%', padding: '18px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1.5px solid rgba(201,168,76,0.35)', borderRadius: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
              textAlign: 'left', transition: 'border-color 0.25s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.65)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'}
          >
            <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>🖼️</span>
            <div>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: 'clamp(13px, 3.5vw, 16px)',
                fontWeight: 700, color: 'rgba(201,168,76,0.85)', letterSpacing: 0.5, marginBottom: 3,
              }}>Upload a Photo Instead</div>
              <div style={{
                fontFamily: "'Crimson Text', serif", fontSize: 'clamp(14px, 3.8vw, 17px)',
                color: 'rgba(232,213,184,0.60)', lineHeight: 1.3,
              }}>Camera not working? Upload a palm photo from your gallery</div>
            </div>
          </button>

        </div>

        {/* Cancel */}
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: 'none',
            fontFamily: "'Cinzel', serif", fontSize: 13,
            color: 'rgba(201,168,76,0.75)', letterSpacing: 1,
            cursor: 'pointer', padding: '6px 12px',
          }}
        >
          ← Go Back
        </button>

        {/* Footer Links */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          marginTop: 'auto', paddingTop: 20, paddingBottom: 16,
          borderTop: '1px solid rgba(201,168,76,0.15)', width: '100%',
        }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            color: 'rgba(201,168,76,0.85)',
            margin: 0, letterSpacing: '2px',
            textShadow: '0 0 12px rgba(201,168,76,0.4)',
          }}>
            🔮 mysticfortunes.ai
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 16,
            flexWrap: 'wrap',
          }}>
            <Link to="/privacy-policy" target="_blank" style={{
              color: '#ffe083',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: 1,
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#b0405a'}
            onMouseLeave={e => e.currentTarget.style.color = '#ffe083'}
            >
              Privacy Policy
            </Link>
            <span style={{ color: '#2e1f40' }}>•</span>
            <Link to="/terms-and-conditions" target="_blank" style={{
              color: '#ffe083',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: 1,
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#b0405a'}
            onMouseLeave={e => e.currentTarget.style.color = '#ffe083'}
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
