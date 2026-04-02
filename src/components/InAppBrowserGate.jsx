import React, { useState, useEffect } from 'react';
import { trackInAppBrowserDetected } from './inappBrowserUtils';

// ═══════════════════════════════════════════════════════════════════════════
// DETECTION LOGIC
// ═══════════════════════════════════════════════════════════════════════════

const detectInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  
  // Instagram in-app browser
  const isInstagram = /Instagram/i.test(ua);
  
  // TikTok in-app browser
  const isTikTok = /TikTok/i.test(ua) || /Musical ly/i.test(ua);
  
  // Facebook in-app browser
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
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const InAppBrowserLandingPage = ({ browserInfo }) => {
  const [copied, setCopied] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setShowCopyFeedback(true);
      setTimeout(() => {
        setCopied(false);
        setShowCopyFeedback(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(176,64,90,0.1), transparent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Content container */}
      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          animation: 'fadeInScale 0.8s ease-out',
        }}
      >
        {/* Crystal ball icon */}
        <div
          style={{
            fontSize: '64px',
            marginTop: '40px',
            marginBottom: '24px',
            filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.6))',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          🔮
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#c9a84c',
            margin: '0 0 12px 0',
            letterSpacing: '1px',
            textShadow: '0 0 20px rgba(201,168,76,0.4)',
          }}
        >
          The Spirits Cannot Reach You Here...
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#e8d5b8',
            margin: '0 0 28px 0',
            lineHeight: '1.6',
            opacity: 0.9,
          }}
        >
          You've stepped into a blocked realm. Your reading is ready… but this place hides the truth.
        </p>

        {/* Warning text */}
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '11px',
            color: '#ffb347',
            margin: '0 0 16px 0',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          ⚠️ Works best in your browser for full reading
        </p>

        {/* Instructions */}
        <div
          style={{
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#d4c5a9',
            lineHeight: '1.7',
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>How to open in your browser:</p>
          <p style={{ margin: 0 }}>
            Tap the three dots <strong>(⋮)</strong> in the top right<br />
            Then tap <strong>"Open in browser"</strong>
          </p>
        </div>

        {/* Secondary button */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'transparent',
            border: `2px solid ${copied ? '#1a6b4a' : '#c9a84c'}`,
            borderRadius: '10px',
            color: copied ? '#1a6b4a' : '#c9a84c',
            fontFamily: "'Cinzel', serif",
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.target.style.background = 'rgba(201,168,76,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.target.style.background = 'transparent';
            }
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Link Instead'}
        </button>

        {/* Footer text */}
        <p
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '12px',
            fontStyle: 'italic',
            color: '#a080b0',
            margin: '24px 0 0 0',
            lineHeight: '1.5',
          }}
        >
          Your future is already written. Don't let this realm keep it from you.
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(201,168,76,0.6));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 30px rgba(201,168,76,0.8));
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(30px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(201,168,76,0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(201,168,76,0.6);
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GATE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const InAppBrowserGate = ({ children }) => {
  const [browserInfo, setBrowserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const info = detectInAppBrowser();
    setBrowserInfo(info);
    setIsLoading(false);

    // Track in-app browser detection with Google Analytics
    if (info.isInAppBrowser) {
      trackInAppBrowserDetected(info);
    }

    // Prevent scrolling if in-app browser
    if (info.isInAppBrowser) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, []);

  if (isLoading) {
    return null;
  }

  if (browserInfo?.isInAppBrowser) {
    return <InAppBrowserLandingPage browserInfo={browserInfo} />;
  }

  return children;
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { detectInAppBrowser, InAppBrowserLandingPage };

export default InAppBrowserGate;
