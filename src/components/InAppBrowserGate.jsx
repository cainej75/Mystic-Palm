import React, { useEffect } from 'react';
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
      padding: '5vh 22px 4vh',
      zIndex: 9999,
      overflow: 'hidden',
      boxSizing: 'border-box',
      height: '100%',
      minHeight: '-webkit-fill-available',
    }}>

      {/* Background glows */}
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

      {/* Main content */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2.8vh',
        position: 'relative',
        zIndex: 10,
        flex: 1,
        justifyContent: 'center',
      }}>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(28px, 7.5vw, 38px)',
          fontWeight: 700,
          color: '#c9a84c',
          margin: 0,
          lineHeight: 1.25,
          letterSpacing: '0.5px',
          textAlign: 'center',
          textShadow: '0 0 24px rgba(201,168,76,0.4)',
        }}>
          Your future is<br />already written…
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: 'clamp(17px, 4.5vw, 22px)',
          fontStyle: 'italic',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.5,
          textAlign: 'center',
          opacity: 0.88,
        }}>
          But Madame Zafira can't reveal it<br />inside this browser.
        </p>

        {/* Warning */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(12px, 3.2vw, 15px)',
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
          borderRadius: '16px',
          padding: 'clamp(18px, 4vw, 26px) clamp(20px, 5vw, 30px)',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <p style={{
            margin: '0 0 14px 0',
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            fontWeight: 700,
            color: '#c9a84c',
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}>
            How to open in your browser:
          </p>

          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(14px, 3.5vw, 17px)',
              color: '#c9a84c',
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 2,
            }}>1.</span>
            <p style={{
              margin: 0,
              fontFamily: "'Crimson Text', serif",
              fontSize: 'clamp(18px, 4.8vw, 22px)',
              color: '#d4c5a9',
              lineHeight: 1.5,
            }}>
              Tap the three dots <strong style={{ color: '#ffe08a' }}>(⋮)</strong> in the top right
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(14px, 3.5vw, 17px)',
              color: '#c9a84c',
              fontWeight: 700,
              flexShrink: 0,
              marginTop: 2,
            }}>2.</span>
            <p style={{
              margin: 0,
              fontFamily: "'Crimson Text', serif",
              fontSize: 'clamp(18px, 4.8vw, 22px)',
              color: '#d4c5a9',
              lineHeight: 1.5,
            }}>
              Tap <strong style={{ color: '#ffe08a' }}>"Open in browser"</strong>
            </p>
          </div>
        </div>

        {/* Purple CTA */}
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(14px, 3.8vw, 17px)',
          color: '#c084fc',
          margin: 0,
          letterSpacing: '0.5px',
          textAlign: 'center',
          fontWeight: 600,
          textShadow: '0 0 18px rgba(192,132,252,0.7)',
        }}>
          Takes 5 seconds. Unlocks your full reading.
        </p>

      </div>

      {/* Branding */}
      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 'clamp(13px, 3.5vw, 16px)',
        color: 'rgba(201,168,76,0.85)',
        margin: 0,
        letterSpacing: '2px',
        position: 'relative',
        zIndex: 10,
        textShadow: '0 0 12px rgba(201,168,76,0.4)',
      }}>
        🔮 mysticfortunes.ai
      </p>

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
