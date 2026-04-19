import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ─── Identical validation logic to FullscreenCamera ───────────────────────────
function validateLandmarks(lm, results) {
  if (!lm) return { valid: false, msg: 'No hand detected — try better lighting and a cleaner background' };

  const label = results?.multiHandedness?.[0]?.label;
  const thumbLeft = lm[4].x < lm[20].x;
  const isLeftHand = label ? label === 'Right' : thumbLeft;

  const wrist = lm[0], indexMCP = lm[5], pinkyMCP = lm[17];
  const v1x = indexMCP.x - wrist.x, v1y = indexMCP.y - wrist.y;
  const v2x = pinkyMCP.x - wrist.x, v2y = pinkyMCP.y - wrist.y;
  const palmFacing = (v1x * v2y - v1y * v2x) > 0;

  const fingersOpen = [8, 12, 16, 20].every(tip => lm[tip].y < lm[tip - 2].y);

  const handSpanX = Math.abs(lm[4].x - lm[20].x);
  const handSpanY = Math.abs(lm[0].y - lm[12].y);
  const cx = (lm[0].x + lm[9].x) / 2;
  const wristY = lm[0].y;
  const midTipY = lm[12].y;

  const handCentred = cx > 0.20 && cx < 0.80;
  const wristLow    = wristY > 0.50;
  const tipsHigh    = midTipY < 0.60;
  const bigEnough   = handSpanX > 0.25 && handSpanY > 0.28;

  if (!isLeftHand)  return { valid: false, msg: 'Please use your LEFT hand — retake the photo showing your left palm' };
  if (!palmFacing)  return { valid: false, msg: 'Show the palm side of your hand, not the back' };
  if (!fingersOpen) return { valid: false, msg: 'Spread your fingers open fully' };
  if (!bigEnough)   return { valid: false, msg: 'Your hand is too small in the photo — hold it closer to the camera' };
  if (!handCentred) return { valid: false, msg: 'Centre your hand in the photo' };
  if (!wristLow)    return { valid: false, msg: 'Include your wrist — lower your hand in the frame' };
  if (!tipsHigh)    return { valid: false, msg: 'Include all your fingertips — raise your hand in the frame' };

  return { valid: true, msg: '✦ Palm accepted' };
}

async function loadMediaPipe() {
  if (window.Hands) return;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js';
    s.crossOrigin = 'anonymous';
    s.onload = res;
    s.onerror = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands.js';
      s2.crossOrigin = 'anonymous';
      s2.onload = res;
      s2.onerror = () => {
        const s3 = document.createElement('script');
        s3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        s3.crossOrigin = 'anonymous';
        s3.onload = res; s3.onerror = rej;
        document.head.appendChild(s3);
      };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  });
}

