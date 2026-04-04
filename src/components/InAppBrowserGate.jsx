import React, { useEffect } from 'react';
import { trackInAppBrowserDetected } from '../utils/inappBrowserUtils';

// ═══════════════════════════════════════════════════════════════════════════
// DETECTION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

const detectInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  const isInstagram = /Instagram/i.test(ua);
  const isTikTok = /TikTok/i.test(ua) || /Musical ly/i.test(ua);
  const isFacebook = /FBAN|FBAV/i.test(ua);
  return {
    isInAppBrowser: isInstagram || isTikTok || isFacebook,
    isInstagram,
    isTikTok,
    isFacebook,
    userAgent: ua,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// CAMERA BLOCKED PAGE
// Import and render this from FullscreenCamera when camera access fails.
// See App.jsx instructions below.
// ═══════════════════════════════════════════════════════════════════════════

export const CameraBlockedPage = () => {
  const browserInfo = detectInAppBrowser();

  const platform = browserInfo.isInstagram
    ? 'Instagram'
    : browserInfo.isTikTok
    ? 'TikTok'
    : browserInfo.isFacebook
    ? 'Facebook'
    : null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0a0410 0%, #1a0a2e 50%, #0f0518 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px 20px',
      zIndex: 9999,
      overflowY: 'auto',
      fontFamily: "'Cinzel', 'Crimson Text', serif",
      boxSizing: 'border-box',
    }}>

      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-200px', left: '-200px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', right: '-150px',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(176,64,90,0.1), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      <div style={{
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        animation: 'fadeInScale 0.8s ease-out',
      }}>

        {/* Crystal ball */}
        <div style={{
          fontSize: '64px',
          marginBottom: '22px',
          filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.6))',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          🔮
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '26px',
          fontWeight: 700,
          color: '#c9a84c',
          margin: '0 0 14px 0',
          lineHeight: 1.35,
          letterSpacing: '0.5px',
          textShadow: '0 0 20px rgba(201,168,76,0.4)',
        }}>
          Your future is already written,<br />but you can't see it here
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#e8d5b8',
          margin: '0 0 20px 0',
          lineHeight: '1.6',
          opacity: 0.9,
        }}>
          You've stepped into a blocked realm. Your reading is ready… but this place hides the truth.
        </p>

        {/* Warning */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          color: '#ffb347',
          margin: '0 0 18px 0',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          ⚠️ {platform ? `Camera blocked by ${platform}` : 'Works best in your browser for full reading'}
        </p>

        {/* Instructions box — larger */}
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '14px',
          padding: '24px 22px',
          marginBottom: '24px',
          color: '#d4c5a9',
          lineHeight: '1.8',
        }}>
          <p style={{
            margin: '0 0 12px 0',
            fontFamily: "'Cinzel', serif",
            fontSize: '13px',
            fontWeight: 700,
            color: '#c9a84c',
            letterSpacing: '0.5px',
          }}>
            How to open in your browser:
          </p>
          <p style={{
            margin: 0,
            fontFamily: "'Crimson Text', serif",
            fontSize: '17px',
            lineHeight: '1.9',
          }}>
            Tap the three dots <strong style={{ color: '#ffe08a' }}>(⋮)</strong> in the top right<br />
            Then tap <strong style={{ color: '#ffe08a' }}>"Open in browser"</strong>
          </p>
        </div>

        {/* Bright destiny message */}
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '16px',
          fontStyle: 'italic',
          color: '#e8c96a',
          margin: '0 0 20px 0',
          lineHeight: '1.5',
          textShadow: '0 0 12px rgba(232,201,106,0.4)',
        }}>
          Takes 5 seconds and your destiny will be revealed
        </p>

        {/* Branding */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '13px',
          color: 'rgba(201,168,76,0.6)',
          margin: 0,
          letterSpacing: '1.5px',
        }}>
          🔮 mysticfortunes.ai
        </p>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 20px rgba(201,168,76,0.6)); }
          50%       { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(201,168,76,0.8)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GATE — passes everyone straight through to the home page
// Analytics tracking still fires so Google Analytics records in-app visits
// ═══════════════════════════════════════════════════════════════════════════

export const InAppBrowserGate = ({ children }) => {
  useEffect(() => {
    const info = detectInAppBrowser();
    if (info.isInAppBrowser) {
      trackInAppBrowserDetected(info);
    }
  }, []);

  return children;
};

export { detectInAppBrowser };
export default InAppBrowserGate;
