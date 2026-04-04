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
// Shown when camera fails or times out inside a social media in-app browser
// ═══════════════════════════════════════════════════════════════════════════

export const CameraBlockedPage = () => {
  const browserInfo = detectInAppBrowser();

  const platform = browserInfo.isInstagram
    ? 'Instagram'
    : browserInfo.isTikTok
    ? 'TikTok'
    : browserInfo.isFacebook
    ? 'Facebook'
    : 'this browser';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(160deg, #080310 0%, #1a0a2e 55%, #0f0518 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5vh 24px 4vh',
      zIndex: 9999,
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: "'Cinzel', serif",
      // Fix for in-app browser height
      height: '100%',
      minHeight: '-webkit-fill-available',
    }}>

      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-30%', left: '-30%',
        width: '70%', height: '70%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-20%',
        width: '60%', height: '60%',
        background: 'radial-gradient(circle, rgba(120,60,180,0.1), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* ── Main content ── */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3vh',
        position: 'relative',
        zIndex: 10,
        flex: 1,
        justifyContent: 'center',
      }}>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(22px, 6vw, 30px)',
          fontWeight: 700,
          color: '#c9a84c',
          margin: 0,
          lineHeight: 1.3,
          letterSpacing: '0.5px',
          textAlign: 'center',
          textShadow: '0 0 24px rgba(201,168,76,0.4)',
        }}>
          Your future is<br />already written…
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 'clamp(15px, 4vw, 18px)',
          fontStyle: 'italic',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.5,
          textAlign: 'center',
          opacity: 0.85,
        }}>
          But Madame Zafira can't reveal it inside this browser.
        </p>

        {/* Warning */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(10px, 3vw, 13px)',
          color: '#ffb347',
          margin: 0,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          ⚠️ {platform} is blocking your camera
        </p>

        {/* Instructions box */}
        <div style={{
          background: 'rgba(201,168,76,0.1)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '14px',
          padding: 'clamp(16px, 4vw, 24px) clamp(18px, 5vw, 28px)',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <p style={{
            margin: '0 0 10px 0',
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(11px, 3vw, 14px)',
            fontWeight: 700,
            color: '#c9a84c',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}>
            How to open in your browser:
          </p>
          <p style={{
            margin: 0,
            fontFamily: "'Crimson Text', serif",
            fontSize: 'clamp(16px, 4.5vw, 20px)',
            color: '#d4c5a9',
            lineHeight: 1.8,
            textAlign: 'center',
          }}>
            Tap the three dots <strong style={{ color: '#ffe08a' }}>(⋮)</strong> in the top right<br />
            Then tap <strong style={{ color: '#ffe08a' }}>"Open in browser"</strong>
          </p>
        </div>

        {/* Bright purple CTA */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(12px, 3.5vw, 15px)',
          color: '#c084fc',
          margin: 0,
          letterSpacing: '0.5px',
          textAlign: 'center',
          fontWeight: 600,
          textShadow: '0 0 16px rgba(192,132,252,0.6)',
        }}>
          Takes 5 seconds. Unlocks your full reading.
        </p>

      </div>

      {/* ── Branding at bottom ── */}
      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(11px, 3vw, 13px)',
        color: 'rgba(201,168,76,0.55)',
        margin: 0,
        letterSpacing: '1.5px',
        position: 'relative',
        zIndex: 10,
      }}>
        🔮 mysticfortunes.ai
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GATE — passes everyone straight through to the home page
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
