import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackInAppBrowserDetected } from '../utils/inappBrowserUtils';

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

export const CameraBlockedPage = ({ onUpload }) => {
  const [deepLinkTried, setDeepLinkTried] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const browserInfo = detectInAppBrowser();
  const platform = browserInfo.isInstagram ? 'Instagram'
    : browserInfo.isTikTok ? 'TikTok'
    : browserInfo.isFacebook ? 'Facebook'
    : 'this browser';

  const isAndroid = /Android/i.test(navigator.userAgent);

  // Dev mode: Shift+D to skip to manual instructions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'D') {
        setDeepLinkTried(true);
        setShowManual(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dev mode: Check for bypass flag to skip straight to manual instructions
  useEffect(() => {
    if (sessionStorage.getItem('bypassDeepLink') === 'true') {
      setDeepLinkTried(true);
      setShowManual(true);
      sessionStorage.removeItem('bypassDeepLink');
    }
  }, []);

  const tryOpenInBrowser = () => {
    setDeepLinkTried(true);
    const url = new URL(window.location.href);
    const appUrl = url.origin + '/?startCapture=true';

    // iOS: Try Safari deep link scheme
    if (!isAndroid) {
      try {
        window.location.href = appUrl.replace(/^https?:\/\//, 'safari-https://');
      } catch (e) { /* silent */ }

      // Fallback: Try _system
      setTimeout(() => {
        try {
          window.open(appUrl, '_system');
        } catch (e) { /* silent */ }
      }, 200);
    } else {
      // Android: Multiple deep link attempts
      
      // Attempt 1: Chrome Intent URL (most reliable for Android)
      try {
        const domain = new URL(appUrl).hostname;
        const path = new URL(appUrl).pathname + new URL(appUrl).search;
        window.location.href = `intent://${domain}${path}#Intent;scheme=https;package=com.android.chrome;action=android.intent.action.VIEW;end`;
      } catch (e) { /* silent */ }

      // Attempt 2: Try _system fallback
      setTimeout(() => {
        try {
          window.open(appUrl, '_system');
        } catch (e) { /* silent */ }
      }, 300);

      // Attempt 3: Try direct window.location for Chrome
      setTimeout(() => {
        try {
          window.location.href = appUrl;
        } catch (e) { /* silent */ }
      }, 600);

      // Attempt 4: Try Firefox fallback
      setTimeout(() => {
        try {
          window.open(appUrl, '_blank');
        } catch (e) { /* silent */ }
      }, 900);
    }

    // If still here after 2s the deep link failed — show manual instructions
    setTimeout(() => setShowManual(true), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#080510',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      boxSizing: 'border-box',
      minHeight: '100vh',
    }}>

      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-30%', left: '-30%',
        width: '70%', height: '70%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-20%',
        width: '60%', height: '60%',
        background: 'radial-gradient(circle, rgba(120,60,180,0.1), transparent)',
        borderRadius: '50%', pointerEvents: 'none',
      }}/>

      {/* Hero image with top padding */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 440, flexShrink: 0, paddingTop: 24 }}>
        <img
          src="/crystal-ball.webp"
          alt="Crystal ball"
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

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 440,
        padding: '20px 24px 36px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1.2vh',
      }}>

        {/* Heading — first page only */}
        {!deepLinkTried && (
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(22px, 6vw, 30px)',
            fontWeight: 700, color: '#c9a84c',
            margin: 0, lineHeight: 1.2,
            letterSpacing: '0.5px', textAlign: 'center',
            textShadow: '0 0 24px rgba(201,168,76,0.4)',
          }}>
            Madame Zafira needs<br />your camera to<br />read your palm
          </h1>
        )}

        {/* Heading — fallback page only */}
        {showManual && (
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(22px, 6vw, 30px)',
            fontWeight: 700, color: '#c9a84c',
            margin: 0, lineHeight: 1.25,
            letterSpacing: '0.5px', textAlign: 'center',
            textShadow: '0 0 24px rgba(201,168,76,0.4)',
          }}>
            That didn't work,<br />do this instead
          </h1>
        )}

        {/* Warning */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(11px, 3vw, 14px)',
          color: '#ffb347', margin: 0,
          letterSpacing: '1px', textTransform: 'uppercase',
          fontWeight: 600, textAlign: 'center',
        }}>
          ⚠️ {platform} is blocking your camera
        </p>

        {/* ── PRIMARY: Deep link button (all users before tried) ── */}
        {!deepLinkTried && (
          <button
            onClick={tryOpenInBrowser}
            style={{
              width: '100%', padding: '18px',
              background: 'linear-gradient(135deg, #1a0a2e, #2e1250, #1a0a2e)',
              border: '2px solid #c9a84c', borderRadius: 14,
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(13px, 3.8vw, 16px)',
              fontWeight: 700, letterSpacing: 1,
              color: '#e8d5b8', cursor: 'pointer',
              boxShadow: '0 4px 28px rgba(201,168,76,0.25)',
              animation: 'buttonPulse 2s ease-in-out infinite',
            }}
          >
            ✦ Open in Browser
          </button>
        )}

        {/* ── After deep link tried: waiting message (all users) ── */}
        {deepLinkTried && !showManual && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'IM Fell English', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(15px, 4vw, 18px)',
              color: '#c084fc', margin: 0,
              textShadow: '0 0 18px rgba(192,132,252,0.5)',
            }}>
              Opening your browser…
            </p>
          </div>
        )}

        {/* ── Manual instructions — shown if deep link failed ── */}
        {showManual && (
          <>
            <div style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 16,
              padding: 'clamp(24px, 6vw, 36px) clamp(24px, 7vw, 36px)',
              width: '100%', boxSizing: 'border-box',
            }}>
              <p style={{
                margin: '0 0 18px 0',
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(15px, 4vw, 19px)',
                fontWeight: 700, color: '#c9a84c',
                letterSpacing: '0.5px', textAlign: 'center',
              }}>
                Open browser manually
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(16px, 4.5vw, 20px)', color: '#c9a84c', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>1.</span>
                <p style={{ margin: 0, fontFamily: "'Crimson Text', serif", fontSize: 'clamp(18px, 5vw, 22px)', color: '#d4c5a9', lineHeight: 1.6 }}>
                  Tap the three dots <strong style={{ color: '#ffe08a' }}>(⋮)</strong> in the top right
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(16px, 4.5vw, 20px)', color: '#c9a84c', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>2.</span>
                <p style={{ margin: 0, fontFamily: "'Crimson Text', serif", fontSize: 'clamp(18px, 5vw, 22px)', color: '#d4c5a9', lineHeight: 1.6 }}>
                  Tap <strong style={{ color: '#ffe08a' }}>"Open in browser"</strong>
                </p>
              </div>
            </div>

            <p style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(13px, 3.5vw, 16px)',
              color: '#c084fc', margin: 0,
              letterSpacing: '0.5px', textAlign: 'center',
              fontWeight: 600,
              textShadow: '0 0 18px rgba(192,132,252,0.7)',
            }}>
              Takes 5 seconds. Unlocks your full reading.
            </p>

            {/* Upload alternative */}
            {onUpload && (
              <div style={{
                width: '100%', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: 10,
                marginTop: 20,
              }}>
                <div style={{
                  width: '100%', height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
                }}/>
                <button
                  onClick={onUpload}
                  style={{
                    width: '100%', padding: '16px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1.5px solid rgba(201,168,76,0.40)',
                    borderRadius: 12,
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700, letterSpacing: 1,
                    color: '#c9a84c', cursor: 'pointer',
                  }}
                >
                  🖐️ Upload a Photo Instead
                </button>
              </div>
            )}
          </>
        )}

        <style>{`
          @keyframes buttonPulse {
            0%, 100% {
              box-shadow: 0 4px 28px rgba(201,168,76,0.25), 0 0 20px rgba(201,168,76,0.1);
            }
            50% {
              box-shadow: 0 8px 40px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.3);
            }
          }
        `}</style>

      </div>

      {/* Footer - sticky at bottom */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        marginTop: 'auto',
        paddingTop: 20,
        paddingBottom: 16,
        borderTop: '1px solid rgba(201,168,76,0.15)',
      }}>
        {/* Branding */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(13px, 3.5vw, 16px)',
          color: 'rgba(201,168,76,0.85)',
          margin: 0, letterSpacing: '2px',
          textShadow: '0 0 12px rgba(201,168,76,0.4)',
        }}>
          🔮 mysticfortunes.ai
        </p>

        {/* Footer Links */}
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
            cursor: 'pointer',
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
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#b0405a'}
          onMouseLeave={e => e.currentTarget.style.color = '#ffe083'}
          >
            Terms & Conditions
          </Link>
        </div>
      </div>

    </div>
  );
};

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