function detectHandInCanvas(canvas) {
  return new Promise((resolve) => {
    const hands = new window.Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}`,
    });
    hands.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: 0.4, minTrackingConfidence: 0.3 });

    let resolved = false;
    hands.onResults(results => {
      if (!resolved) {
        resolved = true;
        const lm = results.multiHandLandmarks?.[0] || null;
        resolve({ lm, results });
        hands.close?.();
      }
    });

    hands.initialize().then(() => {
      hands.send({ image: canvas }).catch(() => {
        if (!resolved) { resolved = true; resolve({ lm: null, results: null }); }
      });
    }).catch(() => {
      if (!resolved) { resolved = true; resolve({ lm: null, results: null }); }
    });

    setTimeout(() => {
      if (!resolved) { resolved = true; resolve({ lm: null, results: null }); }
    }, 12000);
  });
}

const C = {
  gold: '#c9a84c',
  rose: '#b0405a',
  teal: '#2a8a7a',
  cream: '#e8d5b8',
};

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
  };
};

const TIPS = [
  'Hold your left palm flat, fingers spread wide',
  'Use good lighting — natural light works best',
  'Hold your hand close enough to fill the frame',
  'Palm facing the camera, wrist visible at the bottom',
];

export default function PalmUploadScreen({ isPartner = false, onCapture, onCancel }) {
  const [status, setStatus]         = useState('idle');
  const [msg, setMsg]               = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);
  const captureInputRef = useRef(null);

  const browserInfo = detectInAppBrowser();
  const cameraPlatform = browserInfo.isTikTok ? 'TikTok' : browserInfo.isInstagram ? 'Instagram' : browserInfo.isFacebook ? 'Facebook' : null;
  const isCameraBlocked = browserInfo.isInAppBrowser;

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreviewUrl(dataUrl);
      setStatus('loading');
      setMsg('Reading your palm…');

      try {
        const img = new Image();
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
        const canvas = document.createElement('canvas');
        canvas.width  = Math.min(img.width,  1280);
        canvas.height = Math.min(img.height, 1280);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        setMsg('Summoning the ancient sight…');
        await loadMediaPipe();

        setMsg('Tracing the lines of fate…');
        const { lm, results } = await detectHandInCanvas(canvas);

        const { valid, msg: validMsg } = validateLandmarks(lm, results);

        if (valid) {
          setStatus('accepted');
          setMsg('✦ Palm accepted');
          setTimeout(() => onCapture(dataUrl, lm), 900);
        } else {
          setStatus('rejected');
          setMsg(validMsg);
        }
      } catch {
        setStatus('rejected');
        setMsg('Something went wrong reading the image — please try again');
      }
    };
    reader.readAsDataURL(file);
  }, [onCapture]);

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);
  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); };

  const retry = () => {
    setStatus('idle'); setMsg(''); setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isLoading  = status === 'loading';
  const isRejected = status === 'rejected';
  const isAccepted = status === 'accepted';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 65,
      background: '#080510',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      overflowY: 'auto', boxSizing: 'border-box',
      minHeight: '100vh',
    }}>

      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 440,
        padding: '16px 24px 40px',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
      }}>

        {/* Top bar: heading centred, no back button here */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 8,
        }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(13px, 3.8vw, 17px)',
            color: C.gold, letterSpacing: 2, fontWeight: 700,
            textShadow: '0 0 12px rgba(201,168,76,0.4)',
            textAlign: 'center',
          }}>
            {isPartner ? "PARTNER'S PALM PHOTO" : 'UPLOAD PALM PHOTO'}
          </span>
        </div>

        {/* Instruction */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'IM Fell English', serif",
            fontSize: 'clamp(15px, 4vw, 18px)',
            fontStyle: 'italic',
            color: 'rgba(232,213,184,0.85)',
            margin: 0, lineHeight: 1.5,
          }}>
            Take a clear photo of your{isPartner ? " partner's" : ''} left palm<br />
            and upload it below
          </p>
        </div>

        {/* Tips */}
        <div style={{
          width: '100%',
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 12,
          padding: '14px 18px',
        }}>
          {TIPS.map((tip, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              marginBottom: i < TIPS.length - 1 ? 8 : 0,
            }}>
              <span style={{ color: C.gold, fontSize: 12, flexShrink: 0, marginTop: 2 }}>✦</span>
              <span style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: 'clamp(14px, 3.8vw, 17px)',
                color: 'rgba(232,213,184,0.72)', lineHeight: 1.4,
              }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div
          onClick={() => !isLoading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{
            width: '100%',
            minHeight: previewUrl ? 'auto' : 200,
            border: `2px dashed ${isRejected ? C.rose : isAccepted ? C.teal : 'rgba(201,168,76,0.35)'}`,
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: isLoading ? 'default' : 'pointer',
            position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.3s',
            background: 'rgba(0,0,0,0.25)',
          }}
        >
          {previewUrl && (
            <img src={previewUrl} alt="Palm preview" style={{
              width: '100%', maxHeight: 320, objectFit: 'contain', display: 'block',
              opacity: isLoading ? 0.55 : 1, transition: 'opacity 0.3s',
            }}/>
          )}

          {isLoading && (
            <div style={{
              position: previewUrl ? 'absolute' : 'relative',
              inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 14, padding: 24,
              background: previewUrl ? 'rgba(8,5,16,0.70)' : 'transparent',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '3px solid rgba(201,168,76,0.2)',
                borderTop: `3px solid ${C.gold}`,
                animation: 'spin 1s linear infinite',
              }}/>
              <span style={{
                fontFamily: "'IM Fell English', serif", fontStyle: 'italic',
                fontSize: 16, color: C.cream, textAlign: 'center',
              }}>{msg}</span>
            </div>
          )}

          {isAccepted && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'rgba(42,138,122,0.35)',
            }}>
              <span style={{ fontSize: 40 }}>✅</span>
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700,
                color: '#7fffd4', letterSpacing: 1,
                textShadow: '0 0 14px rgba(127,255,212,0.6)',
              }}>Palm Accepted</span>
            </div>
          )}

          {!previewUrl && !isLoading && (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12, padding: 32,
            }}>
              <span style={{ fontSize: 44, opacity: 0.6 }}>🖐️</span>
              <span style={{
                fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700,
                color: 'rgba(201,168,76,0.7)', letterSpacing: 1, textAlign: 'center',
              }}>TAP TO UPLOAD</span>
              <span style={{
                fontFamily: "'Crimson Text', serif", fontSize: 15,
                color: 'rgba(232,213,184,0.45)', textAlign: 'center',
              }}>or drag and drop your photo here</span>
            </div>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*"
          onChange={handleInputChange} style={{ display: 'none' }}/>

        {/* Hidden camera capture input — opens camera directly */}
        <input ref={captureInputRef} id="camera-capture-input" type="file" accept="image/*"
          capture="environment"
          onChange={handleInputChange} style={{ display: 'none' }}/>

        {/* Rejection */}
        {isRejected && (
          <div style={{
            width: '100%',
            background: 'rgba(176,64,90,0.15)',
            border: `1.5px solid ${C.rose}`,
            borderRadius: 12, padding: '16px 20px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 14, textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'IM Fell English', serif", fontStyle: 'italic',
              fontSize: 'clamp(15px, 4vw, 18px)', color: '#f0a0b0',
              margin: 0, lineHeight: 1.5,
            }}>{msg}</p>
            <button onClick={retry} style={{
              background: 'linear-gradient(135deg, #5c1a2a, #b0405a)',
              border: 'none', borderRadius: 10, padding: '12px 28px',
              fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 1, color: '#fff', cursor: 'pointer',
              boxShadow: '0 3px 16px rgba(176,64,90,0.4)',
            }}>Try a Different Photo</button>
          </div>
        )}

        {/* Idle CTAs */}
        {status === 'idle' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isCameraBlocked ? (
              <button style={{
                width: '100%', padding: '18px',
                background: 'linear-gradient(135deg, #5c1a2a, #b0405a)',
                border: `2px solid ${C.rose}`,
                borderRadius: 14,
                fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700,
                letterSpacing: 1.5, color: C.cream, cursor: 'default',
                boxShadow: '0 4px 24px rgba(176,64,90,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: 0.7,
              }}>
                <span>🚫</span> Camera Blocked by {cameraPlatform}
              </button>
            ) : (
              /* <label> activates the capture input natively — avoids the iOS history-pop
                 bug that occurs when programmatically calling .click() from a button handler */
              <label htmlFor="camera-capture-input" style={{
                width: '100%', padding: '18px',
                background: 'linear-gradient(135deg, #1a0a2e, #2e1250, #1a0a2e)',
                border: `2px solid ${C.gold}`,
                borderRadius: 14,
                fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 700,
                letterSpacing: 1.5, color: C.cream, cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(201,168,76,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxSizing: 'border-box',
              }}>
                <span>📷</span> Take a Photo Now
              </label>
            )}
            <button onClick={onCancel} style={{
              background: 'none', border: 'none',
              fontFamily: "'Cinzel', serif", fontSize: 13,
              color: 'rgba(201,168,76,0.75)', letterSpacing: 1,
              cursor: 'pointer', padding: '6px 12px', marginTop: 4,
            }}>
              ← Go Back
            </button>
          </div>
        )}

      </div>

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

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
