import React, { useState, useEffect } from 'react';

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
// LANDING PAGE COMPONENT - UPDATED VERSION
// ═══════════════════════════════════════════════════════════════════════════

const InAppBrowserLandingPage = ({ browserInfo }) => {
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

  const appName = browserInfo?.isInstagram 
    ? 'Instagram' 
    : browserInfo?.isTikTok 
    ? 'TikTok' 
    : browserInfo?.isFacebook 
    ? 'Facebook' 
    : 'this app';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0a0410 0%, #1a0a2e 50%, #0f0518 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '32px 20px 20px 20px',
        zIndex: 9999,
        overflow: 'auto',
        fontFamily: "'Cinzel', 'Crimson Text', serif",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-250px',
          left: '-150px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          right: '-100px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(176,64,90,0.08), transparent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      {/* Main content container */}
      <div
        style={{
          maxWidth: '380px',
          width: '100%',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          animation: 'fadeInDown 0.9s ease-out',
        }}
      >
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '26px',
              fontWeight: 700,
              color: '#c9a84c',
              margin: '0 0 8px 0',
              letterSpacing: '0.5px',
              lineHeight: '1.2',
              textShadow: '0 0 20px rgba(201,168,76,0.3)',
            }}
          >
            Your future is already written...
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: '15px',
              fontStyle: 'italic',
              color: '#e8d5b8',
              margin: '0 0 16px 0',
              lineHeight: '1.5',
              opacity: 0.95,
              fontWeight: 400,
            }}
          >
            But you can't fully reveal it inside this browser.
          </p>

          {/* Warning line */}
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              color: '#ffb347',
              margin: '0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            ⚠️ {appName} limits this experience
          </p>
        </div>

        {/* MAIN INSTRUCTION CARD - PRIMARY FOCUS */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(176,64,90,0.05))',
            border: '2px solid rgba(201,168,76,0.4)',
            borderRadius: '16px',
            padding: '28px 24px',
            marginBottom: '28px',
            boxShadow: '0 8px 32px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            animation: 'fadeInScale 0.8s ease-out 0.1s both',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Card title */}
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#e8d5b8',
              margin: '0 0 20px 0',
              letterSpacing: '1px',
              textAlign: 'center',
            }}
          >
            Open in your browser to continue
          </h2>

          {/* Steps - Very clear and large */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Step 1 */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#c9a84c',
                  minWidth: '24px',
                }}
              >
                1.
              </span>
              <span
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '15px',
                  color: '#d4c5a9',
                  lineHeight: '1.4',
                  paddingTop: '2px',
                }}
              >
                Tap the menu <strong>(⋮)</strong> in the top right
              </span>
            </div>

            {/* Step 2 */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#c9a84c',
                  minWidth: '24px',
                }}
              >
                2.
              </span>
              <span
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '15px',
                  color: '#d4c5a9',
                  lineHeight: '1.4',
                  paddingTop: '2px',
                }}
              >
                Tap <strong>"Open in browser"</strong>
              </span>
            </div>
          </div>
        </div>

        {/* COPY LINK BUTTON */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%',
            padding: '16px 24px',
            marginBottom: '20px',
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
            background: copied ? 'rgba(26, 107, 74, 0.1)' : 'rgba(201,168,76,0.05)',
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.target.style.background = 'rgba(201,168,76,0.15)';
              e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.target.style.background = 'rgba(201,168,76,0.05)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {copied ? '✓ Link Copied' : '📋 Copy Link Instead'}
        </button>

        {/* FOOTER TEXT - BRIGHTER PURPLE */}
        <p
          style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: '13px',
            fontStyle: 'italic',
            color: '#e0b4ff',
            margin: '0 0 20px 0',
            textAlign: 'center',
            lineHeight: '1.5',
            letterSpacing: '0.3px',
          }}
        >
          Takes 5 seconds. Unlocks your full reading.
        </p>

        {/* BRANDING FOOTER */}
        <div
          style={{
            borderTop: '1px solid rgba(201,168,76,0.2)',
            paddingTop: '12px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '12px',
              color: '#c9a84c',
              margin: '0',
              letterSpacing: '1px',
            }}
          >
            🔮 mysticfortunes.ai
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(201,168,76,0.5));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 0 30px rgba(201,168,76,0.8));
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(201,168,76,0.4);
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
