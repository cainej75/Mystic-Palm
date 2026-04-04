import React, { useState, useEffect } from 'react';
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
// BRIEF CHECKING SCREEN (shown while we test camera access)
// ═══════════════════════════════════════════════════════════════════════════

const CheckingScreen = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #0a0410 0%, #1a0a2e 50%, #0f0518 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  }}>
    <div style={{ fontSize: 48, marginBottom: 24, animation: 'pulse 1.5s ease-in-out infinite' }}>🔮</div>
    <p style={{
      fontFamily: "'Cinzel', serif",
      fontSize: 13,
      color: 'rgba(201,168,76,0.7)',
      letterSpacing: 2,
      textTransform: 'uppercase',
      margin: 0,
    }}>
      Opening the portal…
    </p>
    <style>{`
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.08); opacity: 1; }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// GATE PAGE (shown only when camera is confirmed blocked)
// ═══════════════════════════════════════════════════════════════════════════

const InAppBrowserLandingPage = ({ browserInfo, onTryAnyway }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Detect which platform for tailored instructions
  const platform = browserInfo?.isInstagram
    ? 'Instagram'
    : browserInfo?.isTikTok
    ? 'TikTok'
    : 'Facebook';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0a0410 0%, #1a0a2e 50%, #0f0518 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
        overflow: 'hidden',
        fontFamily: "'Cinzel', 'Crimson Text', serif",
      }}
    >
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

      {/* Content */}
      <div style={{
        maxWidth: '420px', width: '100%', textAlign: 'center',
        position: 'relative', zIndex: 10,
        animation: 'fadeInScale 0.8s ease-out',
      }}>
        <div style={{
          fontSize: '60px', marginTop: '20px', marginBottom: '20px',
          filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.6))',
          animation: 'pulse 2s ease-in-out infinite',
        }}>🔮</div>

        <h1 style={{
          fontFamily: "'Cinzel', serif", fontSize: '26px', fontWeight: 700,
          color: '#c9a84c', margin: '0 0 10px 0', letterSpacing: '1px',
          textShadow: '0 0 20px rgba(201,168,76,0.4)',
        }}>
          The Spirits Cannot Reach You Here…
        </h1>

        <p style={{
          fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic',
          color: '#e8d5b8', margin: '0 0 20px 0', lineHeight: '1.6', opacity: 0.9,
        }}>
          {platform} blocks camera access. Open in your browser for your full reading.
        </p>

        <p style={{
          fontFamily: "'Cinzel', serif", fontSize: '11px', color: '#ffb347',
          margin: '0 0 14px 0', letterSpacing: '1px',
          textTransform: 'uppercase', fontWeight: 600,
        }}>
          ⚠️ Camera blocked by {platform}
        </p>

        {/* Instructions */}
        <div style={{
          background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '10px', padding: '14px 16px', marginBottom: '16px',
          fontSize: '13px', color: '#d4c5a9', lineHeight: '1.7',
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>How to open in your browser:</p>
          <p style={{ margin: 0 }}>
            Tap the three dots <strong>(⋮)</strong> in the top right<br />
            Then tap <strong>"Open in browser"</strong>
          </p>
        </div>

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%', padding: '13px 24px', marginBottom: '12px',
            background: 'transparent',
            border: `2px solid ${copied ? '#1a6b4a' : '#c9a84c'}`,
            borderRadius: '10px',
            color: copied ? '#1a6b4a' : '#c9a84c',
            fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 600,
            letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
            textTransform: 'uppercase',
          }}
        >
          {copied ? '✓ Link Copied!' : '📋 Copy Link Instead'}
        </button>

        {/* Try anyway button */}
        <button
          onClick={onTryAnyway}
          style={{
            width: '100%', padding: '11px 24px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: "'Cinzel', serif", fontSize: '11px',
            letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >
          Try Anyway
        </button>

        <p style={{
          fontFamily: "'IM Fell English', serif", fontSize: '12px', fontStyle: 'italic',
          color: '#a080b0', margin: '20px 0 0 0', lineHeight: '1.5',
        }}>
          Your future is already written. Don't let this realm keep it from you.
        </p>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(201,168,76,0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(201,168,76,0.8)); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GATE COMPONENT
// Strategy: Test camera first. Only show gate if camera is genuinely blocked.
// This lets Android/some iOS in-app browsers through if camera actually works.
// ═══════════════════════════════════════════════════════════════════════════

export const InAppBrowserGate = ({ children }) => {
  // 'checking' | 'allowed' | 'blocked'
  const [status, setStatus] = useState('checking');
  const [browserInfo, setBrowserInfo] = useState(null);
  const [tryAnyway, setTryAnyway] = useState(false);

  useEffect(() => {
    const info = detectInAppBrowser();
    setBrowserInfo(info);

    // Not an in-app browser — let straight through, no delay
    if (!info.isInAppBrowser) {
      setStatus('allowed');
      return;
    }

    // In-app browser detected
    trackInAppBrowserDetected(info);
    document.body.style.overflow = 'hidden';

    // Test whether camera is actually accessible
    const testCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('blocked');
        return;
      }
      try {
        // Quick test with minimal constraints
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Camera works! Stop the test stream immediately
        stream.getTracks().forEach(t => t.stop());
        document.body.style.overflow = '';
        setStatus('allowed');
      } catch (err) {
        // Camera blocked or not available
        setStatus('blocked');
      }
    };

    // Fallback: if camera test hangs for 6s, assume blocked
    const timeout = setTimeout(() => {
      setStatus('blocked');
    }, 6000);

    testCamera().finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, []);

  // Restore scroll when user taps Try Anyway
  const handleTryAnyway = () => {
    document.body.style.overflow = '';
    setTryAnyway(true);
  };

  if (status === 'checking') {
    return <CheckingScreen />;
  }

  if (status === 'blocked' && !tryAnyway) {
    return (
      <InAppBrowserLandingPage
        browserInfo={browserInfo}
        onTryAnyway={handleTryAnyway}
      />
    );
  }

  return children;
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { detectInAppBrowser, InAppBrowserLandingPage };

export default InAppBrowserGate;
