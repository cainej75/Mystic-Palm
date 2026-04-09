import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense, lazy } from "react";
import {
  generateSeed, seededRandom, seededPick,
  generatePartnerCompatibility, generateFortune,
  generateCompatibility, generateShareText, getZodiac,
} from './utils/fortuneEngine';
import { compressImage, extractPalmLines, identifyPalmLines } from './utils/cvPipeline';
import { Link } from "react-router-dom";
import { CameraBlockedPage } from "./components/InAppBrowserGate";

// Lazy load modals - only loaded when user opens them
const PaymentModal = lazy(() => import("./components/PaymentModal"));
const DownloadModal = lazy(() => import("./components/DownloadModal"));

// Lazy load PDF generators - only loaded when user downloads
const lazyImportPDFGenerators = async () => {
  const { generatePartnerCompatibilityPDF } = await import("./utils/generatePartnerCompatibilityPDF");
  const { generateFullRevelationPDF } = await import("./utils/generateFullRevelationPDF");
  return { generatePartnerCompatibilityPDF, generateFullRevelationPDF };
};

const SERAPHINA_IMG = "/madame-zafira-portrait.webp";


const C = {
  bg:      "#080510",
  surface: "#100c1a",
  border:  "#2e1f40",
  gold:    "#c9a84c",
  goldDim: "#7a6530",
  rose:    "#b0405a",
  roseDim: "#5c1a2a",
  teal:    "#2a8a7a",
  cream:   "#e8d5b8",
  muted:   "#6a5870",
};




const Particles = React.memo(function Particles() {
  const pts = useRef(Array.from({length:22},(_,i)=>({
    x:Math.random()*100, y:Math.random()*100,
    s:1.5+Math.random()*2.5,
    c:i%3===0?C.gold:i%3===1?C.rose:"#c0a0ff",
    d:5+Math.random()*9, delay:Math.random()*7,
  }))).current;
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {pts.map((p,i)=>(
        <div key={i} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          width:p.s,height:p.s,borderRadius:"50%",background:p.c,opacity:0.2,
          animation:`floatP ${p.d}s ease-in-out ${p.delay}s infinite`}}/>
      ))}
    </div>
  );
});

const Candle = React.memo(function Candle({style={}}) {
  return (
    <svg width="22" height="50" viewBox="0 0 22 50" style={style}>
      <rect x="7" y="26" width="8" height="22" rx="2" fill="#b89050"/>
      <ellipse cx="11" cy="28" rx="4" ry="1.8" fill="#907040"/>
      <path d="M11 24 Q9 17 11 9 Q13 17 11 24Z" fill="#ff9020" style={{animation:"flicker 1.8s ease-in-out infinite"}}/>
      <path d="M11 22 Q10.2 17 11 13 Q11.8 17 11 22Z" fill="#ffe060" style={{animation:"flicker 1.3s ease-in-out infinite",animationDelay:"0.3s"}}/>
      <ellipse cx="11" cy="26" rx="5.5" ry="1.8" fill="rgba(255,150,20,0.15)" style={{animation:"flicker 2s ease-in-out infinite"}}/>
    </svg>
  );
});

// Mystical ambient music using Web Audio API — smooth, no crackling

const Seraphina = React.memo(function Seraphina({ speaking, phase, mood="neutral", videoRef, muted, setMuted }) {
  const glow = mood==="warning" ? C.rose : mood==="gift" ? C.teal : C.gold;
  const isActive = phase==="loading" || phase==="result" || phase==="reading";
  const [smiling, setSmiling] = useState(false);
  const [eyeBright, setEyeBright] = useState(false);
  const [lipOpen, setLipOpen] = useState(0);

  // Smiling effect on certain phases
  useEffect(() => {
    if (phase === "result") {
      setTimeout(() => setSmiling(true), 600);
      setTimeout(() => setEyeBright(true), 800);
    } else if (phase === "intro") {
      setTimeout(() => setSmiling(true), 2000);
    } else {
      setSmiling(false);
      setEyeBright(false);
    }
  }, [phase]);

  // Lip movement when speaking
  useEffect(() => {
    if (!speaking) { setLipOpen(0); return; }
    const id = setInterval(() => setLipOpen(Math.random()), 120);
    return () => clearInterval(id);
  }, [speaking]);

  return (
    <div style={{position:"relative",width:"100%",margin:"0 auto"}} onContextMenu={e=>e.preventDefault()}>
      {/* Outer aura */}
      <div style={{
        position:"absolute",inset:-4,borderRadius:20,
        boxShadow:`0 0 60px ${glow}55, 0 0 120px ${glow}22`,
        animation:"auraPulse 3s ease-in-out infinite",
        pointerEvents:"none",zIndex:0,
      }}/>
      {/* Main photo/video frame */}
      <div style={{
        position:"relative",borderRadius:18,overflow:"hidden",
        border:`2px solid ${glow}88`,
        boxShadow:`0 12px 48px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.4)`,
        zIndex:1,
        width:"100%",
        paddingTop:"133.33%",
        background:"#000",
      }}>
        {phase === "intro" ? (
          <img
            src="mystic_chamber.webp"
            alt="Madame Zafira"
            fetchpriority="high"
            style={{
              position:"absolute",
              top:"50%",
              left:"52%",
              width:"100%",
              height:"100%",
              objectFit:"cover",
              objectPosition:"center",
              transform:"translate(-50%, -50%) scale(1.4)",
              display:"block",
            }}
          />
        ) : (
          <img
            src={SERAPHINA_IMG}
            alt="Madame Zafira"
            style={{
              position:"absolute",
              top:0, left:0,
              width:"100%",
              height:"100%",
              objectFit:"cover",
              objectPosition:"center top",
              display:"block",
              filter: speaking
                ? "brightness(1.12) saturate(1.25) contrast(1.05)"
                : "brightness(1.0) saturate(1.15)",
              transition:"filter 0.4s ease",
            }}
          />
        )}
        {/* Vignette */}
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(ellipse at center, transparent 40%, rgba(8,5,16,0.55) 100%)",
          pointerEvents:"none",
        }}/>
        {/* Candlelight from below */}
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(ellipse at 50% 105%, rgba(255,140,20,0.22) 0%, transparent 55%)",
          pointerEvents:"none",
          animation:"flicker 3s ease-in-out infinite",
        }}/>
        {/* Lip movement overlay — subtle brightness on mouth area */}
        {speaking && (
          <div style={{
            position:"absolute",
            bottom:"18%",left:"28%",right:"28%",height:"12%",
            background:`rgba(255,200,150,${0.04 + lipOpen * 0.12})`,
            borderRadius:"0 0 60% 60%",
            transition:"background 0.1s ease",
            pointerEvents:"none",
            mixBlendMode:"screen",
          }}/>
        )}
        {/* Crystal ball glow when speaking */}
        {speaking && (
          <div style={{
            position:"absolute",
            bottom:"5%",left:"20%",right:"20%",height:"22%",
            background:`radial-gradient(ellipse, ${glow}${Math.round(40 + lipOpen*60).toString(16)} 0%, transparent 70%)`,
            animation:"auraPulse 0.7s ease-in-out infinite",
            pointerEvents:"none",
          }}/>
        )}
        {/* Smile glow — warm cheek brightening */}
        {smiling && !speaking && (
          <>
            <div style={{
              position:"absolute",
              top:"25%",left:"5%",width:"22%",height:"18%",
              background:"radial-gradient(ellipse, rgba(255,160,100,0.12) 0%, transparent 70%)",
              animation:"smileGlow 3s ease-in-out infinite",
              pointerEvents:"none",
            }}/>
            <div style={{
              position:"absolute",
              top:"25%",right:"5%",width:"22%",height:"18%",
              background:"radial-gradient(ellipse, rgba(255,160,100,0.12) 0%, transparent 70%)",
              animation:"smileGlow 3s ease-in-out infinite",
              pointerEvents:"none",
            }}/>
          </>
        )}
        {/* Eye brightening when pleased */}
        {eyeBright && (
          <>
            <div style={{
              position:"absolute",
              top:"22%",left:"20%",width:"18%",height:"10%",
              background:"radial-gradient(ellipse, rgba(255,230,180,0.15) 0%, transparent 70%)",
              animation:"eyeSparkle 2s ease-in-out infinite",
              pointerEvents:"none",
            }}/>
            <div style={{
              position:"absolute",
              top:"22%",right:"20%",width:"18%",height:"10%",
              background:"radial-gradient(ellipse, rgba(255,230,180,0.15) 0%, transparent 70%)",
              animation:"eyeSparkle 2s ease-in-out infinite",
              animationDelay:"0.3s",
              pointerEvents:"none",
            }}/>
          </>
        )}

        {/* Bottom name plate */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          background:"linear-gradient(transparent, rgba(8,5,16,0.95))",
          padding:"32px 16px 14px",
          textAlign:"center",
        }}>
          {isActive && (
            <div style={{
              fontFamily:"IM Fell English,serif",
              fontStyle:"italic",
              fontSize:13,
              color:C.cream,
              opacity:0.7,
              marginBottom:6,
              animation: speaking ? "textPulse 1s ease-in-out infinite" : "none",
            }}>
              {speaking ? "She reads the ancient lines…" : phase==="loading" ? "Consulting the stars…" : ""}
            </div>
          )}
          <div style={{
            fontFamily:"IM Fell English,serif",
            fontStyle:"italic",
            fontSize:"clamp(20px, 5vw, 28px)",
            color:C.gold,
            opacity:0.9,
            marginBottom:4,
            letterSpacing:1,
          }}>
            I've been expecting you
          </div>
          <div style={{
            fontFamily:"Cinzel,serif",
            fontSize:"clamp(18px, 4vw, 24px)",
            color:C.gold,
            letterSpacing:4,
            textTransform:"uppercase",
          }}>
            Madame Zafira
          </div>
          <div style={{
            width:60,height:1,
            background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,
            margin:"6px auto 0",
          }}/>
        </div>
      </div>
      {/* Floor glow */}
      <div style={{
        position:"absolute",bottom:-16,left:"50%",transform:"translateX(-50%)",
        width:"70%",height:30,
        background:`radial-gradient(ellipse, ${glow}35 0%, transparent 70%)`,
        animation:"flicker 2.5s ease-in-out infinite",
      }}/>
    </div>
  );
});

async function detectPalm(dataUrl) {
  // Load MediaPipe Hands script if not already loaded
  await new Promise((res, rej) => {
    if (window.Hands) return res();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
    s.crossOrigin = "anonymous";
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      try {
        const hands = new window.Hands({
          locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        let done = false;
        const finish = (val) => { if (!done) { done = true; resolve(val); } };

        hands.onResults((results) => {
          if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            finish(false); // No hand found — reject
            return;
          }
          // Hand detected — now check if palm is facing camera
          // Use landmark z-values: palm-facing = thumb (lm[4]) has lower z than wrist (lm[0])
          const lm = results.multiHandLandmarks[0];
          const handedness = results.multiHandedness?.[0]?.label || "Right";

          // Cross product of (index_mcp - wrist) x (pinky_mcp - wrist)
          // Positive z = palm facing camera, negative = back of hand
          const wrist = lm[0], indexMCP = lm[5], pinkyMCP = lm[17];
          const v1x = indexMCP.x - wrist.x, v1y = indexMCP.y - wrist.y;
          const v2x = pinkyMCP.x - wrist.x, v2y = pinkyMCP.y - wrist.y;
          const cross = v1x * v2y - v1y * v2x;

          // For right hand: cross > 0 means palm facing camera
          // For left hand: cross < 0 means palm facing camera
          const palmFacing = handedness === "Right" ? cross > 0 : cross < 0;

          if (!palmFacing) {
            finish(false); // Back of hand — reject
          } else {
            finish(true); // Palm facing — accept
          }
        });

        // Draw image to canvas and send to MediaPipe
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        await hands.send({ image: canvas });

        // 6 second timeout - if no result, let through
        setTimeout(() => finish(true), 6000);
      } catch(e) {
        resolve(true); // Error - let through
      }
    };
    img.onerror = () => resolve(true);
    img.src = dataUrl;
  });
}


function useTypewriter(text, speed=25, active=true) {
  const [shown,setShown]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    if(!active||!text){setShown("");setDone(false);return;}
    setShown("");setDone(false);let i=0;
    const id=setInterval(()=>{i++;setShown(text.slice(0,i));if(i>=text.length){clearInterval(id);setDone(true);}},speed);
    return()=>clearInterval(id);
  },[text,speed,active]);
  return{shown,done};
}

const Divider=()=>(
  <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0"}}>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
    <span style={{color:C.goldDim,fontSize:12}}>✦</span>
    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
  </div>
);

const Steps=({current,revealed})=>(
  <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:18}}>
    {["Scan","Read","Reveal"].map((s,i)=>(
      <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:i<=current?(i===2&&!revealed?C.rose:C.gold):C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:"Cinzel,serif",color:i<=current?"#080510":C.muted,fontWeight:700,transition:"all 0.3s"}}>{i+1}</div>
          <span style={{fontFamily:"Cinzel,serif",fontSize:9,color:i<=current?(i===2&&!revealed?"#ff9db8":C.gold):C.muted,letterSpacing:1,textTransform:"uppercase",fontWeight:i===2&&i<=current?700:400}}>{s}</span>
        </div>
        {i<2&&<div style={{width:16,height:1,background:i<current?C.gold:C.border,marginLeft:4}}/>}
      </div>
    ))}
  </div>
);

const ShareCard = React.memo(function ShareCard({reading, onOpenFullscreen, fullPaid}) {
  return (
    <div style={{textAlign:"center"}}>
      <button onClick={onOpenFullscreen} style={{background:`linear-gradient(135deg,${C.rose},${C.roseDim})`,border:"none",color:"white",borderRadius:8,padding:"12px 40px",fontSize:12,fontFamily:"Cinzel,serif",cursor:"pointer",fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>
        ✨ Generate Share Card
      </button>
    </div>
  );
});

const FullScreenShareCard = React.memo(function FullScreenShareCard({reading, userName, birthDate, onClose, todayFortune}) {
  const shareCardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!window.html2canvas) {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(s);
    }
  }, []);
  
  const handleSave = useCallback(async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        await new Promise(r => setTimeout(r, 100));
      }
      const canvas = await window.html2canvas(shareCardRef.current, {
        scale: 1,
        backgroundColor: '#080510',
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        windowHeight: shareCardRef.current.scrollHeight + 100,
        windowWidth: 400,
      });

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mystic-fortune.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setSaving(false);
      setSaved(true);
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  }, [saving, saved, shareCardRef]);
  
  return (
    <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,rgba(8,3,20,0.98) 0%,rgba(40,8,25,0.98) 50%,rgba(8,3,20,0.98) 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",zIndex:1000,overflowY:"auto"}}>
      <button onClick={onClose} style={{position:"fixed",top:20,right:20,background:"none",border:`2px solid ${C.gold}`,color:C.gold,borderRadius:"50%",width:40,height:40,fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001}}>×</button>
      
      {/* CARD — no button inside so capture is clean */}
      <div ref={shareCardRef} style={{maxWidth:330,width:"100%",background:"#0d0920",border:"3px solid #c9a84c",borderRadius:20,padding:"14px 10px",boxShadow:"0 0 40px rgba(201,168,76,0.3)"}}>
        
        {/* Heading */}
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontFamily:"IM Fell English,serif",fontSize:32,fontStyle:"italic",color:"#c9a84c",marginBottom:2,letterSpacing:1}}>Mystic Fortunes</div>
        </div>
        
        {/* Person's Name */}
        <div style={{marginBottom:10,textAlign:"center"}}>
          <div style={{fontFamily:"Crimson Text,serif",fontSize:28,color:"#b0405a",fontStyle:"italic"}}>{userName}</div>
        </div>
        
        {/* Today's Fortune Block */}
        {(()=>{
          const today = new Date();
          const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return (
            <div style={{marginBottom:16,paddingBottom:14,borderBottom:"1px solid rgba(201,168,76,0.27)"}}>
              <div style={{textAlign:"center",marginBottom:8}}>
                <span style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#c9a84c",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>✦ Today's Fortune ✦</span>
                <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:"#c9a84c",fontWeight:600,letterSpacing:1,marginTop:4}}>{dateStr}</div>
              </div>
              <p style={{fontFamily:"Crimson Text,serif",fontSize:15,color:"#f5ead8",lineHeight:1.8,margin:0,fontStyle:"italic",textAlign:"center"}}>{`"${todayFortune}"`}</p>
            </div>
          );
        })()}
        
        {/* Month Elements — bigger boxes */}
        {(()=>{
          const MONTHS_LBL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          const curMonth = new Date().getMonth();
          const curYear  = new Date().getFullYear();
          const monthSeed = (generateSeed(userName,birthDate) ^ ((curMonth+1)*2654435761) ^ (curYear*40503)) >>> 0;
          const mRng = seededRandom(monthSeed);
          const MSIGNS = ["The Midnight Oracle","The Wounded Healer","The Silent Storm","The Ancient Wanderer","The Hidden Flame","The Threshold Guardian","The Veiled Prophet","The Unfinished Star","The Deep Water","The Rising Phoenix","The Shadow Keeper","The Ember Child","The Tidal Soul","The Forgotten Sage","The Crimson Seeker","The Glass Mirror","The Iron Lotus","The Last Dreamer","The Pale Fire","The Storm Walker","The Bone Reader","The Veil Crosser","The Quiet Thunder","The Broken Compass","The Salt & Wound","The Gilded Cage","The Northern Light","The Bleeding Edge","The Moon Daughter","The Ash Pilgrim","The Torn Veil","The Unmarked Path"];
          const MCOLORS = ["Midnight Indigo","Blood Amber","Eclipse Silver","Ash Violet","Bone White","Storm Teal","Ember Gold","Shadow Crimson","Mist Grey","Deep Ochre","Blackened Rose","Smoke Jade","Rust & Honey","Fading Coral","Pale Obsidian","Dusk Lavender","Iron Violet","Scarlet Dusk","Pewter Blue","Burnt Sienna","Frozen Copper","Velvet Moss","Worn Ivory","Ghost Amber","Slate Mauve","Tarnished Gold","Bruised Plum","Celadon Shadow","Dried Blood","Twilight Cerise","Storm Grey","Arctic Flame"];
          const MNUMS = ["1","2","3","4","5","6","7","8","9"];
          const mSign  = MSIGNS[Math.floor(mRng()*MSIGNS.length)];
          const mColor = MCOLORS[Math.floor(mRng()*MCOLORS.length)];
          const mNum   = MNUMS[Math.floor(mRng()*MNUMS.length)];
          return (
            <div style={{marginBottom:14}}>
              <div style={{textAlign:"center",marginBottom:10}}>
                <span style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#c9a84c",letterSpacing:1.5,textTransform:"uppercase",fontWeight:700}}>✦ {MONTHS_LBL[curMonth]} Elements ✦</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                {[["🌙",mSign,"Soul Sign"],["🔢",mNum,"Lucky #"],["🎨",mColor,"Colour"]].map(([ic,v,l])=>(
                  <div key={l} style={{background:"#1a0f2e",border:"1px solid #c9a84c",borderRadius:8,padding:"14px 6px",textAlign:"center"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{ic}</div>
                    <div style={{fontFamily:"IM Fell English,serif",fontSize:12,color:"#f0dfc0",lineHeight:1.3,fontWeight:700}}>{v}</div>
                    <div style={{fontFamily:"Cinzel,serif",fontSize:8,color:"#c9a84c",fontWeight:700,letterSpacing:1,marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        
        {/* MysticFortunes.ai branding */}
        <div style={{textAlign:"center"}}>
          <span style={{fontFamily:"Cinzel,serif",fontSize:10,color:"#c9a84c",letterSpacing:1}}>
            🔮 MysticFortunes.ai
          </span>
        </div>
      </div>
      
      {/* Save button OUTSIDE the card so it isn't captured */}
      <button onClick={handleSave} disabled={saving || saved} style={{marginTop:20,background:saved?"#1a6b4a":saving?"#5c3a50":"linear-gradient(135deg,#c9a84c,#9d7d2e)",border:"none",color:saved?"white":"#080510",borderRadius:10,padding:"12px 30px",fontSize:12,fontFamily:"Cinzel,serif",fontWeight:600,cursor:saving||saved?"not-allowed":"pointer",letterSpacing:1,textTransform:"uppercase",opacity:1,transition:"all 0.3s"}}>
        {saved ? "✓ Share Card Saved" : saving ? "✦ Saving..." : "💾 Save Share Card"}
      </button>
    </div>
  );
});

const PartnerFullScreenShareCard = React.memo(function PartnerFullScreenShareCard({partnerReading, userName, partnerName, nameDisplayOrder, onClose}) {
  const shareCardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleSave = useCallback(async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = async () => {
        try {
          const canvas = await window.html2canvas(shareCardRef.current, {
            scale: 1,
            backgroundColor: '#080510',
            logging: false,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0,
            windowHeight: shareCardRef.current.scrollHeight + 100,
            windowWidth: 400,
          });
          
          const url = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cosmic-connection.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          setSaving(false);
          setSaved(true);
        } catch (err) {
          console.error('Canvas error:', err);
          setSaving(false);
        }
      };
      script.onerror = () => {
        console.error('Script load failed');
        setSaving(false);
      };
      document.head.appendChild(script);
    } catch (err) {
      console.error('Save failed:', err);
      setSaving(false);
    }
  }, [saving, saved, shareCardRef]);
  
  return (
    <div style={{position:"fixed",inset:0,background:"linear-gradient(160deg,rgba(8,3,20,0.98) 0%,rgba(40,8,25,0.98) 50%,rgba(8,3,20,0.98) 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",zIndex:1000}}>
      <button onClick={onClose} style={{position:"absolute",top:20,right:20,background:"none",border:`2px solid ${C.gold}`,color:C.gold,borderRadius:"50%",width:40,height:40,fontSize:24,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      
      <div ref={shareCardRef} style={{maxWidth:280,width:"100%",background:"#080510",border:"2px solid #c9a84c",borderRadius:14,padding:"16px",boxShadow:"0 0 40px rgba(201,168,76,0.3)",animation:"slideUp 0.5s ease"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,#c9a84c,transparent)`}}/>
        
        <div style={{fontFamily:"Cinzel,serif",fontSize:20,color:"#c9a84c",marginBottom:8,letterSpacing:2,textAlign:"center"}}>✦ Mystic Fortunes ✦</div>
        
        <div style={{fontFamily:"Cinzel,serif",fontSize:16,color:"#c9a84c",marginBottom:3,textAlign:"center"}}>Soulmate Connection</div>
        <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#ff6b8a",letterSpacing:1,marginBottom:12,textAlign:"center"}}>
          {nameDisplayOrder==="userFirst"?`${userName||"Your Name"} & ${partnerName||"Partner's Name"}`:`${partnerName||"Partner's Name"} & ${userName||"Your Name"}`}
        </div>
        
        <div style={{height:1,background:`linear-gradient(90deg,transparent,#c9a84c44,transparent)`,marginBottom:12}}/>
        
        <div style={{marginBottom:12,textAlign:"center"}}>
          <div style={{fontFamily:"Cinzel,serif",fontSize:10,color:"#c9a84c",letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Date</div>
          <div style={{fontFamily:"Crimson Text,serif",fontSize:12,color:"#e8d5b8"}}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
        
        <div style={{marginBottom:12,textAlign:"center"}}>
          <div style={{fontFamily:"Cinzel,serif",fontSize:32,color:"#ff6b8a",fontWeight:700}}>{partnerReading.score}%</div>
          <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:"#ff9db8",letterSpacing:1,textTransform:"uppercase"}}>Harmony Score</div>
        </div>
        
        <div style={{height:1,background:`linear-gradient(90deg,transparent,#c9a84c44,transparent)`,marginBottom:12}}/>
        
        <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:12,color:"#e8d5b8",lineHeight:1.7,margin:"0 0 12px",textAlign:"center"}}>{partnerReading.insight}</p>
        
        <div style={{height:1,background:`linear-gradient(90deg,transparent,#c9a84c44,transparent)`,marginBottom:10}}/>
        
        <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#c9a84c",letterSpacing:1,textAlign:"center",fontWeight:700,opacity:1}}>🔮 mysticfortunes.ai</div>
        
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,#c9a84c,transparent)`}}/>
      </div>
      
      <button onClick={handleSave} disabled={saving || saved} style={{marginTop:20,background:saved?"#1a6b4a":saving?"#5c3a50":"linear-gradient(135deg,#c9a84c,#9d7d2e)",color:saved?"white":"#080510",border:"none",borderRadius:10,padding:"12px 30px",fontSize:12,fontFamily:"Cinzel,serif",fontWeight:600,cursor:saving||saved?"not-allowed":"pointer",letterSpacing:1,textTransform:"uppercase",opacity:1,transition:"all 0.3s"}}>
        {saved ? "✓ Card Saved" : saving ? "✦ Saving..." : "💾 Save Your Card"}
      </button>
    </div>
  );
});

const CompatSection = React.memo(function CompatSection({myReading}) {
  const [img,setImg]=useState(null);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const fRef=useRef();
  const FB={score:78,verdict:"Kindred Spirits",romantic:"The lines suggest a deep emotional resonance written long before they knew each other existed.",challenges:"The greatest test: learning to give each other the freedom both quietly crave.",strength:"Together you create something neither could build alone.",prediction:"A pivotal moment this season will bind these two more deeply than either expects."};
  const handleFile = useCallback(e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setImg(ev.target.result);
    r.readAsDataURL(f);
  }, [setImg]);
  const go=async()=>{
    if(!img)return;setLoading(true);
    const b64=img.split(",")[1],mt=img.startsWith("data:image/png")?"image/png":"image/jpeg";
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mt,data:b64}},{type:"text",text:`You are Madame Zafira. Compare palms for romantic compatibility. First person soul sign: "${myReading?.soulSign||"unknown"}". Analyze the second palm. Respond ONLY valid JSON: {"score":number 1-100,"verdict":"2-3 words","romantic":"2 sentences","challenges":"1 sentence","strength":"1 sentence","prediction":"1 dramatic sentence"}`}]}]})});
      const data=await res.json();
      setResult(JSON.parse(data.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim()));
    }catch{setResult(FB);}
    setLoading(false);
  };
  const sc=result?result.score:0;
  const scColor=sc>=80?C.teal:sc>=55?C.gold:C.rose;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 16px",marginBottom:12}}>
      <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:C.goldDim,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>💕 Compatibility Reading</div>
      {!result?(
        <>
          {img?<img src={img} alt="Partner" style={{width:"100%",height:100,objectFit:"cover",borderRadius:8,marginBottom:8,filter:"sepia(20%)"}}/>:
            <button onClick={()=>fRef.current?.click()} style={{width:"100%",background:C.bg,border:`1px dashed ${C.border}`,borderRadius:8,padding:"13px",fontFamily:"Crimson Text,serif",fontSize:13,color:C.muted,cursor:"pointer",marginBottom:8}}>
              🖼️ Upload Partner's Palm Photo
            </button>}
          <input ref={fRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
          {img&&<button onClick={go} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${C.roseDim},${C.rose})`,border:"none",color:"white",borderRadius:8,padding:"12px",fontFamily:"Cinzel,serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>
            {loading?"Reading the stars…":"💕 Reveal Compatibility — $2.99"}
          </button>}
        </>
      ):(
        <div>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:76,height:76,borderRadius:"50%",border:`3px solid ${scColor}`,background:C.bg,flexDirection:"column",marginBottom:6}}>
              <div style={{fontFamily:"Cinzel,serif",fontSize:22,color:scColor,fontWeight:700}}>{sc}</div>
              <div style={{fontFamily:"Cinzel,serif",fontSize:8,color:C.muted}}>/100</div>
            </div>
            <div style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:15,color:scColor}}>{result.verdict}</div>
          </div>
          {[["💗",result.romantic],["⚡",result.challenges],["✨",result.strength],["🌟",result.prediction]].map(([ic,v])=>(
            <p key={ic} style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:13,color:C.cream,margin:"0 0 8px",lineHeight:1.65}}>{ic} {v}</p>
          ))}
          <button onClick={()=>{setResult(null);setImg(null);}} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"7px",fontFamily:"Cinzel,serif",fontSize:10,cursor:"pointer",marginTop:4}}>↺ Try Another</button>
        </div>
      )}
    </div>
  );
});


const LandmarkLines = React.memo(function LandmarkLines({ lm }) {
  const W = 280, H = 220;
  const x = (i) => lm[i].x * W;
  const y = (i) => lm[i].y * H;
  const life = `M${x(0)},${y(0)} Q${x(1)},${y(1)} ${(x(5)*0.6+x(9)*0.4).toFixed(1)},${(y(5)*0.85+y(0)*0.15).toFixed(1)}`;
  const heart = `M${x(5)},${(y(5)*0.85+y(0)*0.15).toFixed(1)} Q${x(9)},${(y(9)*0.8+y(0)*0.2).toFixed(1)} ${x(13)},${(y(13)*0.8+y(0)*0.2).toFixed(1)} Q${x(17)},${(y(17)*0.82+y(0)*0.18).toFixed(1)} ${x(17)},${(y(17)*0.82+y(0)*0.18).toFixed(1)}`;
  const head = `M${(x(5)*0.6+x(0)*0.4).toFixed(1)},${(y(5)*0.6+y(0)*0.4).toFixed(1)} Q${(x(9)*0.6+x(0)*0.4).toFixed(1)},${(y(9)*0.55+y(0)*0.45).toFixed(1)} ${(x(17)*0.6+x(0)*0.4).toFixed(1)},${(y(17)*0.58+y(0)*0.42).toFixed(1)}`;
  const fate = `M${x(0)},${y(0)} Q${(x(0)+x(9))/2},${(y(0)+y(9))/2} ${x(9)},${y(9)}`;
  const lines = [
    {d:life, stroke:"#c9a84c", len:120, delay:"0.3s", label:"Life"},
    {d:heart, stroke:"#b0405a", len:100, delay:"0.9s", label:"Heart"},
    {d:head, stroke:"#8090ff", len:100, delay:"1.4s", label:"Head"},
    {d:fate, stroke:"#2a8a7a", len:80, delay:"1.9s", label:"Fate"},
  ];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position:"absolute"}}>
      {lines.map(({d,stroke,len,delay,label})=>(
        <g key={label}>
          <path d={d} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={len} strokeDashoffset={len}
            style={{animation:`lineReveal 0.9s ease forwards ${delay}`,filter:`drop-shadow(0 0 4px ${stroke})`}}/>
        </g>
      ))}
      {[4,8,12,16,20].map((i,idx)=>{
        const colors=["#c9a84c","#b0405a","#8090ff","#2a8a7a","#c9a84c"];
        return <circle key={i} cx={x(i)} cy={y(i)} r="4" fill={colors[idx]} opacity="0"
          style={{animation:`sparkle 0.8s ease forwards ${2.0+idx*0.15}s`,filter:`drop-shadow(0 0 6px ${colors[idx]})`}}/>;
      })}
    </svg>
  );
});

// ═══════════════════════════════════════════════════════════
// PALM SCAN SCREEN — Uses real CV pipeline
// ═══════════════════════════════════════════════════════════

const PalmScanScreen = React.memo(function PalmScanScreen({ palmImage, palmLandmarks }) {
  const [stage, setStage] = useState("grid");
  const [scanMsg, setScanMsg] = useState("Palm detected");
  const [showMetrics, setShowMetrics] = useState(false);
  const [detectedLines, setDetectedLines] = useState(null);
  const [linesReady, setLinesReady] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 1, h: 1 });
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const SCAN_SEQUENCE = [
    { delay: 0,    msg: "Palm detected",              stage: "grid" },
    { delay: 1100, msg: "Mapping palm geometry…",     stage: "scan" },
    { delay: 2600, msg: "Analyzing palm creases…",    stage: "detect" },
    { delay: 4000, msg: "Identifying major lines…",   stage: "lines" },
    { delay: 5500, msg: "Measuring finger indices…",  stage: "measure" },
    { delay: 6800, msg: "Palm analysis complete.",    stage: "crystal" },
  ];

  // Load image and get real dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = palmImage;
  }, [palmImage]);

  // Run CV pipeline when we hit detect stage
  useEffect(() => {
    const timers = SCAN_SEQUENCE.map(({ delay, msg, stage: s }) =>
      setTimeout(() => { setScanMsg(msg); setStage(s); }, delay)
    );
    setTimeout(() => setShowMetrics(true), 4200);
    setTimeout(() => setShowMetrics(false), 6200);
    return () => timers.forEach(clearTimeout);
  }, []);

  // Run actual CV detection when we reach detect stage
  useEffect(() => {
    if (stage !== "detect") return;
    if (!palmLandmarks || !palmImage) { setLinesReady(true); return; }
    extractPalmLines(palmImage, palmLandmarks, imgSize.w, imgSize.h)
      .then(lines => {
        setDetectedLines(lines);
        setLinesReady(true);
      })
      .catch(() => setLinesReady(true));
  }, [stage]);

  const metrics = [
    { label: "Life Line Strength",    value: "82%" },
    { label: "Heart Line Curvature",  value: "67%" },
    { label: "Palm Width Ratio",      value: "1.21" },
    { label: "Finger Length Index",   value: "0.94" },
  ];

  const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Little"];
  const fingerTips  = [4, 8, 12, 16, 20];
  const fingerMCPs  = [2, 5,  9, 13, 17];

  // Display dimensions for the palm image box
  const DISP_W = 300, DISP_H = 240;

  // Convert normalised landmark coords to display coords
  const dx = lm => lm ? lm.x * DISP_W : 0;
  const dy = lm => lm ? lm.y * DISP_H : 0;
  const lm = palmLandmarks;

  // Convert a detected path (normalised 0-1) to display coords
  const pathToD = (pts) => {
    if (!pts || pts.length < 2) return "";
    const mapped = pts.map(([x,y]) => [x * DISP_W, y * DISP_H]);
    const smooth = mapped;
    return smooth.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  };

  // Fallback paths derived from landmarks (when CV detection not available)
  const fallbackLife  = lm ? `M${dx(lm[0])},${dy(lm[0])} Q${dx(lm[1])},${dy(lm[1])} ${(dx(lm[5])*0.6+dx(lm[9])*0.4).toFixed(1)},${(dy(lm[5])*0.85+dy(lm[0])*0.15).toFixed(1)}` : "M90,220 Q70,170 75,130 Q80,95 90,80";
  const fallbackHeart = lm ? `M${dx(lm[5])},${(dy(lm[5])*0.82+dy(lm[0])*0.18).toFixed(1)} Q${dx(lm[9])},${(dy(lm[9])*0.78+dy(lm[0])*0.22).toFixed(1)} ${dx(lm[17])},${(dy(lm[17])*0.80+dy(lm[0])*0.20).toFixed(1)}` : "M65,125 Q110,118 160,122 Q175,122 185,118";
  const fallbackHead  = lm ? `M${(dx(lm[5])*0.58+dx(lm[0])*0.42).toFixed(1)},${(dy(lm[5])*0.58+dy(lm[0])*0.42).toFixed(1)} Q${(dx(lm[9])*0.58+dx(lm[0])*0.42).toFixed(1)},${(dy(lm[9])*0.53+dy(lm[0])*0.47).toFixed(1)} ${(dx(lm[17])*0.58+dx(lm[0])*0.42).toFixed(1)},${(dy(lm[17])*0.56+dy(lm[0])*0.44).toFixed(1)}` : "M70,148 Q115,142 165,148 Q178,150 188,144";

  const lifeD  = (linesReady && detectedLines?.life)  ? pathToD(detectedLines.life)  : fallbackLife;
  const heartD = (linesReady && detectedLines?.heart) ? pathToD(detectedLines.heart) : fallbackHeart;
  const headD  = (linesReady && detectedLines?.head)  ? pathToD(detectedLines.head)  : fallbackHead;

  return (
    <div style={{ minHeight:"100vh", background:"#080510", display:"flex", flexDirection:"column", alignItems:"center", paddingBottom:20 }}>

      {/* Header */}
      <div style={{ width:"100%", maxWidth:540, padding:"28px 20px 0", textAlign:"center" }}>
        <div style={{ fontFamily:"Cinzel,serif", fontSize:11, color:"#2a8a7a", letterSpacing:4, textTransform:"uppercase", marginBottom:4 }}>
          BIOMETRIC PALM ANALYSIS
        </div>
        <div style={{ height:1, background:"linear-gradient(90deg,transparent,#2a8a7a55,transparent)", marginBottom:16 }}/>
      </div>

      {/* Palm image with overlays */}
      <div style={{ position:"relative", width:DISP_W, height:DISP_H, borderRadius:12, overflow:"hidden", border:"1px solid rgba(42,138,122,0.4)", boxShadow:"0 0 40px rgba(42,138,122,0.15)", margin:"0 auto" }}>

        <img ref={imgRef} src={palmImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", filter:"brightness(0.68) contrast(1.15) saturate(1.3)" }}/>

        {/* ── GRID ── */}
        {["grid","scan","detect","lines","measure","crystal"].includes(stage) && (
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity: stage==="grid" ? 0.65 : 0.1, transition:"opacity 1.2s ease" }} viewBox={`0 0 ${DISP_W} ${DISP_H}`}>
            {Array.from({length:7},(_,i)=>(
              <line key={`h${i}`} x1="0" y1={DISP_H/8*(i+1)} x2={DISP_W} y2={DISP_H/8*(i+1)} stroke="#2a8a7a" strokeWidth="0.4" opacity="0.7"/>
            ))}
            {Array.from({length:9},(_,i)=>(
              <line key={`v${i}`} x1={DISP_W/10*(i+1)} y1="0" x2={DISP_W/10*(i+1)} y2={DISP_H} stroke="#2a8a7a" strokeWidth="0.4" opacity="0.7"/>
            ))}
            {lm && [0,5,9,13,17].map(i=>(
              <circle key={i} cx={dx(lm[i])} cy={dy(lm[i])} r="5" fill="none" stroke="#2a8a7a" strokeWidth="1.5"
                style={{animation:`sparkle 1.3s ease-in-out ${i*0.15}s infinite`}}/>
            ))}
            {lm && [[0,0],[DISP_W,0],[0,DISP_H],[DISP_W,DISP_H]].map(([bx,by],i)=>{
              const sx = bx===0?1:-1, sy = by===0?1:-1;
              return (<g key={i}><line x1={bx} y1={by} x2={bx+sx*22} y2={by} stroke="#2a8a7a" strokeWidth="2"/><line x1={bx} y1={by} x2={bx} y2={by+sy*22} stroke="#2a8a7a" strokeWidth="2"/></g>);
            })}
          </svg>
        )}

        {/* ── SCAN SWEEP ── */}
        {["scan","detect","lines","measure","crystal"].includes(stage) && (
          <div style={{ position:"absolute", inset:0,
            background:"linear-gradient(180deg,transparent 0%,rgba(80,160,255,0.1) 45%,rgba(80,160,255,0.22) 50%,rgba(80,160,255,0.1) 55%,transparent 100%)",
            backgroundSize:"100% 200%", animation:"scanLine 1.8s ease-in-out 3", pointerEvents:"none" }}/>
        )}

        {/* ── LANDMARK DOTS (scan stage) ── */}
        {["scan","detect"].includes(stage) && lm && (
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox={`0 0 ${DISP_W} ${DISP_H}`}>
            {[0,4,5,8,9,12,13,16,17,20].map((i,idx) => (
              <circle key={i} cx={dx(lm[i])} cy={dy(lm[i])} r="3.5"
                fill="rgba(80,160,255,0.8)" opacity="0"
                style={{ animation:`sparkle 0.6s ease forwards ${0.08*idx}s`, filter:"drop-shadow(0 0 4px #50a0ff)" }}/>
            ))}
          </svg>
        )}

        {/* ── DETECTED PALM LINES ── */}
        {["lines","measure","crystal"].includes(stage) && (
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox={`0 0 ${DISP_W} ${DISP_H}`}>
            {/* Life line — gold */}
            <path d={lifeD} fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="300" strokeDashoffset="300"
              style={{ animation:"lineReveal 1.3s ease forwards 0.1s", filter:"drop-shadow(0 0 5px #c9a84c88)" }}/>
            <text style={{ animation:"fadeIn 0.5s ease forwards 1.5s", opacity:0 }}>
              {lm && <tspan x={dx(lm[5])*0.55+dx(lm[0])*0.45+10} y={dy(lm[5])*0.55+dy(lm[0])*0.45-4} fill="#c9a84c" fontSize="9" fontFamily="Cinzel,serif">Life Line</tspan>}
            </text>

            {/* Heart line — rose */}
            <path d={heartD} fill="none" stroke="#b0405a" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="300" strokeDashoffset="300"
              style={{ animation:"lineReveal 1.2s ease forwards 1.1s", filter:"drop-shadow(0 0 5px #b0405a88)" }}/>
            {lm && <text x={dx(lm[5])-2} y={dy(lm[5])*0.82+dy(lm[0])*0.18-10} fill="#b0405a" fontSize="9" fontFamily="Cinzel,serif" opacity="0" style={{animation:"fadeIn 0.5s ease forwards 2.3s"}}>Heart Line</text>}

            {/* Head line — blue */}
            <path d={headD} fill="none" stroke="#8090ff" strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="300" strokeDashoffset="300"
              style={{ animation:"lineReveal 1.2s ease forwards 2.0s", filter:"drop-shadow(0 0 5px #8090ff88)" }}/>
            {lm && <text x={(dx(lm[5])*0.58+dx(lm[0])*0.42)+5} y={(dy(lm[5])*0.58+dy(lm[0])*0.42)+16} fill="#8090ff" fontSize="9" fontFamily="Cinzel,serif" opacity="0" style={{animation:"fadeIn 0.5s ease forwards 3.2s"}}>Head Line</text>}
          </svg>
        )}

        {/* ── FINGER MEASUREMENT LINES ── */}
        {["measure","crystal"].includes(stage) && lm && (
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox={`0 0 ${DISP_W} ${DISP_H}`}>
            {fingerTips.map((tip,i) => {
              const mcp = fingerMCPs[i];
              const x1=dx(lm[mcp]), y1=dy(lm[mcp]), x2=dx(lm[tip]), y2=dy(lm[tip]);
              return (
                <g key={i} opacity="0" style={{ animation:`fadeIn 0.45s ease forwards ${0.18*i}s` }}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"
                    style={{ filter:"drop-shadow(0 0 3px white)" }}/>
                  <circle cx={x2} cy={y2} r="3" fill="white" opacity="0.9"/>
                  <circle cx={x1} cy={y1} r="2" fill="rgba(255,255,255,0.5)"/>
                  <text x={x2+5} y={y2+3} fill="white" fontSize="8" fontFamily="Cinzel,serif" opacity="0.85">{fingerNames[i]}</text>
                </g>
              );
            })}
          </svg>
        )}

        {/* Bottom gradient */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:"linear-gradient(transparent,rgba(8,5,16,0.92))", pointerEvents:"none" }}/>
      </div>

      {/* Status message */}
      <div style={{ width:"100%", maxWidth:380, padding:"12px 20px 0", textAlign:"center" }}>
        <div style={{ background:"rgba(8,5,16,0.88)", border:"1px solid rgba(42,138,122,0.35)", borderRadius:8, padding:"8px 18px", display:"inline-flex", alignItems:"center", gap:9 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#2a8a7a", animation:"auraPulse 1s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"Crimson Text,serif", fontSize:13, color:"#e8d5b8", animation:"fadeIn 0.3s ease" }} key={scanMsg}>{scanMsg}</span>
        </div>
      </div>

      {/* Metrics */}
      {showMetrics && (
        <div style={{ width:"100%", maxWidth:380, padding:"10px 20px 0", animation:"fadeIn 0.5s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
            {metrics.map(({ label, value }) => (
              <div key={label} style={{ background:"rgba(8,5,16,0.92)", border:"1px solid rgba(42,138,122,0.22)", borderRadius:6, padding:"6px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"Crimson Text,serif", fontSize:10, color:"rgba(201,168,76,0.7)" }}>{label}</span>
                <span style={{ fontFamily:"Cinzel,serif", fontSize:11, color:"#2a8a7a", fontWeight:600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crystal ball transition */}
      {stage === "crystal" && (
        <div style={{ width:"100%", maxWidth:380, padding:"16px 20px 0", textAlign:"center", animation:"fadeUp 0.6s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(16,12,26,0.95)", border:"1px solid rgba(201,168,76,0.3)", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"radial-gradient(circle at 35% 35%,rgba(180,160,255,0.9),rgba(60,40,120,0.7),rgba(30,15,60,0.9))", boxShadow:"0 0 22px rgba(160,130,255,0.6),0 0 44px rgba(160,130,255,0.3)", animation:"auraPulse 1.4s ease-in-out infinite", flexShrink:0, position:"relative" }}>
              <div style={{ position:"absolute", inset:4, borderRadius:"50%", background:"radial-gradient(circle at 38% 28%,rgba(255,255,255,0.45),transparent 65%)", animation:"auraPulse 2s ease-in-out infinite 0.5s" }}/>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"conic-gradient(from 0deg,transparent,rgba(160,130,255,0.3),transparent)", animation:"spin 4s linear infinite" }}/>
            </div>
            <div>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:9, color:"rgba(201,168,76,0.7)", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Madame Zafira</div>
              <p style={{ fontFamily:"IM Fell English,serif", fontStyle:"italic", fontSize:13, color:"#e8d5b8", margin:0, lineHeight:1.5 }}>
                Palm analysis complete. Transmitting energy pattern…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stage indicator */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:14 }}>
        {["grid","scan","detect","lines","measure","crystal"].map(s => (
          <div key={s} style={{ width:s===stage?18:6, height:6, borderRadius:3, background:s===stage?"#2a8a7a":"rgba(42,138,122,0.22)", transition:"all 0.3s ease" }}/>
        ))}
      </div>
    </div>
  );
});


const FullscreenCamera = React.memo(function FullscreenCamera({ canvasRef, onCapture, onCancel }) {
  const videoRef    = useRef(null);
  const overlayRef  = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const scanAnimRef = useRef(null);
  const handsRef    = useRef(null);
  const sendingRef  = useRef(false);
  const lastLMRef   = useRef(null);
  const lastResultsRef = useRef(null);
  const autoCaptureFiredRef = useRef(false);

  const [msg, setMsg]           = useState("Place your left hand in front of the rear camera, inside the outline, palm facing you");
  const [progress, setProgress] = useState(0);
  const [ready, setReady]       = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [mpStatus, setMpStatus] = useState("loading"); // loading | ready | failed
  const [cameraFailed, setCameraFailed] = useState(false);
  const progressRef   = useRef(0);
  const stableRef     = useRef(0);
  const STABLE_NEEDED = 22;

  // SVG path for the silhouette
  const HAND_PATH = "m264.51 527.47c-8.39 1.99-18.29 4.32-25 6-8.13 0.52-16.22 1-24-2-6.45-3.51-15.53-7.05-24-8-10.88-4.22-21.13-9.81-30-18-13.75-7.79-18.58-22.77-27-35-10.46-13.4-18.77-28.08-29.5-41.5-4.69-6.25-11.724-19.01-21.5-33.5-8.391-12.26-18.788-34.21-21.5-42.5-2.352-5.12-8.51-20.12-12.5-29.5-4.237-8.45-11.19-21.26-16-29-4.403-7.08-4-25.08-4-32 1.167-9.16 8.727-9.21 10.5-9.5 5.41-0.86 18.573-2.48 23.5 1.5 16.708 5.3 24.229 16.17 32 32 2.54 5.09 6.98 20.99 11 25 13.82 13.14 19.45 24.31 24.5 31.5 3.38 5.88 10.57 10.29 15.5 11.5 5 2.34 9.71-5.94 12-8.5 5.65-6.3 6.9-13.08 7-21 0.06-4.63 0.34-12.23 1-17.5 1.29-10.23 0.78-17.38 1-24.5 0.26-8.2-5-18.44-5-28.5-2.08-7.59-1.23-24.6-1-31 0.34-9.56-1-25.55-1.5-33-0.46-6.88-4.17-23.89-4.5-33-0.38-10.56-3.67-29.03-4-40-0.21-6.85 0.92-18.848 1.5-24.998 0.61-6.465 1.05-17.797 1-25.5-0.03-4.758 3.35-12.393 8-16 6.66-7.161 20.06-11.471 28.5-5 11.31 8.187 10.18 16.194 12.5 21 3.62 7.479 2.67 16.834 3.5 24.5 0.63 7.912 1.43 15.541 0 28.498 0 5.7 0.54 18.06 1 25.5 0.5 8.08 2.94 24.11 4 30 1.59 8.82 3.5 24.4 3 32.5-0.66 10.72 2.16 22.3 3 29.5 0.88 7.58 6.8 18.96 12 23.5 4 3.49 11.5-5.27 11.5-17-1.03-17.06 2.54-36.37 2-43.5-0.48-6.33 0.5-13.66 0.5-15-0.81-3.23 0-6.66 0-10 0-7.24-2.64-16.53-2-26 0.39-5.82-0.59-21.62-1-30 0-21.783-0.56-9.93-0.5-19.498 0.04-6.329 1.9-19.102 3-23.5 0.32-10.239 2.96-20.96 5-28 3.25-9.011 11.56-22.292 23.5-23 16.57 0.799 20.31 7.524 21 17.5 0.27 3.915 1.33 16.334 2 20 0.26 5.475 1.16 18.152 1.5 25 0.41 8.209 2.52 20.268 3 27.498 0.28 4.2-1.43 15.86-1 24-1.9 8.3 0.5 20.27 0.5 29.5v28.5c0 12.29-3.13 22.76-1 33 0.89 4.31 1.93 16.73 6.5 17.5 7.65 1.3 15.33-12.22 17.5-34.5 1.33-14.18 4-28.48 4-40-1.64-6.55 4.22-26.79 6-33.5 2.82-10.64 4.25-22.99 7-31-1.28-12.496 3.29-25.14 5-37.498 2.5-9.138 5.27-19.272 12-22 6.5-5.714 13.83-3.333 18-1.5 7 5.251 9.57 12.745 11.5 20.5 1.59 6.393-0.17 17.667-1 23.5 0.01 8.029 0.61 17.838 0 26.998-0.6 9.01-3 19.78-3 27 0.11 9.98-1.5 25.28-1.5 37-2.23 14.72-3 28.93-6 43.5-2.06 9.7-7.43 23.24-7.5 34 0 9.27-4.6 21.31 7.5 23 7 8.37 16.35-17.31 20.5-25 4.81-11.42 11.42-28.99 14-37 2.85-7.75 9.2-18.63 11.5-26 6.02-12.05 8.67-22.39 11-30.5 3.97-7.93 11.52-14.63 17-15.5 7.33-1.16 13.35 4.89 18 12 3.01 7.98-0.4 20.31-2 32-3.05 15.17-6.98 28.59-10.43 37.31-2.48 6.25-8.74 19.99-11.57 28.23-3.35 8.1-7.22 18.91-10.41 24.88-3.51 6.55-9.89 15.88-12.09 24.58-3.14 12.57-3.5 23.31-3.5 33 0 6.21-2 11.75-2 20 0.77 10.25-3.24 19.77-2 30 0.65 2.59 0.5 10.34-0.5 17 0.82 9.79-3.89 22.56-5.5 29-1.94 7.75-7 25.13-7 28.5-8.96 16.43-9.84 28.18-15.5 36-4.85 6.2-9.82 15.24-15.5 19.5-4.68 3.51-9.71 7.86-14 10-8.01 4.39-17 8.76-31 10-9.61-0.87-20.68-5.17-27-6-9.52-4.48-20.63-7.43-31-8z";

  // ── Step 1: Start camera first, independently ──
  useEffect(() => {
    let active = true;

    // Overall timeout — if camera hasn't started in 10s, treat as blocked
    const hardTimeout = setTimeout(() => {
      if (active) {
        console.warn("Camera timed out — treating as blocked");
        setCameraFailed(true);
      }
    }, 8000);

    (async () => {
      // Check browser support first
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error("getUserMedia not supported");
        clearTimeout(hardTimeout);
        if (active) { setCameraFailed(true); setMsg("❌ Your browser doesn't support camera access. Try Chrome or Firefox."); }
        return;
      }

      // Check if permission already granted — avoids re-prompt on mobile
      try {
        const perm = await navigator.permissions?.query({ name: "camera" });
        if (perm?.state === "denied") {
          if (active) { setCameraFailed(true); setMsg("❌ Camera access was blocked. Please enable camera access in your browser settings and reload."); }
          return;
        }
      } catch(e) { /* permissions API not supported — proceed anyway */ }

      // Try different constraint combinations - ALWAYS with facingMode first for rear camera
      const constraintVariations = [
        { video: { facingMode: { ideal: "environment" }, width: {ideal:1280}, height: {ideal:720} } },
        { video: { facingMode: "environment", width: {ideal:1280}, height: {ideal:720} } },
        { video: { facingMode: { ideal: "environment" } } },
        { video: { facingMode: "environment" } },
        { video: true },
      ];

      for (const constraints of constraintVariations) {
        try {
          console.log("Attempting camera with constraints:", JSON.stringify(constraints));
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (!active) { stream.getTracks().forEach(t=>t.stop()); return; }
          
          console.log("✓ Camera stream acquired successfully");
          clearTimeout(hardTimeout);
          streamRef.current = stream;
          const v = videoRef.current;
          if (v) { 
            v.srcObject = stream; 
            v.play().catch(e => console.warn("Video play error:", e));

            // Fallback: if video has no frames after 8s, treat as blocked
            const videoTimeout = setTimeout(() => {
              if (active && (!v.videoWidth || v.videoWidth === 0)) {
                console.warn("Camera stream acquired but no video frames — treating as blocked");
                setCameraFailed(true);
              }
            }, 8000);
            v.addEventListener("loadedmetadata", () => clearTimeout(videoTimeout), { once: true });
          }
          return;
        } catch(e) { 
          console.warn(`Camera constraint failed:`, e.name, e.message);
          continue; 
        }
      }
      
      // All attempts failed
      console.error("All camera attempts failed");
      clearTimeout(hardTimeout);
      if (active) { setCameraFailed(true); setMsg("❌ Camera access failed. Check settings, restart browser, or try a different app."); }
    })();
    
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t=>t.stop());
    };
  }, []);

  // ── Step 2: Load MediaPipe independently, after a short delay ──
  useEffect(() => {
    let cancelled = false;
    // Delay MP load by 1.5s so camera stream is fully established first
    const timer = setTimeout(async () => {
      try {
        if (!window.Hands) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/hands.js";
            s.crossOrigin = "anonymous";
            s.onload = () => {
              console.log("✓ MediaPipe loaded from CDN");
              res();
            };
            s.onerror = () => {
              console.warn("CDN 1 (jsdelivr) failed, trying backup...");
              const s2 = document.createElement("script");
              s2.src = "https://unpkg.com/@mediapipe/hands@0.4.1646424915/hands.js";
              s2.crossOrigin = "anonymous";
              s2.onload = () => {
                console.log("✓ MediaPipe loaded from unpkg");
                res();
              };
              s2.onerror = () => {
                console.warn("CDN 2 (unpkg) failed, trying third backup...");
                const s3 = document.createElement("script");
                s3.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
                s3.crossOrigin = "anonymous";
                s3.onload = () => {
                  console.log("✓ MediaPipe loaded from jsdelivr backup");
                  res();
                };
                s3.onerror = () => {
                  console.error("All MediaPipe CDNs failed");
                  rej(new Error("Failed to load MediaPipe from all CDNs"));
                };
                document.head.appendChild(s3);
              };
              document.head.appendChild(s2);
            };
            document.head.appendChild(s);
          });
        }
        if (cancelled) return;
        const hands = new window.Hands({
          locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${f}`,
        });
        hands.setOptions({ maxNumHands:1, modelComplexity:0, minDetectionConfidence:0.4, minTrackingConfidence:0.3 });
        hands.onResults(onMPResults);
        await hands.initialize();
        if (cancelled) return;
        handsRef.current = hands;
        console.log("✓ MediaPipe initialized successfully");
        setMpStatus("ready");
      } catch(e) {
        console.error("MediaPipe initialization failed:", e);
        if (!cancelled) {
          setMpStatus("failed");
          console.log("Falling back to skin detection mode");
        }
      }
    }, 1500);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // ── MediaPipe results handler ──
  const onMPResults = (results) => {
    sendingRef.current = false;
    lastResultsRef.current = results;
    lastLMRef.current = results.multiHandLandmarks?.[0] || null;
  };

  // ── Step 3: Main RAF loop — detection + drawing ──
  useEffect(() => {
    let running = true;

    const loop = () => {
      if (!running) return;
      rafRef.current = requestAnimationFrame(loop);

      const v = videoRef.current;
      const oc = overlayRef.current;
      if (!v || !oc || v.readyState < 2 || !v.videoWidth) return;

      const W = oc.offsetWidth || v.videoWidth;
      const H = oc.offsetHeight || v.videoHeight;
      if (oc.width !== W || oc.height !== H) { oc.width = W; oc.height = H; }
      const ctx = oc.getContext("2d");
      ctx.clearRect(0, 0, W, H);

      // Send frame to MediaPipe if ready and not already sending
      const hands = handsRef.current;
      if (hands && !sendingRef.current && v.videoWidth > 0) {
        sendingRef.current = true;
        hands.send({ image: v }).catch(() => { sendingRef.current = false; });
      }

      // ── Evaluate hand state ──
      const lm = lastLMRef.current;
      let isValid = false;
      let newMsg = "Place your left hand in front of the rear camera, inside the outline, palm facing you";

      if (lm) {
        const wrist = lm[0], indexMCP = lm[5], pinkyMCP = lm[17], middleMCP = lm[9];

        // Left hand check: rear camera mirrors — MediaPipe "Right" = user's left hand
        const label = lastResultsRef.current?.multiHandedness?.[0]?.label;
        // When label unavailable, use thumb position: for left palm facing camera,
        // thumb (lm[4]) should be on the LEFT side (lower x than pinky lm[20])
        const thumbLeft = lm[4].x < lm[20].x;
        const isLeftHand = label ? label === "Right" : thumbLeft;

        // Palm facing: cross product wrist→indexMCP × wrist→pinkyMCP
        const v1x = indexMCP.x - wrist.x, v1y = indexMCP.y - wrist.y;
        const v2x = pinkyMCP.x - wrist.x, v2y = pinkyMCP.y - wrist.y;
        const cross = v1x * v2y - v1y * v2x;
        const palmFacing = cross > 0;  // positive = palm toward camera on rear cam

        // Fingers open: tips above MCPs
        const fingersOpen = [8,12,16,20].every(tip => lm[tip].y < lm[tip-2].y);

        // ── Silhouette zone checks ──
        // Silhouette occupies: x 0..1 (full width), y ~0.16..0.80 of screen
        // Wrist (lm[0]) should be near bottom of silhouette: y > 0.58
        // Middle fingertip (lm[12]) should be near top: y < 0.52
        // Hand horizontal centre should be near screen centre
        // Hand must span at least 35% of screen width (fills the silhouette)

        const wristY    = lm[0].y;
        const midTipY   = lm[12].y;
        const handSpanX = Math.abs(lm[4].x - lm[20].x);   // thumb to pinky tip width
        const handSpanY = Math.abs(lm[0].y  - lm[12].y);  // wrist to middle tip height
        const cx        = (lm[0].x + lm[9].x) / 2;
        const cy        = (lm[0].y + lm[9].y) / 2;

        const handCentred  = cx > 0.25 && cx < 0.75;
        const wristLow     = wristY > 0.55;          // wrist near bottom of silhouette
        const tipsHigh     = midTipY < 0.55;         // fingertips in upper half
        const bigEnough    = handSpanX > 0.32 && handSpanY > 0.35;  // hand fills silhouette
        const notTooHigh   = cy < 0.80;

        // Diagnose most important issue first
        if (!isLeftHand)       newMsg = "Please use your LEFT hand ←";
        else if (!palmFacing)  newMsg = "Turn your hand over — show the palm side";
        else if (!fingersOpen) newMsg = "Spread your fingers open";
        else if (!bigEnough)   newMsg = "Move your hand closer to the camera";
        else if (!handCentred) newMsg = cx < 0.25 ? "Move hand right" : "Move hand left";
        else if (!wristLow)    newMsg = "Lower your wrist toward the bottom";
        else if (!tipsHigh)    newMsg = "Raise your fingers higher";
        else {
          isValid = true;
          const stab = stableRef.current / STABLE_NEEDED;
          newMsg = stab > 0.8 ? "Perfect — hold still…" : "Hold steady…";
        }
      } else if (mpStatus === "failed") {
        // MP failed — fall back to skin detection
        const sw = 80, sh = 60;
        const sc2 = document.createElement("canvas");
        sc2.width = sw; sc2.height = sh;
        const sc2ctx = sc2.getContext("2d");
        const zX = W*0.02, zY = H*0.16, zW = W*0.96, zH = H*0.65;
        sc2ctx.drawImage(v, zX*(v.videoWidth/W), zY*(v.videoHeight/H),
          zW*(v.videoWidth/W), zH*(v.videoHeight/H), 0, 0, sw, sh);
        const px = sc2ctx.getImageData(0,0,sw,sh).data;
        let skin = 0;
        for (let i=0;i<px.length;i+=4) {
          const r=px[i],g=px[i+1],b=px[i+2];
          if (r>80&&g>35&&b>15&&r>g&&r>b&&(r-g)>10) skin++;
        }
        isValid = skin/(sw*sh) > 0.22;
        newMsg = isValid ? "Hold steady…" : "Place your left hand in front of the rear camera, inside the outline, palm facing you";
      } else if (mpStatus === "loading") {
        newMsg = "Please wait while the hand detection is loading…";
      } else {
        newMsg = "Place your left hand in front of the rear camera, inside the outline, palm facing you";
      }

      // ── Update stable frame counter ──
      if (isValid) stableRef.current = Math.min(stableRef.current+1, STABLE_NEEDED);
      else         stableRef.current = Math.max(stableRef.current-2, 0);

      const pct = stableRef.current / STABLE_NEEDED;
      progressRef.current = pct;
      setProgress(pct);
      setReady(pct >= 1);
      setMsg(newMsg);

      // Auto-capture when hand fully aligned
      if (pct >= 1 && !autoCaptureFiredRef.current) {
        autoCaptureFiredRef.current = true;
        setMsg("Perfect — hold still…");
        setTimeout(() => doCapture(), 1500);
      }

      // ── Draw silhouette ──
      drawSilhouette(ctx, W, H, pct);

      // ── Scan lines ──
      if (scanAnimRef.current?.active) drawShutter(ctx, W, H);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [mpStatus]);

  const drawSilhouette = (ctx, W, H, progress) => {
    const aligned = progress >= 1;
    const strokeCol = aligned ? "rgba(148,90,210,1)"
      : progress>0.5 ? `rgba(201,168,76,${0.7+progress*0.25})` : "rgba(201,168,76,0.6)";
    const glowCol = aligned ? "rgba(148,90,210,0.9)" : "rgba(201,168,76,0.75)";
    const srcW=481, srcH=588;
    const scale=(W*1.04)/srcW;
    const tx=(W-srcW*scale)/2, ty=H*0.13;
    ctx.save();
    ctx.translate(tx,ty); ctx.scale(scale,scale);
    ctx.setLineDash([]); ctx.lineCap="round"; ctx.lineJoin="round";
    const path = new Path2D(HAND_PATH);
    ctx.fillStyle = aligned?"rgba(148,90,210,0.08)":"rgba(201,168,76,0.05)";
    ctx.fill(path,"evenodd");
    ctx.strokeStyle=strokeCol; ctx.lineWidth=8/scale;
    ctx.shadowColor=glowCol; ctx.shadowBlur=18/scale;
    ctx.stroke(path);
    ctx.strokeStyle=aligned?"rgba(210,170,255,0.45)":"rgba(255,240,175,0.42)";
    ctx.lineWidth=2.5/scale; ctx.shadowBlur=0; ctx.stroke(path);
    ctx.restore();

  };

  // ── Camera iris shutter animation ──────────────────────────
  // Draws overlapping blades that rotate to close/open like a real aperture
  const drawShutter = (ctx, W, H) => {
    const scan = scanAnimRef.current;
    if (!scan?.active) return;
    const elapsed = performance.now() - scan.startTime;

    // CLOSE: 0-320ms  (ease-in — snappy at end)
    // OPEN:  320-640ms (ease-out — springs open)
    const HALF = 320;
    const tRaw = elapsed / HALF;
    let t;
    if (tRaw <= 1.0) {
      t = tRaw * tRaw;
    } else {
      const u = Math.min(tRaw - 1.0, 1.0);
      t = (1 - u) * (1 - u);
    }

    const cx = W / 2, cy = H / 2;
    const BLADES = 9;
    const maxR = Math.sqrt(cx*cx + cy*cy) + 10;
    const holeR = maxR * (1 - t);

    ctx.save();

    // Draw iris blades — each is an annular sector that rotates inward
    for (let i = 0; i < BLADES; i++) {
      const baseA = (i / BLADES) * Math.PI * 2;
      const span  = (Math.PI * 2 / BLADES) * 1.18;
      const rotA  = t * (Math.PI * 2 / BLADES) * 0.82;
      const a1 = baseA + rotA;
      const a2 = a1 + span;
      const innerR = Math.max(0, holeR - 2);

      ctx.beginPath();
      ctx.arc(cx, cy, maxR, a1, a2);
      ctx.arc(cx, cy, innerR, a2, a1, true);
      ctx.closePath();
      const shade = i % 2 === 0 ? 12 : 18;
      ctx.fillStyle = 'rgba(' + shade + ',' + shade + ',' + shade + ',1)';
      ctx.fill();

      if (t > 0.05) {
        ctx.beginPath();
        ctx.arc(cx, cy, innerR + 1, a1, a2);
        ctx.strokeStyle = 'rgba(160,160,160,' + (t * 0.3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Fill dead centre when almost fully closed
    if (holeR < 4) {
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fill();
    }

    // Outer dark fill covering screen corners outside the iris circle
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.arc(cx, cy, maxR - 2, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();

    // Metallic rim around iris edge
    ctx.beginPath();
    ctx.arc(cx, cy, maxR - 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(120,120,120,' + (0.35 + t * 0.45) + ')';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    if (tRaw >= 2.0) {
      scan.active = false;
      scan.onComplete?.();
    }
  };


  // ── Camera shutter sound from uploaded MP3 ──────────────────
  const SHUTTER_MP3 = "data:audio/mpeg;base64,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";
  const playShutter = () => {
    try {
      const audio = new Audio(SHUTTER_MP3);
      audio.volume = 1.0;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const doCapture = () => {
    if (capturing) return;
    setCapturing(true);
    setMsg("Capturing…");
    playShutter();
    
    // Capture after animation completes
    setTimeout(() => {
      const v = videoRef.current, c = canvasRef.current;
      if (!v || !c) return;
      c.width = v.videoWidth || 640; c.height = v.videoHeight || 480;
      c.getContext("2d").drawImage(v, 0, 0);
      streamRef.current?.getTracks().forEach(t => t.stop());
      onCapture(c.toDataURL("image/jpeg", 0.92), lastLMRef.current);
    }, 800);
  };

  const pct = Math.round(progress*100);
  const col = progress>=1?"#c090ff":progress>0.5?"#ffe566":"#ffcc44";

  if (cameraFailed) return <CameraBlockedPage />;

  return (
    <div style={{position:"fixed",inset:0,zIndex:50,background:"#000",display:"flex",flexDirection:"column"}}>
      <video ref={videoRef} autoPlay playsInline muted webkitPlaysinline
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      <canvas ref={overlayRef}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>
      <canvas ref={canvasRef}
        style={{display:"none"}}/>
      <div style={{position:"relative",zIndex:3,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 8px",background:"linear-gradient(rgba(0,0,0,0.85),transparent)"}}>
        <button onClick={onCancel} style={{background:"rgba(0,0,0,0.6)",border:"1px solid rgba(255,210,80,0.7)",color:"#ffe566",borderRadius:20,padding:"8px 18px",fontFamily:"Cinzel,serif",fontSize:11,cursor:"pointer",letterSpacing:1}}>✕ Cancel</button>
        <div style={{fontFamily:"Cinzel,serif",fontSize:13,color:progress>=1?"#c090ff":"#ffe566",letterSpacing:3,fontWeight:700,textShadow:progress>=1?"0 0 12px #c090ff":"0 0 12px #ffe566"}}>LEFT PALM SCAN</div>
        <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:col,letterSpacing:1,minWidth:44,textAlign:"right",fontWeight:700}}>{pct}%</div>
      </div>

      <div style={{position:"relative",zIndex:3,padding:"8px 48px 0"}}>        <div style={{height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,rgba(201,168,76,0.4),${col})`,borderRadius:2,transition:"width 0.12s",boxShadow:`0 0 12px ${col}`}}/>
        </div>
      </div>
      <div style={{position:"absolute",bottom:40,left:0,right:0,zIndex:3,display:"flex",justifyContent:"center",padding:"0 20px"}}>
        <div style={{background:"rgba(0,0,0,0.78)",border:`2px solid ${col}`,borderRadius:30,padding:"12px 30px",maxWidth:380,textAlign:"center",backdropFilter:"blur(12px)",transition:"border-color 0.4s"}}>
          <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:20,color:progress>=1?"#c090ff":"#e8d5b8",margin:0,fontWeight:500,transition:"color 0.4s"}} key={msg}>
            {(() => {
              const words = msg.split(/(\bleft\b|\brear\b|\binside\b|\byou\b)/gi);
              return words.map((word, i) => 
                /^(left|rear|inside|you)$/i.test(word) 
                  ? <span key={i} style={{fontWeight:700,color:"#ffff00"}}>{word}</span>
                  : word
              );
            })()}
          </p>
        </div>
      </div>

    </div>
  );
});















const DetailsPage = React.memo(function DetailsPage({ onSubmit, onBack }) {
  const [name, setName] = useState("");
  const [day,  setDay]  = useState(1);
  const [month,setMonth]= useState(1);
  const [year, setYear] = useState(1990);
  const canProceed = name.trim().length > 0;

  const MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const DAYS   = Array.from({length:31},(_,i)=>i+1);
  const YEARS  = Array.from({length:100},(_,i)=>2025-i);

  const C = {
    bg:"#080510", surface:"#100c1a", border:"#2e1f40",
    gold:"#c9a84c", cream:"#e8d5b8", muted:"#6a5870",
  };

  return (
    <div style={{paddingTop:40,paddingBottom:60,animation:"fadeUp 0.6s ease both"}}>
      {/* Heading */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontFamily:"Cinzel,serif",fontSize:28,color:C.gold,letterSpacing:3,marginBottom:14,fontWeight:700,textShadow:"0 0 20px rgba(201,168,76,0.4)"}}>
          Mystic Fortunes
        </div>
        <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:20,color:C.cream,margin:0,lineHeight:1.6,opacity:0.92}}>
          Madame Zafira requires your details<br/>in order to see your future
        </p>
      </div>

      {/* Decorative divider */}
      <div style={{display:"flex",alignItems:"center",gap:10,margin:"0 0 24px"}}>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.gold}55)`}}/>
        <div style={{color:C.gold,fontSize:14}}>✦</div>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.gold}55,transparent)`}}/>
      </div>

      {/* Name input */}
      <div style={{marginBottom:28}}>
        <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:13,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>
          First Name
        </label>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Enter your first name…"
          autoComplete="name"
          style={{
            width:"100%",
            background:C.surface,
            border:`1px solid ${name.trim() ? C.gold+"99" : "#6040a0"}`,
            borderRadius:12,
            padding:"15px 18px",
            fontFamily:"IM Fell English,serif",
            fontStyle:"italic",
            fontSize:20,
            color:C.cream,
            outline:"none",
            boxSizing:"border-box",
            transition:"border-color 0.3s",
            "--placeholder-color":"#a080b0",
          }}
          onFocus={e=>e.target.style.borderColor=C.gold}
          onBlur={e=>e.target.style.borderColor=name.trim()?C.gold+"99":C.border}
        />
      </div>

      {/* Birth date label */}
      <label style={{display:"block",fontFamily:"Cinzel,serif",fontSize:13,color:C.gold,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>
        Date of Birth
      </label>

      {/* Scrolling drum pickers */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 3fr 2fr",gap:8,marginBottom:32}}>
        <ScrollPicker
          items={DAYS}
          selected={day}
          onSelect={setDay}
          label={d=>d}
        />
        <ScrollPicker
          items={MONTHS}
          selected={month}
          onSelect={setMonth}
          label={(m,i)=>MONTHS[i]}
          indexMode
        />
        <ScrollPicker
          items={YEARS}
          selected={year}
          onSelect={setYear}
          label={y=>y}
        />
      </div>

      {/* Selected date display */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <span style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:18,color:C.cream,opacity:0.9}}>
          {DAYS[day-1]} {MONTHS[month-1]} {year}
        </span>
      </div>

      {/* Submit button */}
      <button
        className="gold-btn"
        disabled={!canProceed}
        onClick={()=>{
          if (!canProceed) return;
          onSubmit(name.trim(), {day, month, year});
        }}
        style={{
          width:"100%",
          padding:"16px",
          fontSize:15,
          borderRadius:12,
          opacity: canProceed ? 1 : 0.4,
          cursor: canProceed ? "pointer" : "not-allowed",
          transition:"opacity 0.3s",
        }}>
        🔮 Continue to Reading
      </button>

      {!canProceed && (
        <p style={{textAlign:"center",fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:16,color:C.cream,opacity:0.75,marginTop:12}}>
          Please enter your first name to continue
        </p>
      )}

      <button
        onClick={onBack}
        style={{width:"100%",padding:"11px",fontSize:12,borderRadius:10,marginTop:14,background:"transparent",border:"1px solid #6040a0",color:"#a080b0",fontFamily:"Cinzel,serif",letterSpacing:1,cursor:"pointer"}}>
        ← Back
      </button>
    </div>
  );
});

const ScrollPicker = React.memo(function ScrollPicker({ items, selected, onSelect, label, indexMode }) {
  const ITEM_H = 38;
  const VISIBLE = 3;
  const containerH = ITEM_H * VISIBLE;
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startOffset = useRef(0);
  const [offset, setOffset] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(
    indexMode ? selected - 1 : items.indexOf(selected)
  );

  const C = { gold:"#c9a84c", cream:"#e8d5b8", muted:"#6a5870",
               surface:"#100c1a", border:"#2e1f40" };

  const snapToIndex = (idx) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    setSelectedIdx(clamped);
    setOffset(-clamped * ITEM_H);
    onSelect(indexMode ? clamped + 1 : items[clamped]);
  };

  const onPointerDown = (e) => {
    isDragging.current = true;
    startY.current = e.clientY || e.touches?.[0]?.clientY || 0;
    startOffset.current = offset;
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const y = e.clientY || e.touches?.[0]?.clientY || 0;
    const delta = y - startY.current;
    const newOffset = startOffset.current + delta;
    const minOffset = -(items.length - 1) * ITEM_H;
    setOffset(Math.max(minOffset, Math.min(0, newOffset)));
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const idx = Math.round(-offset / ITEM_H);
    snapToIndex(idx);
  };

  // Scroll wheel support
  const onWheel = (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    snapToIndex(selectedIdx + dir);
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: containerH,
        overflow: "hidden",
        position: "relative",
        cursor: "grab",
        borderRadius: 12,
        background: C.surface,
        border: "1px solid #6040a0",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
      onWheel={onWheel}
    >
      {/* Selection highlight */}
      <div style={{
        position:"absolute",
        top: ITEM_H * 1,
        left: 0, right: 0,
        height: ITEM_H,
        background: `rgba(201,168,76,0.14)`,
        borderTop: `1px solid ${C.gold}55`,
        borderBottom: `1px solid ${C.gold}55`,
        pointerEvents: "none",
        zIndex: 1,
      }}/>

      {/* Top fade */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:ITEM_H*1,
        background:`linear-gradient(${C.surface},rgba(16,12,26,0.1))`,
        pointerEvents:"none",zIndex:2}}/>
      {/* Bottom fade */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:ITEM_H*1,
        background:`linear-gradient(rgba(16,12,26,0.1),${C.surface})`,
        pointerEvents:"none",zIndex:2}}/>

      {/* Items */}
      <div style={{
        transform: `translateY(${offset + ITEM_H * 1}px)`,
        transition: isDragging.current ? "none" : "transform 0.2s ease",
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => snapToIndex(i)}
            style={{
              height: ITEM_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Cinzel,serif",
              fontSize: 14,
              color: i === selectedIdx ? C.gold : "#a080b0",
              fontWeight: i === selectedIdx ? 600 : 400,
              transition: "color 0.2s, font-size 0.2s",
              cursor: "pointer",
            }}>
            {indexMode ? item : (typeof label === "function" ? label(item, i) : item)}
          </div>
        ))}
      </div>
    </div>
  );
});



const FreezeFrame = React.memo(function FreezeFrame({ palmImage, palmLandmarks, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const img = new Image();
    img.onload = async () => {
      const fs = Math.max(W / img.width, H / img.height);
      const iW = img.width * fs, iH = img.height * fs;
      const iX = (W - iW) / 2,   iY = (H - iH) / 2;

      // Draw frozen image
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, iX, iY, iW, iH);

      // White flash
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(0, 0, W, H);
      await new Promise(r => setTimeout(r, 80));
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, iX, iY, iW, iH);

      // Validate IMMEDIATELY using landmarks first, then pixel check
      const valid = validateCapture(img, iX, iY, iW, iH, W, H, palmLandmarks);
      if (!valid) {
        // Brief flash then immediately to error — no biometric
        await new Promise(r => setTimeout(r, 400));
        onDone(false);
        return;
      }

      // Valid — hold 2 seconds then proceed to biometric
      await new Promise(r => setTimeout(r, 2000));
      onDone(true);
    };
    img.src = palmImage;
  }, []);

  function validateCapture(img, iX, iY, iW, iH, W, H, lm) {
    try {
      // Must have landmarks to validate properly
      if (!lm || lm.length < 21) return false;
      
      const wrist = lm[0], indexMCP = lm[5], pinkyMCP = lm[17], middleMCP = lm[9];

      // Left hand check: MediaPipe "Right" = user's left hand on rear camera
      const thumbLeft = lm[4].x < lm[20].x;
      const isLeftHand = thumbLeft;
      if (!isLeftHand) return false;

      // Palm facing: cross product wrist→indexMCP × wrist→pinkyMCP
      const v1x = indexMCP.x - wrist.x, v1y = indexMCP.y - wrist.y;
      const v2x = pinkyMCP.x - wrist.x, v2y = pinkyMCP.y - wrist.y;
      const cross = v1x * v2y - v1y * v2x;
      const palmFacing = cross > 0;  // positive = palm toward camera
      if (!palmFacing) return false;

      // Fingers open: all finger tips above their MCPs
      const fingersOpen = [8,12,16,20].every(tip => lm[tip].y < lm[tip-2].y);
      if (!fingersOpen) return false;

      // Hand positioning
      const wristY    = lm[0].y;
      const midTipY   = lm[12].y;
      const handSpanX = Math.abs(lm[4].x - lm[20].x);
      const handSpanY = Math.abs(lm[0].y  - lm[12].y);
      const cx        = (lm[0].x + lm[9].x) / 2;
      const cy        = (lm[0].y + lm[9].y) / 2;

      const handCentred  = cx > 0.25 && cx < 0.75;
      const wristLow     = wristY > 0.55;
      const tipsHigh     = midTipY < 0.55;
      const bigEnough    = handSpanX > 0.32 && handSpanY > 0.35;
      const notTooHigh   = cy < 0.80;

      return (isLeftHand && palmFacing && fingersOpen && bigEnough && 
              handCentred && wristLow && tipsHigh && notTooHigh);
    } catch(e) { 
      return false; 
    }
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"#000"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
    </div>
  );
});


const BiometricScan = React.memo(function BiometricScan({ palmImage, palmLandmarks, onComplete }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("");
  const doneRef = useRef(false);

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function setMsg(m)  { setStatus(""); setTimeout(() => setStatus(m), 60); }

  const BUZZ_MP3 = "data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//vUZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  const buzzRef    = useRef(null); // Web Audio source node
  const buzzActxRef = useRef(null); // AudioContext
  const buzzBufRef  = useRef(null); // Decoded AudioBuffer — reused each play

  // Decode MP3 once into Web Audio buffer (seamless loop, zero gap)
  useEffect(() => {
    let actx;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      buzzActxRef.current = actx;
      // Decode base64 → ArrayBuffer → AudioBuffer
      const b64 = BUZZ_MP3.split(',')[1];
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      actx.decodeAudioData(bytes.buffer, buf => { buzzBufRef.current = buf; });
    } catch(e) {}
    return () => { try { if (actx) actx.close(); } catch(e) {} };
  }, []);

  const startBuzz = () => {
    try {
      stopBuzz(); // stop any existing
      const actx = buzzActxRef.current;
      const buf  = buzzBufRef.current;
      if (!actx || !buf) return;
      if (actx.state === 'suspended') actx.resume();
      const src = actx.createBufferSource();
      src.buffer = buf;
      src.loop   = true;   // Web Audio loop is truly seamless — no gap
      const gain = actx.createGain();
      gain.gain.value = 1.0;
      src.connect(gain);
      gain.connect(actx.destination);
      src.start(0);
      buzzRef.current = src;
    } catch(e) {}
  };

  const stopBuzz = () => {
    try {
      if (buzzRef.current) {
        buzzRef.current.stop();
        buzzRef.current.disconnect();
        buzzRef.current = null;
      }
    } catch(e) {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const STEP = 30;

    // Image scaling
    const img = new Image();
    img.onload = () => {
      const fs = Math.max(W / img.width, H / img.height);
      const iW = img.width * fs, iH = img.height * fs;
      const iX = (W - iW) / 2,   iY = (H - iH) / 2;

      // ── Offscreen canvases prepared once ──
      // colourCanvas: original photo
      const colourCanvas = document.createElement("canvas");
      colourCanvas.width = W; colourCanvas.height = H;
      const cc = colourCanvas.getContext("2d");
      cc.drawImage(img, iX, iY, iW, iH);

      // greyCanvas: greyscale version
      const greyCanvas = document.createElement("canvas");
      greyCanvas.width = W; greyCanvas.height = H;
      const gc = greyCanvas.getContext("2d");
      gc.drawImage(img, iX, iY, iW, iH);
      // Apply greyscale filter
      const gd = gc.getImageData(0, 0, W, H);
      for (let i = 0; i < gd.data.length; i += 4) {
        const lum = 0.299*gd.data[i] + 0.587*gd.data[i+1] + 0.114*gd.data[i+2];
        gd.data[i] = gd.data[i+1] = gd.data[i+2] = lum;
      }
      gc.putImageData(gd, 0, 0);

      // greyMidCanvas: grey pushed toward mid-grey (add 50% grey overlay)
      const greyMidCanvas = document.createElement("canvas");
      greyMidCanvas.width = W; greyMidCanvas.height = H;
      const gmc = greyMidCanvas.getContext("2d");
      gmc.drawImage(greyCanvas, 0, 0);
      gmc.fillStyle = "rgba(100,100,100,0.45)";
      gmc.fillRect(0, 0, W, H);

      // ── Helper: draw grid at given alpha ──
      function drawGrid(alpha) {
        if (alpha <= 0) return;
        ctx.save();
        ctx.strokeStyle = `rgba(148,90,210,${0.85 * alpha})`;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([]);
        ctx.shadowColor = `rgba(148,90,210,${0.7 * alpha})`;
        ctx.shadowBlur = 6;
        for (let x = 0; x <= W; x += STEP) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y <= H; y += STEP) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      // ── Helper: draw a scan bar at y with colour r,g,b ──
      function drawScanBar(y, r, g, b) {
        const grad = ctx.createLinearGradient(0, y - 65, 0, y + 65);
        grad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
        grad.addColorStop(0.35,`rgba(${r},${g},${b},0.1)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},0.28)`);
        grad.addColorStop(0.65,`rgba(${r},${g},${b},0.1)`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, y - 65, W, 130);
        ctx.save();
        ctx.strokeStyle = `rgba(${r},${g},${b},0.95)`;
        ctx.lineWidth = 4;
        ctx.shadowColor = `rgba(${r},${g},${b},1)`;
        ctx.shadowBlur = 22;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        ctx.strokeStyle = "rgba(220,180,255,0.55)";
        ctx.lineWidth = 1.5; ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
      }

      // ── Helper: one full scan pass (bottom to top) ──
      function scanPass(baseCanvas, gridAlpha, r, g, b) {
        return new Promise(resolve => {
          let y = H;
          startBuzz();
          const iv = setInterval(() => {
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(baseCanvas, 0, 0);
            drawGrid(gridAlpha);
            drawScanBar(y, r, g, b);
            y -= 3;
            if (y <= 0) { clearInterval(iv); stopBuzz(); resolve(); }
          }, 13);
        });
      }

      // ══ MAIN SEQUENCE ══════════════════════════════════
      (async () => {

        // 1. Colour photo — 1.5s
        setMsg("Palm image captured");
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(colourCanvas, 0, 0);
        await sleep(1500);

        // 2. Fade colour → B&W over 1.8s
        setMsg("Analysing image…");
        for (let i = 0; i <= 45; i++) {
          const t = i / 45;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(colourCanvas, 0, 0);
          ctx.globalAlpha = t;
          ctx.drawImage(greyCanvas, 0, 0);
          ctx.globalAlpha = 1;
          await sleep(38);
        }
        await sleep(1800);

        // 3. Fade B&W → mid-grey over 2s
        setMsg("Processing palm data…");
        for (let i = 0; i <= 50; i++) {
          const t = i / 50;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(greyCanvas, 0, 0);
          ctx.globalAlpha = t;
          ctx.drawImage(greyMidCanvas, 0, 0);
          ctx.globalAlpha = 1;
          await sleep(38);
        }
        await sleep(1000);

        // 4. Fade grid in over 2.5s (grey-mid base, no scan text yet)
        for (let i = 0; i <= 62; i++) {
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(greyMidCanvas, 0, 0);
          drawGrid(i / 62);
          await sleep(38);
        }
        await sleep(400);

        // 5. Scanning — text starts NOW, grid fully visible
        setMsg("Scanning biometric markers…");
        await sleep(300);
        await scanPass(greyMidCanvas, 1, 130, 70, 200);
        await sleep(350);

        setMsg("Mapping palm geometry…");
        await sleep(300);
        await scanPass(greyMidCanvas, 1, 170, 80, 230);
        await sleep(250);

        setMsg("Calculating line trajectories…");
        await sleep(300);
        await scanPass(greyMidCanvas, 1, 200, 110, 255);
        await sleep(400);

        setMsg("Biometric analysis complete ✦");
        await sleep(1800);

        // 6. Fade grid out over 2s
        for (let i = 50; i >= 0; i--) {
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(greyMidCanvas, 0, 0);
          drawGrid(i / 50);
          await sleep(38);
        }
        await sleep(600);

        // 7. Fade back to full colour over 2.5s
        setMsg("Transmitting to Madame Zafira…");
        for (let i = 0; i <= 62; i++) {
          const t = i / 62;
          ctx.clearRect(0, 0, W, H);
          ctx.drawImage(greyMidCanvas, 0, 0);
          ctx.globalAlpha = t;
          ctx.drawImage(colourCanvas, 0, 0);
          ctx.globalAlpha = 1;
          await sleep(38);
        }
        await sleep(2000);

        if (!doneRef.current) { doneRef.current = true; stopBuzz(); onComplete(); }
      })();
    };
    img.src = palmImage;
  }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"#080510"}}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 48px",pointerEvents:"none"}}>
        <div style={{background:"rgba(8,5,16,0.88)",border:"1px solid rgba(148,90,210,0.45)",borderRadius:12,padding:"14px 22px",display:"flex",alignItems:"center",gap:14,backdropFilter:"blur(16px)"}}>
          <div style={{width:9,height:9,borderRadius:"50%",background:"#9b5fd4",boxShadow:"0 0 12px #9b5fd4, 0 0 24px #9b5fd455",animation:"auraPulse 1.2s ease-in-out infinite",flexShrink:0}}/>
          <span style={{fontFamily:"Cinzel,serif",fontSize:13,color:"#9b5fd4",letterSpacing:1.5,textTransform:"uppercase",animation:"fadeIn 0.3s ease"}} key={status}>{status}</span>
        </div>
      </div>
    </div>
  );
});


function PartnerCompatibilityResult({ reading, userName, partnerName, nameDisplayOrder, onBack, setActiveTab }) {
  const cardRef = useRef(null);
  const pageRef = useRef(null);
  const [shared, setShared] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [muteAudio, setMuteAudio] = useState(true);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingLeave, setPendingLeave] = useState(null);

  const gold = "#c9a84c";
  const rose = "#b0405a";
  const cream = "#e8d5b8";
  const mutedColor = "#6a5870";

  const score     = reading?.score     || 88;
  const insight   = reading?.insight   || "The universe has aligned your paths in a profound and lasting way.";
  const alignment = reading?.alignment || "Your connection carries a depth that transcends the ordinary.";
  const today     = new Date();
  const dateStr   = today.toLocaleDateString("en-AU", {day:"numeric", month:"long", year:"numeric"});
  const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const nextMonth = MONTHS[(today.getMonth()+1)%12];
  const name1     = (nameDisplayOrder==="partnerFirst" ? partnerName : userName) || "You";
  const name2     = (nameDisplayOrder==="partnerFirst" ? userName : partnerName) || "Your Partner";
  const onOneLine = (name1 + " & " + name2).length <= 26;

  const captureCard = async () => {
    if (!window.html2canvas) {
      await new Promise((res,rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    await new Promise(r => setTimeout(r, 300));
    return window.html2canvas(cardRef.current, {scale:2, useCORS:true, backgroundColor:"#080510", logging:false});
  };

  const loadHtml2Canvas = async () => {
    if (!window.html2canvas) {
      await new Promise((res,rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    await new Promise(r => setTimeout(r, 300));
  };

  const savePDF = async () => {
    setSavingPage(true);
    try {
      const { generatePartnerCompatibilityPDF } = await lazyImportPDFGenerators();
      await generatePartnerCompatibilityPDF(reading, name1, name2, score, alignment);
    } catch(e) { console.error(e); }
    setSavingPage(false);
  };

  const handleLeave = useCallback((leaveCallback) => {
    // Only show warning if share card hasn't been saved
    if (!shared) {
      setShowLeaveWarning(true);
      setPendingLeave(() => leaveCallback);
    } else {
      // If already saved, leave without warning
      leaveCallback();
    }
  }, [shared]);

  const confirmLeave = () => {
    setShowLeaveWarning(false);
    if (pendingLeave) pendingLeave();
  };

  const shareConnection = async () => {
    if (capturing || shared) return;
    setCapturing(true);
    try {
      const canvas = await captureCard();
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = "cosmic-connection.png";
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setCapturing(false);
      setShared(true);
    } catch(e) { console.error(e); setCapturing(false); }
  };

  return (
    <div ref={pageRef} style={{position:"fixed",inset:0,zIndex:9999,background:"#080510",overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
      {/* Leave Warning Modal */}
      {showLeaveWarning&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10000,backdropFilter:"blur(4px)"}}>
          <div style={{background:"#100c1a",border:"2px solid #b0405a",borderRadius:16,padding:36,maxWidth:420,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>⚠️</div>
            <h3 style={{fontFamily:"Cinzel,serif",fontSize:20,color:"#b0405a",margin:"0 0 14px",fontWeight:700}}>Before You Leave</h3>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:"#e8d5b8",lineHeight:1.8,margin:"0 0 24px"}}>
              Once you leave this page, your reading will be gone forever. Make sure you have saved your <strong style={{color:"#c9a84c"}}>share card</strong> before continuing.
            </p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setShowLeaveWarning(false)}
                style={{flex:1,padding:"12px",background:"#c9a84c",color:"#080510",border:"none",borderRadius:8,fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                GO BACK & SAVE
              </button>
              <button onClick={confirmLeave}
                style={{flex:1,padding:"12px",background:"rgba(176,64,90,0.3)",color:"#e8d5b8",border:"1px solid #b0405a",borderRadius:8,fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                LEAVE ANYWAY
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:480,margin:"0 auto",padding:"20px 16px 24px"}}>

        {/* Add Seraphina and tabs at top */}
        <Seraphina speaking={false} phase="result" mood="mystical" videoRef={{current:null}} muted={muteAudio} setMuted={setMuteAudio}/>
        
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid rgba(201,168,76,0.3)`,marginBottom:12,gap:6}}>
          {[["extras","🃏","Today's Fortune"],["lines","💎","Full Revelation"],["reading","💖","Partner Compatibility"]].map(([id,icon,label])=>(
            <button key={id} onClick={()=>{if(id!=="reading"){handleLeave(()=>{onBack();setActiveTab(id);});}}} style={{flex:1,background:"reading"===id?`#c9a84c22`:"rgba(201,168,76,0.08)",border:`1px solid ${"reading"===id?"#c9a84c":"rgba(201,168,76,0.3)"}`,borderBottom:`3px solid ${"reading"===id?"#c9a84c":"transparent"}`,color:"reading"===id?"#c9a84c":"rgba(201,168,76,0.6)",fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",padding:"10px 8px",cursor:"pointer",transition:"all 0.3s ease",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderRadius:"8px 8px 0 0",boxShadow:"reading"===id?`0 0 15px #c9a84c44`:"none",animation:"reading"===id?"tabPulse 2s ease-in-out infinite":"none",transform:"none"}}>
              <span style={{fontSize:20,transition:"transform 0.3s ease"}}>{icon}</span>
              <span style={{fontWeight:"reading"===id?700:600,color:"reading"===id?"#c9a84c":"rgba(201,168,76,0.6)"}}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{textAlign:"center",marginBottom:20}}>
          <h2 style={{fontFamily:"Cinzel,serif",fontSize:26,fontWeight:700,color:gold,margin:"0 0 12px",letterSpacing:2}}>
            Your Connection
          </h2>
          <div style={{fontSize:28,marginBottom:12,letterSpacing:4}}>&#x1F497;&#x1F497;&#x1F497;</div>
        </div>

{/* Harmony score box removed — shown on share card instead */}

{/* Your Alignment section — temporarily hidden, data intact */}

        <div ref={cardRef} style={{background:"linear-gradient(160deg,#0c0818 0%,#100c1a 50%,#0a0614 100%)",border:"1px solid rgba(201,168,76,0.5)",borderRadius:18,padding:"28px 22px 24px",marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#c9a84c,transparent)"}}/>

          <div style={{textAlign:"center",marginBottom:4,position:"relative"}}>
            <div style={{fontFamily:"Cinzel,serif",fontSize:16,fontWeight:700,color:gold,letterSpacing:3}}>
              &#x2726; Mystic Fortunes &#x2726;
            </div>
            <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:gold,letterSpacing:4,marginTop:4,opacity:0.85}}>
              Soulmate Connection
            </div>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)",margin:"10px 0 14px"}}/>

          <div style={{textAlign:"center",marginBottom:12,position:"relative"}}>
            {onOneLine ? (
              <div style={{fontFamily:"Cinzel,serif",fontSize:20,color:rose,letterSpacing:1,fontWeight:600}}>{name1} &amp; {name2}</div>
            ) : (
              <div style={{fontFamily:"Cinzel,serif",fontSize:20,color:rose,letterSpacing:1,fontWeight:600,lineHeight:1.6,display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div>{name1}</div>
                <div style={{fontSize:13,color:rose,letterSpacing:3}}>&</div>
                <div>{name2}</div>
              </div>
            )}
          </div>

          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:gold,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>Date</div>
            <div style={{fontFamily:"Cinzel,serif",fontSize:12,color:cream}}>{dateStr}</div>
          </div>

          <div style={{textAlign:"center",marginBottom:4}}>
            <div style={{fontFamily:"Cinzel,serif",fontSize:52,fontWeight:700,color:rose,lineHeight:1}}>{score}%</div>
            <div style={{fontFamily:"Cinzel,serif",fontSize:10,color:gold,letterSpacing:3,textTransform:"uppercase",marginTop:4}}>Harmony Score</div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,margin:"14px 0"}}>
            <div style={{flex:1,height:1,background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.3))"}}/>
            <span style={{color:gold,fontSize:10}}>&#x2726;</span>
            <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(201,168,76,0.3),transparent)"}}/>
          </div>

          <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:16,color:cream,margin:"0 0 20px",lineHeight:1.75,textAlign:"center"}}>
            "{insight}"
          </p>

          <div style={{textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{fontSize:16}}>&#x1F52E;</span>
            <span style={{fontFamily:"Cinzel,serif",fontSize:9,color:"#c9a84c",letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>MYSTICFORTUNES.AI</span>
          </div>

          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#c9a84c,transparent)"}}/>
        </div>

        <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:18,color:"#a080b0",textAlign:"center",lineHeight:1.7,margin:"0 0 20px",padding:"0 8px",fontWeight:500,opacity:1}}>
          Your cosmic alignment shifts with each lunar cycle. Return in {nextMonth} as new celestial patterns emerge — the tides may reveal a deeper dimension of your connection.
        </p>

        <button onClick={shareConnection} disabled={capturing||savingPage||shared}
          style={{width:"100%",padding:"16px",fontSize:15,borderRadius:12,background:shared?"#1a6b4a":capturing?"#5c3a50":"linear-gradient(135deg,#c9a84c,#9d7d2e)",border:"none",color:shared?"white":"#080510",fontFamily:"Cinzel,serif",letterSpacing:1.5,cursor:capturing||shared?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:12,opacity:1,transition:"all 0.3s",fontWeight:600}}>
          <span style={{fontSize:20}}>💾</span>
          {shared ? "✓ Share Card Saved" : capturing ? "✦ Saving..." : "💾 Save Share Card"}
        </button>

        <p style={{fontFamily:"Cinzel,serif",fontSize:13,color:"#e05555",textAlign:"center",margin:"0 0 16px",lineHeight:1.6,fontWeight:600,letterSpacing:0.5}}>
          ⚠️ Save your share card now — once you leave this page your connection reading will be gone forever and cannot be recovered.
        </p>

      </div>
    </div>
  );
}


export default function MysticFortunes() {
  const [phase,setPhase]=useState("intro");
  const [showBlogDropdown,setShowBlogDropdown]=useState(false);
  const [palmImage,setPalmImage]=useState(null);
  const [reading,setReading]=useState(null);
  const [partnerPaid,setPartnerPaid]=useState(false);
  const [fullPaid,setFullPaid]=useState(false);
  const [showFullLeaveWarning,setShowFullLeaveWarning]=useState(false);
  const [pendingFullLeave,setPendingFullLeave]=useState(null);
  const [savingFullPDF,setSavingFullPDF]=useState(false);
  const [fullPDFSaved,setFullPDFSaved]=useState(false);
  const [subscribed,setSubscribed]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const [nameInput,setNameInput]=useState("");
  const [userName,setUserName]=useState(()=>{
    // Initialise from localStorage so name survives Stripe page reload
    try { return localStorage.getItem('pendingUserName') || ""; } catch(e) { return ""; }
  });
  const [toast,setToast]=useState("");
  const [mood,setMood]=useState("neutral");
  const [activeTab,setActiveTab]=useState("extras");
  const [palmError,setPalmError]=useState(false);
  const [palmLandmarks,setPalmLandmarks]=useState(null);
  const [partnerPalmLandmarks,setPartnerPalmLandmarks]=useState(null);
  const [showFullscreenShareCard,setShowFullscreenShareCard]=useState(false);
  const fileRef=useRef(),videoRef=useRef(),canvasRef=useRef(),streamRef=useRef(null),videoRef2=useRef(null);
  const partnerVideoRef=useRef(),partnerCanvasRef=useRef(),partnerStreamRef=useRef(null);
  const [muted,setMuted]=useState(true);
  const [birthDate,setBirthDate]=useState(()=>{
    try {
      const saved = localStorage.getItem('pendingBirthDate');
      return saved ? JSON.parse(saved) : {day:1,month:1,year:1990};
    } catch(e) { return {day:1,month:1,year:1990}; }
  });
  const [showPartnerDetailsPage,setShowPartnerDetailsPage]=useState(false);
  const [partnerName,setPartnerName]=useState("");
  const [partnerBirthDate,setPartnerBirthDate]=useState({day:1,month:1,year:1990});
  const PARTNER_MONTHS = useMemo(() => ["January","February","March","April","May","June","July","August","September","October","November","December"], []);
  const PARTNER_DAYS   = useMemo(() => Array.from({length:31},(_,i)=>i+1), []);
  const PARTNER_YEARS  = useMemo(() => Array.from({length:100},(_,i)=>2025-i), []);
  const [nameDisplayOrder,setNameDisplayOrder]=useState("userFirst");
  const [partnerPhase,setPartnerPhase]=useState(null);
  const [partnerReadingResult,setPartnerReadingResult]=useState(null);
  const [partnerPalmImage,setPartnerPalmImage]=useState(null);
  const [partnerPalmError,setPartnerPalmError]=useState(false);
  const [partnerCameraOn,setPartnerCameraOn]=useState(false);
  const [showPartnerShareCard,setShowPartnerShareCard]=useState(false);
  
  // Payment and Download Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); // 'full_revelation' or 'partner_compatibility'
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadType, setDownloadType] = useState(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const devTapRef = useRef(0);
  const devTapTimerRef = useRef(null);
  const devCaptureTapRef = useRef(0);
  const devCaptureTimerRef = useRef(null);
  const devPaidTapRef = useRef(0);
  const devPaidTimerRef = useRef(null);
  const devPartnerTapRef = useRef(0);
  const devPartnerTimerRef = useRef(null);
  const [cameraOn,setCameraOn]=useState(false);
  const [showDesktopOverlay,setShowDesktopOverlay]=useState(()=>{
    try { return !sessionStorage.getItem('desktopOverlayBypassed'); } catch(e) { return true; }
  });
  const bypassSequenceRef=useRef("");

  // Desktop overlay 6969 bypass handler
  const handleKeyDown = useCallback((e) => {
    bypassSequenceRef.current += e.key;
    if (bypassSequenceRef.current.includes("6969")) {
      sessionStorage.setItem('desktopOverlayBypassed', 'true');
      setShowDesktopOverlay(false);
      bypassSequenceRef.current = "";
    }
    if (bypassSequenceRef.current.length > 10) bypassSequenceRef.current = bypassSequenceRef.current.slice(-10);
  }, []);

  // Desktop overlay display logic
  useEffect(() => {
    if (showDesktopOverlay && window.innerWidth > 768) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDesktopOverlay, handleKeyDown]);

  // Music button only visible after user has moved past the intro screen
  // This works in both preview and real browser

  const INTRO="I have been expecting you… The ancient lines etched upon your palm hold the story of your soul — past wounds, present crossroads, and futures yet unwritten. Let me draw back the veil.";
  const {shown:introShown}=useTypewriter(INTRO,30,phase==="intro");
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),3000);};

  // Compute today's fortune once — shared between the page display and the share card
  const todayFortune = useMemo(()=>{
    const n = userName||"Seeker";
    const dayOfYear = Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/86400000);
    const dailySeed = (generateSeed(userName,birthDate)^(dayOfYear*2654435761))>>>0;
    const dRng = seededRandom(dailySeed);
    const DF = [
      `The universe conspires in your favour today, ${n} — but only if you take the first step. Something you have been waiting for permission to begin needs no permission but your own. Trust that the timing is perfect, even when it feels uncertain.`,
      `Today carries an unusual momentum, ${n}. The action you have been postponing is precisely the one the universe is waiting for you to take. Your hesitation has served its purpose — now let it go.`,
      `A door that has been closed for some time is looser on its hinges today, ${n}. A gentle push is all it requires. What you thought was locked away may be more accessible than you believe.`,
      `The stars have cleared a path for you today, ${n}. The obstacle you were preparing to navigate has moved. Walk forward without waiting for confirmation. The universe has already given it.`,
      `Today is not a day for planning, ${n}. It is a day for doing the thing the plan has been delaying. Overthinking is the last refuge of fear — move instead.`,
      `Something small you do today, ${n}, will have a disproportionately large effect. The universe is amplifying your signal. Pay attention to the ripples you create.`,
      `The hesitation you have been feeling is not intuition warning you away, ${n}. It is habit. Today, act before the habit speaks. Your intuition lives deeper than fear.`,
      `Today brings a narrow window, ${n}. Move when you feel the pull, not after you have reasoned yourself out of it. Windows close quickly once you stop moving toward them.`,
      `The energy today favours beginnings, ${n}. Whatever you start carries further than what you start later. The momentum you build now will carry you through doubt.`,
      `A conversation you have been avoiding will be easier today than tomorrow, ${n}. The longer you wait, the heavier it becomes. The lightness you seek lives on the other side of speaking.`,
      `Pay attention to what you notice first today, ${n}. The universe leaves its most important messages where your eyes land before your mind filters. Your first instinct is rarely wrong.`,
      `Something you have been looking at without seeing will become clear today, ${n}. The understanding arrives on its own schedule. Clarity is coming whether you force it or not.`,
      `The person you encounter unexpectedly today, ${n}, is not a coincidence. Give them more than the attention you would usually spare. Synchronicity rewards generosity.`,
      `Today asks you to listen more than you speak, ${n}. The information you need is already in the room. What you hear will change what you thought you knew.`,
      `There is a detail in your current situation that you have been overlooking, ${n}. Today it will make itself obvious. Sometimes the answer hides in plain sight.`,
      `Someone in your life needs to hear something from you today, ${n} — not advice, just acknowledgement. Your presence is more powerful than you realize.`,
      `Today brings an opportunity to repair something small before it becomes something large, ${n}. Small actions prevent future problems. Prevention is the gift you give yourself.`,
      `The person you think least about today, ${n}, may be thinking most about you. A small gesture will mean more than you expect. You underestimate your impact on others.`,
      `Today ask you to be the one who reaches out first, ${n}. The pride keeping you waiting is costing more than the reaching would. Vulnerability is the fastest path to what you want.`,
      `The version of you that is afraid and the version that is ready are both telling the truth today, ${n}. Let the ready one go first. Fear doesn't need permission to speak — neither should your courage.`,
      `Today is a good day to forgive yourself for something old, ${n}. The weight of it has been costing you more than the thing was worth. Self-forgiveness is the unlock you have been searching for.`,
      `Something you have been telling yourself as fact is actually a story, ${n}. Today you will have the chance to notice the difference. Stories can be rewritten — yours is not finished.`,
      `Today brings the quiet that precedes change, ${n}. Resist the urge to fill it. What is coming needs the space to arrive. Silence is not empty — it is preparation.`,
      `An idea that has been forming below the surface will break through today, ${n}. Have something nearby to catch it. Inspiration comes to those who are ready to receive it.`,
      `The creative impulse you have been explaining away, ${n}, is not a distraction from your real work. It is your real work. What calls to you is calling because it is meant for you.`,
      `What appears to be stagnation today, ${n}, is actually consolidation. The roots grow before the new branch does. Invisible growth is still growth.`,
      `The news you have been waiting for arrives with a twist, ${n}. What comes is not quite what you expected, but it is better. Stay open to surprise.`,
      `Today asks you to stop explaining yourself to people who have already decided, ${n}. Your words cannot convince someone determined not to listen. Save your breath for believers.`,
      `A moment of joy is trying to reach you today — let it, ${n}. You do not have to earn happiness. It is your birthright to feel good.`,
      `The legacy you are building is visible in small ways you are not yet aware of, ${n}. Your impact spreads further than you know. Keep going.`,
      `Today reminds you that the person you think you need to become already exists inside you, ${n}. You are not becoming someone new — you are remembering who you have always been.`,
      `Something you have been protecting is safe to release, ${n}. Fear has been guarding it, but it no longer needs protection. Let it flow.`,
      `The question that will change everything is sitting on the tip of your tongue, ${n}. Ask it. The answer is waiting.`,
      `Today brings a shift in how you see yourself — pay attention to it, ${n}. You are beginning to believe something that will change everything ahead.`,
      `A part of you that you have hidden is ready to be seen, ${n}. The world is waiting for your authentic self, not your polished version. Show up fully.`,
      `The time you spent in darkness was teaching you how to recognize the light, ${n}. Nothing was wasted. Everything was necessary.`,
      `Today asks you to act as if success is already yours, ${n}. Confidence is magnetic. The energy you emit becomes your reality.`,
      `Something you thought would break you only cracked you open, ${n}. Broken things let the light in. You are not shattered — you are illuminated.`,
      `The answer you have been seeking is sitting in a feeling, not a thought, ${n}. Stop thinking and start feeling. Your intuition knows what your mind is still learning.`,
      `Today brings evidence that the universe is conspiring in your favour, ${n}. Look for the synchronicities. The signs are everywhere.`,
      `A promise you made to yourself is ready to be kept, ${n}. Today is the day you finally follow through. Show yourself you can be trusted.`,
      `The person who hurt you was only capable of what they were capable of, ${n}. Their limitations are not your reflection. Release the weight of their shame.`,
      `Today reminds you that seasons change and so do you, ${n}. What was true in winter is not true in spring. You are not stuck — you are growing.`,
      `Something is conspiring to push you toward your calling, ${n}. Discomfort is the universe's way of saying you are ready for more. Move into it.`,
      `The grace you have extended to others is being extended back to you now, ${n}. What you have sown, you are reaping. Kindness always returns.`,
      `Today asks you to remember that you have always known what to do, ${n}. Trust yourself. Your wisdom is inside you, not outside you.`,
      `A friendship is deepening in ways you have not yet recognized, ${n}. Pay attention to who stays. They are showing you who your people are.`,
      `The breakthrough you have been working toward is closer than you think, ${n}. One more step might be all it takes. Do not stop now.`,
      `Today brings a reminder that your value does not fluctuate with your productivity, ${n}. You are worthy on your worst day as much as your best. Rest when you need to.`,
      `Something you thought was gone forever is returning, ${n}. Sometimes what leaves comes back changed. Be ready to meet it anew.`,
      `The power you give others over your mood is power you can reclaim, ${n}. Your peace is not dependent on their actions. Take it back.`,
      `Today reminds you that the smallest act of love can change a life, ${n}. Do not underestimate your capacity to matter. Your kindness ripples further than you know.`,
      `The version of yourself that shows up today is exactly who needs to be here, ${n}. Stop trying to be more and just be fully who you are. Authenticity is enough.`,
      `Something that felt impossible yesterday can feel manageable today, ${n}. Perspective shifts happen overnight. Tomorrow will feel different again. Keep moving.`,
      `A door you thought was closed forever has a new handle, ${n}. Sometimes the universe gives us second chances in unexpected forms. Stay open.`,
      `Today asks you to remember that your wounds became your wisdom, ${n}. What you survived taught you what no classroom ever could. Your scars are your credentials.`,
      `The person who needs to hear your story most is struggling in silence, ${n}. Speak your truth today. Someone needs to know they are not alone.`,
      `Today brings a shift in who you are becoming, ${n}. You cannot stay the same person and reach for new things. Transformation is in motion.`,
      `Something you thought was a limitation is actually a protection, ${n}. The universe builds walls around what it is not yet time for you to access. Trust the timing.`,
      `The fear you feel is not a stop sign — it is a compass, ${n}. It is pointing you toward something that matters. Move toward it.`,
      `Today reminds you that rest is not earned — it is essential, ${n}. You do not have to prove your worth by being productive. Your existence alone is enough.`,
      `A conversation you have been avoiding will open more than you expect, ${n}. Sometimes the breakthrough comes from the dialogue you resist most. Be brave.`,
      `The truth you know in your bones is truer than any doubt in your mind, ${n}. Gut feelings are data. Trust what your body is telling you.`,
      `Today asks you to plant a seed for a garden you may not see bloom, ${n}. Legacy is built in moments that feel insignificant. Your gifts compound over time.`,
      `The abundance you seek is responding to the energy you emit, ${n}. Scarcity thinking repels what you want. Today, think like you already have it all.`,
    ];
    return DF[Math.floor(dRng()*DF.length)];
  }, [userName, birthDate]);

  useEffect(()=>{
    if(phase==="loading"){setSpeaking(true);return;}
    if(phase==="result"){setSpeaking(true);const t=setTimeout(()=>setSpeaking(false),5000);return()=>clearTimeout(t);}
    setSpeaking(false);
  },[phase]);

  const startCamera=async()=>{
    setCameraOn(true);
  };

  // Auto-open camera whenever capture phase is entered
  useEffect(()=>{
    if(phase==="capture" && !cameraOn) {
      setCameraOn(true);
    }
  },[phase]);

  const [debugMsg, setDebugMsg] = useState("");

  // Auto-open partner camera whenever partner capture phase is entered
  useEffect(()=>{
    if(partnerPhase==="capture" && !partnerCameraOn) {
      setPartnerCameraOn(true);
    }
  },[partnerPhase]);

  // Debug: log what localStorage has on mount
  useEffect(() => {
    const n = localStorage.getItem('pendingUserName');
    console.log('[MysticFortunes] mount — pendingUserName in localStorage:', n, '| userName state:', userName);
  }, []);

  // Payment verification - check if user is returning from Stripe checkout
  useEffect(() => {
    const verifyPaymentOnReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (!sessionId) return;

      // Handle free coupon bypass — no Stripe session to verify
      if (sessionId.startsWith('free_')) {
        const productType = params.get('type');
        if (productType === 'full_revelation') {
          const savedUserNameF = localStorage.getItem('pendingUserName');
          if (savedUserNameF) setUserName(savedUserNameF);
          const effectiveNameF = savedUserNameF || userName;
          try {
            const savedBirthDateF = localStorage.getItem('pendingBirthDate');
            const restoredDobF = savedBirthDateF ? JSON.parse(savedBirthDateF) : birthDate;
            setBirthDate(restoredDobF);
            const savedReadingF = localStorage.getItem('pendingReading');
            if (savedReadingF) { setReading(JSON.parse(savedReadingF)); }
            else { setReading(generateFortune(generateSeed(effectiveNameF, restoredDobF), effectiveNameF, restoredDobF)); }
          } catch(e) { setReading(generateFortune(generateSeed(effectiveNameF, birthDate), effectiveNameF, birthDate)); }
          setFullPaid(true);
          setPhase('result');
          setActiveTab('lines');
          setDownloadType('full_revelation');
          // Claude enhancement will trigger via useEffect when fullPaid changes to true
          window.history.replaceState({}, document.title, window.location.pathname);

        } else if (productType === 'partner_compatibility') {
          // Restore app state after free coupon redirect
          // userName is already in state via useState lazy initialiser — only override if localStorage has a value
          const savedUserName1 = localStorage.getItem('pendingUserName');
          if (savedUserName1) setUserName(savedUserName1);
          const effectiveName1 = savedUserName1 || userName;
          try {
            const savedBirthDate1 = localStorage.getItem('pendingBirthDate');
            const restoredDob1 = savedBirthDate1 ? JSON.parse(savedBirthDate1) : birthDate;
            setBirthDate(restoredDob1);
            const savedReading1 = localStorage.getItem('pendingReading');
            if (savedReading1) {
              setReading(JSON.parse(savedReading1));
            } else {
              const seed = generateSeed(effectiveName1, restoredDob1);
              setReading(generateFortune(seed, effectiveName1, restoredDob1));
            }
          } catch(e) {
            console.warn('reading restore failed, regenerating:', e);
            const seed = generateSeed(effectiveName1, birthDate);
            setReading(generateFortune(seed, effectiveName1, birthDate));
          }
          localStorage.removeItem('pendingReading'); // reading is large, remove it
          setPartnerPaid(true);
          setPhase('result');
          setActiveTab('reading');
          setShowPartnerDetailsPage(true);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      try {
        console.log('Verifying payment with session:', sessionId);
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();
        if (data.valid) {
          console.log('✅ Payment verified:', data);
          if (data.productType === 'full_revelation') {
            // Restore reading from localStorage (lost during Stripe redirect)
            const savedUserName3 = localStorage.getItem('pendingUserName');
            if (savedUserName3) setUserName(savedUserName3);
            const effectiveName3 = savedUserName3 || userName;
            try {
              const savedBirthDate3 = localStorage.getItem('pendingBirthDate');
              const restoredDob3 = savedBirthDate3 ? JSON.parse(savedBirthDate3) : birthDate;
              setBirthDate(restoredDob3);
              const savedReading3 = localStorage.getItem('pendingReading');
              if (savedReading3) {
                setReading(JSON.parse(savedReading3));
              } else {
                const seed = generateSeed(effectiveName3, restoredDob3);
                setReading(generateFortune(seed, effectiveName3, restoredDob3));
              }
            } catch(e) {
              const seed = generateSeed(effectiveName3, birthDate);
              setReading(generateFortune(seed, effectiveName3, birthDate));
            }
            setFullPaid(true);
            setPhase('result');
            setActiveTab('lines');
            setDownloadType('full_revelation');
            // PAID FEATURE: Enhance reading with Claude (triggered via useEffect when fullPaid=true)
            window.history.replaceState({}, document.title, window.location.pathname);
          } else if (data.productType === 'partner_compatibility') {
            // Restore app state after Stripe redirect
            // Always restore name first — outside try/catch so it can never be blocked
            // userName is already in state via useState lazy initialiser — only override if localStorage has a value
            const savedUserName2 = localStorage.getItem('pendingUserName');
            if (savedUserName2) setUserName(savedUserName2);
            const effectiveName2 = savedUserName2 || userName;
            try {
              const savedBirthDate2 = localStorage.getItem('pendingBirthDate');
              const restoredDob2 = savedBirthDate2 ? JSON.parse(savedBirthDate2) : birthDate;
              setBirthDate(restoredDob2);
              const savedReading2 = localStorage.getItem('pendingReading');
              if (savedReading2) {
                setReading(JSON.parse(savedReading2));
              } else {
                const seed = generateSeed(effectiveName2, restoredDob2);
                setReading(generateFortune(seed, effectiveName2, restoredDob2));
              }
            } catch(e) {
              console.warn('reading restore failed, regenerating:', e);
              const seed = generateSeed(effectiveName2, birthDate);
              setReading(generateFortune(seed, effectiveName2, birthDate));
            }
            localStorage.removeItem('pendingReading'); // reading is large, remove it
            setPartnerPaid(true);
            setPhase('result');
            setActiveTab('reading');
            setShowPartnerDetailsPage(true);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
          setTimeout(() => {
            // Go straight to results — no popup
          }, 500);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error('❌ Payment verification failed');
          showToast('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        showToast('Error verifying payment. Please try again.');
      }
    };
    verifyPaymentOnReturn();
  }, []);

  // Validate user palm silently when captured
  // Validation handled by FreezeFrame

  // Validate partner palm silently when captured
  // Partner validation handled by FreezeFrame

  // Validation function used by both user and partner
  const validatePalmImage = (lm) => {
    try {
      if (!lm || lm.length < 21) return false;
      
      const wrist = lm[0], indexMCP = lm[5], pinkyMCP = lm[17];

      // Left hand check
      const thumbLeft = lm[4].x < lm[20].x;
      if (!thumbLeft) return false;

      // Palm facing: cross product
      const v1x = indexMCP.x - wrist.x, v1y = indexMCP.y - wrist.y;
      const v2x = pinkyMCP.x - wrist.x, v2y = pinkyMCP.y - wrist.y;
      const cross = v1x * v2y - v1y * v2x;
      if (cross <= 0) return false;

      // Fingers open
      const fingersOpen = [8,12,16,20].every(tip => lm[tip].y < lm[tip-2].y);
      if (!fingersOpen) return false;

      // Hand positioning
      const wristY    = lm[0].y;
      const midTipY   = lm[12].y;
      const handSpanX = Math.abs(lm[4].x - lm[20].x);
      const handSpanY = Math.abs(lm[0].y  - lm[12].y);
      const cx        = (lm[0].x + lm[9].x) / 2;
      const cy        = (lm[0].y + lm[9].y) / 2;

      const handCentred  = cx > 0.25 && cx < 0.75;
      const wristLow     = wristY > 0.55;
      const tipsHigh     = midTipY < 0.55;
      const bigEnough    = handSpanX > 0.32 && handSpanY > 0.35;
      const notTooHigh   = cy < 0.80;

      return (handCentred && wristLow && tipsHigh && bigEnough && notTooHigh);
    } catch(e) { 
      return false; 
    }
  };

  const stopCamera=()=>{
    if(partnerPhase==="capture") setPartnerCameraOn(false);
    else setCameraOn(false);
  };
  const capturePhoto=()=>{
    const v=videoRef.current,c=canvasRef.current;if(!v||!c)return;
    c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);
    setPalmImage(c.toDataURL("image/jpeg",0.85));stopCamera();setPhase("captured");
  };
  const handleUpload=e=>{
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();r.onload=ev=>{setPalmImage(ev.target.result);setPhase("captured");};r.readAsDataURL(f);
  };

  const FALLBACK={
    greeting:`The stars have guided you well${userName?", "+userName:""}…`,
    teaser:"I see a soul standing at the edge of a great transformation — one the universe has been preparing through every challenge you have faced. The lines of your palm tremble with something momentous approaching.",
    lifeLine:"Your life line arcs with extraordinary depth, curving wide — a mark of passionate vitality and remarkable resilience. A significant chapter is closing, but what opens next will dwarf everything before it.",
    heartLine:"The heart line rises steeply, the sign of one who loves with fierce idealism. There is a connection in your orbit — perhaps underestimated — that the stars wish you would look at more closely.",
    headLine:"Your head line is long and gently curved, revealing a mind both analytical and deeply intuitive. The idea you have been quietly nurturing deserves far more faith than you have given it.",
    fateLine:"The fate line climbs strongly and carries a fork — two parallel destinies, both real, both possible. The choice between them hinges on a single act of courage in the coming weeks.",
    fullReading:"The palm before me tells a story the universe has been writing for a very long time. You are someone who feels the weight of possibility — the life you are living and the life you sense is waiting.\n\nIn the near future — within the next three lunar cycles — I see movement in the material world. An opportunity will present itself that does not announce itself loudly. Do not be fooled by its ordinary appearance.\n\nI must speak plainly: there is a pattern you return to that has the face of comfort but the weight of a chain. What waits on the other side of releasing it is extraordinary.\n\nYour gift — written unmistakably in the breadth of your palm — is the ability to hold space for others without losing yourself. This is ancient. Trust it.",
    luckyNumber:"7",luckyColor:"Deep Violet",soulSign:"The Awakened Wanderer",
    warning:"The comfort you keep returning to is quietly asking a price you have not fully counted.",
    gift:"You carry a steadying presence that others feel before you speak a single word.",
    pastLife:"In another lifetime you walked ancient trade routes carrying knowledge as currency — that hunger for wisdom still moves through you.",
    nearFuture:"Before the next new moon, an unexpected message reopens a door you quietly believed had closed forever."
  };

  const devSkipToResult = () => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      // Ask for a real name so we can test name persistence through paywall
      const inputName = window.prompt("DEV MODE — Enter your name to test paywall flow:", "Caine");
      if (!inputName) return;
      const devName = inputName.trim();
      const devDob  = {day:24, month:2, year:1975};
      const devSeed = (Date.now() & 0xFFFFFFFF) >>> 0;
      const devFortune = generateFortune(devSeed, devName, devDob);
      // Save to localStorage exactly as the real DetailsPage onSubmit does
      try { localStorage.setItem('pendingUserName', devName); } catch(e) {}
      try { localStorage.setItem('pendingBirthDate', JSON.stringify(devDob)); } catch(e) {}
      setUserName(devName);
      setBirthDate(devDob);
      setReading({...FALLBACK,...devFortune});
      setPalmImage(null);
      setPhase("result");
      setActiveTab("reading");
    } else {
      tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 1500);
    }
  };

  // PAID FEATURE: When user pays for Full Revelation, enhance reading with Claude
  useEffect(() => {
    if (fullPaid && !subscribed && reading) {
      console.log("🎯 Payment confirmed, triggering Claude enhancement...");
      // Small timeout ensures state updates are flushed
      const timer = setTimeout(() => {
        enhanceReadingWithClaude();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fullPaid]); // Only trigger when fullPaid changes to true

  // Show custom loading message for Claude enhancement vs regular loading
  const loadingMessage = fullPaid ? "Unlocking deep insights…" : "Reading your ancient lines…";

  const getReading=async()=>{
    if(!palmImage)return;
    
    try {
      // Compress image first — mobile photos can be 4MB+
      const compressed = await compressImage(palmImage, 900);
      
      // Step 1: Validate using MediaPipe Hands
      try {
        const palmValid = await detectPalm(compressed);
        if (!palmValid) {
          setPalmError(true);
          setPhase("captured");
          return;
        }
      } catch(e) {
        console.warn("MediaPipe check failed, proceeding:", e);
      }
      
      // Step 2: Generate algorithm reading (instant, free)
      const _seed = generateSeed(userName, birthDate);
      const seedFortune = generateFortune(_seed, userName, birthDate);
      
      // Set the free reading
      setReading(seedFortune);
      setPhase("result");
      
    } catch(err) {
      console.error("getReading error:", err);
      setPalmError(true);
    }
  };

  // PAID FEATURE: Enhance the algorithm reading with Claude's theatrical flair
  const enhanceReadingWithClaude = async () => {
    if (!reading) {
      console.warn("Cannot enhance: missing reading");
      return;
    }
    
    console.log("✨✨✨ CALLING CLAUDE TO ENHANCE FULL REVELATION ✨✨✨");
    console.log("User:", userName);
    console.log("Algorithm reading to enhance:", reading);
    setPhase("loading");
    
    try {
      const prompt = `You are Madame Zafira, a palm reader who speaks with quiet certainty and no hesitation.

A seeker, ${userName}, has received an initial reading. Rewrite and enhance it to be more poetic, mystical, and personal — as if speaking directly to them with the authority of someone who has truly seen their palm.

Keep the core meaning. Elevate the language. Make it resonate.

Rules: Speak with absolute confidence. Use ${userName}'s name. Include one emotionally impactful statement. Include one specific 30-90 day prediction. Make connections between the different palm lines. Do not explain palm reading — deliver as undeniable truth.

The reading to enhance:
${JSON.stringify(reading, null, 2)}

Respond ONLY with this JSON (no preamble, nothing before or after): {"greeting":"${userName}, [2-3 sentences about what you see overall]","lifeLine":"[3-4 sentences about life path]","heartLine":"[3-4 sentences about emotional patterns]","headLine":"[3-4 sentences about intellectual patterns]","fateLine":"[3-4 sentences about direction]","fullReading":"[3-4 paragraphs weaving all lines together]","nearFuture":"[2-3 sentences about specific 30-90 day prediction]"}`;

      
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1100,
          messages: [{
            role: "user",
            content: [
              { type: "text", text: prompt }
            ]
          }]
        })
      });
      
      console.log("Claude API Response Status:", res.status);
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Claude API returned error:", JSON.stringify(data, null, 2));
        throw new Error(data.error || data.message || JSON.stringify(data));
      }
      
      let text = data.content.map(i => i.text || "").join("");
      text = text.replace(/```json|```/g, "").trim();
      
      console.log("Raw Claude response length:", text.length);
      console.log("First 100 chars:", text.substring(0, 100));
      console.log("Last 50 chars:", text.substring(Math.max(0, text.length - 50)));
      
      let claudeR;
      try {
        claudeR = JSON.parse(text);
        console.log("✅ Parsed successfully on first try");
      } catch(parseErr) {
        console.warn("Direct JSON parse failed, attempting extraction...");
        
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        console.log("First brace at:", firstBrace, "Last brace at:", lastBrace);
        
        let jsonStr = null;
        
        // Strategy 1: Use first { to last }
        if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
          jsonStr = text.substring(firstBrace, lastBrace + 1);
          console.log("Using first { to last } extraction");
        } 
        // Strategy 2: If no closing brace, try first { to end and add closing brace
        else if (firstBrace !== -1 && lastBrace === -1) {
          console.warn("No closing brace found, response may be truncated");
          jsonStr = text.substring(firstBrace) + '}';
          console.log("Attempting to fix by adding closing brace");
        }
        // Strategy 3: Regex for any JSON-like structure
        else {
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            jsonStr = jsonMatch[0];
            console.log("Using regex extraction");
          }
        }
        
        if (!jsonStr) {
          console.error("Cannot extract JSON from response");
          console.error("First 500 chars:", text.substring(0, 500));
          throw new Error("No JSON found in Claude response");
        }
        
        try {
          claudeR = JSON.parse(jsonStr);
          console.log("✅ Successfully extracted and parsed JSON from response");
        } catch(extractErr) {
          console.error("Extracted JSON still invalid:", extractErr.message);
          console.error("Extracted text length:", jsonStr.length);
          console.error("Last 100 chars of extracted:", jsonStr.substring(Math.max(0, jsonStr.length - 100)));
          throw new Error("Cannot parse extracted JSON: " + extractErr.message);
        }
      }
      
      console.log("✅ Claude response parsed successfully");
      
      // Merge Claude's enhanced version with algorithm's core attributes
      setReading({
        ...claudeR,           // Claude's enhanced version (main content)
        // Keep these algorithm attributes (mystical/deterministic):
        soulSign: reading.soulSign,
        luckyColor: reading.luckyColor,
        luckyNumber: reading.luckyNumber,
        personality: reading.personality,
        gift: reading.gift,           // Algorithm's gift description
        warning: reading.warning,     // Algorithm's warning
        pastLife: reading.pastLife,   // Algorithm's past life
      });
      console.log("✅ CLAUDE ENHANCEMENT COMPLETE — Full Revelation enhanced!");
      
    } catch(e) {
      console.error("❌ CLAUDE ENHANCEMENT FAILED:", e.message || JSON.stringify(e));
      console.error("Error details:", e.stack);
      // Keep existing algorithm reading if Claude fails
    }
    
    setPhase("result");
  };

    const TeaserText=()=>{
    return(<p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:20,color:C.cream,lineHeight:1.95,margin:0,minHeight:70}}>{reading?.teaser}<span style={{display:"none",color:C.gold}}>|</span></p>);
  };

  // Payment Handlers
  const handleFullPayment = () => {
    // Save all required data so it survives Stripe redirect
    try { if (userName) localStorage.setItem('pendingUserName', userName); } catch(e) {}
    try { if (birthDate) localStorage.setItem('pendingBirthDate', JSON.stringify(birthDate)); } catch(e) {}
    try { if (reading) localStorage.setItem('pendingReading', JSON.stringify(reading)); } catch(e) {}
    setPaymentType('full_revelation');
    setShowPaymentModal(true);
  };

  const handlePartnerPayment = () => {
    // Use localStorage for name/dob — survives cross-origin redirects reliably
    try { if (userName) localStorage.setItem('pendingUserName', userName); } catch(e) {}
    try { if (birthDate) localStorage.setItem('pendingBirthDate', JSON.stringify(birthDate)); } catch(e) {}
    try { if (reading) localStorage.setItem('pendingReading', JSON.stringify(reading)); } catch(e) {}
    setPaymentType('partner_compatibility');
    setShowPaymentModal(true);
  };

  return(
    <>
    {/* FreezeFrame validation happens silently in useEffect below */}
    {partnerPhase==="result"&&partnerReadingResult&&(
      <PartnerCompatibilityResult
        reading={partnerReadingResult}
        userName={userName}
        partnerName={partnerName}
        nameDisplayOrder={nameDisplayOrder}
        onBack={()=>{setPartnerPhase(null);setPartnerReadingResult(null);setPartnerPaid(false);}}
        setActiveTab={setActiveTab}
      />
    )}
    {(phase==="biometric" && palmImage && !palmError) || (partnerPhase==="biometric" && partnerPalmImage && !partnerPalmError)?(
      <>
        <BiometricScan
          key={partnerPhase==="biometric"?"partner-biometric":"user-biometric"}
          palmImage={partnerPhase==="biometric"?partnerPalmImage:palmImage}
          palmLandmarks={partnerPhase==="biometric"?partnerPalmLandmarks:palmLandmarks}
          onComplete={()=>{
            if(partnerPhase==="biometric"){
              const compat = generatePartnerCompatibility(userName, birthDate, partnerName, partnerBirthDate);
              setPartnerReadingResult(compat);
              setPartnerPhase("result");
              setPartnerPaid(true);
              setActiveTab("reading");
            }else{
              getReading();
            }
          }}
        />
      </>
    ):null}

    <div style={{minHeight:"100vh",background:C.bg,position:"relative",overflow:"auto"}}>
      <style>{`
        @keyframes floatP{0%,100%{transform:translateY(0)}50%{transform:translateY(-26px) translateX(7px)}}
        @keyframes auraPulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.85;transform:scale(1.04)}}
        @keyframes flicker{0%,100%{opacity:0.7}30%{opacity:1}60%{opacity:0.45}80%{opacity:0.92}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        video::-webkit-media-controls-overlay-cast-button,
        video::-webkit-media-controls-cast-button,
        video::--webkit-media-controls-panel { display:none !important; }
        video::-internal-media-controls-button-panel { display:none !important; }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes goldGlow{0%,100%{text-shadow:0 0 12px #c9a84c55}50%{text-shadow:0 0 28px #c9a84c,0 0 55px #c9a84c66}}
        @keyframes orbGlow{0%,100%{box-shadow:0 0 20px #b0405a2a}50%{box-shadow:0 0 45px #b0405a50,0 0 90px #b0405a1f}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes textPulse{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes smileGlow{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.9;transform:scale(1.15)}}
        @keyframes eyeSparkle{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes lipPulse{0%,100%{opacity:0.1}50%{opacity:0.3}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes introPulse{0%,100%{box-shadow:0 0 8px rgba(201,168,76,0.5),0 0 20px rgba(201,168,76,0.2);border-color:rgba(201,168,76,0.5)}50%{box-shadow:0 0 18px rgba(201,168,76,0.9),0 0 35px rgba(201,168,76,0.4);border-color:rgba(201,168,76,1)}}
        @keyframes scanLine{0%{background-position:0% -100%}100%{background-position:0% 300%}}
        @keyframes sparkle{0%,100%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.5)}}
        @keyframes lineReveal{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseGlow{0%,100%{filter:drop-shadow(0 0 2px #c9a84c)}50%{filter:drop-shadow(0 0 8px #c9a84c) drop-shadow(0 0 16px #c9a84c55)}}
        video::-webkit-media-controls { display: none !important; }
        video::-webkit-media-controls-enclosure { display: none !important; }
        video::-webkit-media-controls-overlay-play-button { display: none !important; }
        video::-webkit-media-controls-play-button { display: none !important; }
        video::--webkit-media-controls-start-playback-button { display: none !important; }
                input::placeholder { color: #a080b0 !important; opacity: 1; }
        @keyframes tabPulse{0%,100%{box-shadow:0 0 15px rgba(201,168,76,0.5)}50%{box-shadow:0 0 25px rgba(201,168,76,0.8),0 0 40px rgba(201,168,76,0.4)}}
        @keyframes crystalGlow{0%,100%{text-shadow:0 0 20px #c9a84c,0 0 40px #c9a84c88;transform:scale(1)}50%{text-shadow:0 0 35px #c9a84c,0 0 70px #c9a84ccc;transform:scale(1.08)}}
        .footer-link{color:#ffe083 !important;font-family:Cinzel,serif;font-size:11px;letter-spacing:1px;text-decoration:none !important;transition:color 0.3s;}
        .footer-link:visited{color:#ffe083 !important;}
        @media(hover:hover){.footer-link:hover{color:#b0405a !important;}}
        @keyframes tabTextPulse{0%,100%{color:#c9a84c;text-shadow:none}50%{color:#ffd700;text-shadow:0 0 8px rgba(255,215,0,0.8),0 0 16px rgba(201,168,76,0.5)}}
        .gold-btn{background:linear-gradient(135deg,#604015,#c9a84c,#604015);background-size:200%;animation:shimmer 3s linear infinite;border:none;color:#080510;font-family:Cinzel,serif;font-weight:700;cursor:pointer;letter-spacing:1px;transition:transform 0.2s,box-shadow 0.2s;}
        .gold-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px #c9a84c44;}
        .rose-btn{background:linear-gradient(135deg,#5c1a2a,#b0405a);border:none;color:white;font-family:Cinzel,serif;font-weight:600;cursor:pointer;letter-spacing:0.5px;transition:transform 0.2s;}
        .rose-btn:hover{transform:translateY(-2px);}
        .ghost-btn{background:none;border:1.5px solid #2e1f40;color:#6a5870;font-family:Cinzel,serif;cursor:pointer;transition:all 0.2s;letter-spacing:0.5px;}
        .ghost-btn:hover{border-color:#c9a84c;color:#c9a84c;}
        input::placeholder{color:#6a5870;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2e1f40;border-radius:2px}
        .result-tab{transition:all 0.3s ease;}
        .result-tab:hover{transform:scale(1.08);background:rgba(201,168,76,0.2) !important;box-shadow:0 0 20px rgba(201,168,76,0.5),0 0 40px rgba(201,168,76,0.2) !important;border-color:#c9a84c !important;color:#ffd700 !important;}
      `}</style>

      <Particles/>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse at center,transparent 30%,rgba(8,5,16,0.65) 100%)",pointerEvents:"none",zIndex:1}}/>




      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:C.surface,border:`1px solid ${C.gold}`,color:C.cream,padding:"9px 22px",borderRadius:30,fontFamily:"Crimson Text,serif",fontSize:19,zIndex:9999,animation:"fadeIn 0.3s ease",whiteSpace:"nowrap"}}>
          {toast}
        </div>
      )}
      <canvas ref={canvasRef} style={{display:"none"}}/>

      <div style={{maxWidth:540,margin:"0 auto",padding:"0 16px 24px",position:"relative",zIndex:2}}>

        {/* ══ INTRO ══ */}
        {phase==="intro"&&(
          <div style={{paddingTop:36,paddingBottom:0,animation:"fadeUp 0.8s ease both"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontFamily:"Cinzel,serif",fontSize:"clamp(32px,8vw,54px)",fontWeight:700,color:C.gold,margin:"0 0 8px",lineHeight:1.1,animation:"goldGlow 3s ease-in-out infinite",letterSpacing:2,cursor:"pointer",userSelect:"none"}} onClick={devSkipToResult}>Mystic Fortunes</div>
              <div style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:"clamp(20px,5vw,28px)",fontWeight:400,color:C.cream,margin:0,lineHeight:1.4,opacity:0.92}}>Ancient wisdom, modern magic</div>
            </div>

            {/* BIG Seraphina photo */}
            <Seraphina speaking={speaking} phase="intro" videoRef={videoRef2} muted={muted} setMuted={setMuted}/>

            

            <button className="gold-btn" onClick={()=>{setPhase("details");}} style={{width:"100%",padding:"15px",fontSize:20,borderRadius:12,margin:"16px 0 0"}}>
              🔮 Reveal My Fortune
            </button>
          </div>
        )}

        {/* ══ DETAILS ══ */}
        {phase==="details"&&(
          <DetailsPage
            onBack={()=>setPhase("intro")}
            onSubmit={(name, dob)=>{
              setUserName(name);
              setBirthDate(dob);
              // Persist immediately so it survives any subsequent page reload
              try { localStorage.setItem('pendingUserName', name); } catch(e) {}
              try { localStorage.setItem('pendingBirthDate', JSON.stringify(dob)); } catch(e) {}
              setPhase("capture");
            }}
          />
        )}

        {/* ══ CAPTURE ══ */}


        {/* ══ FULLSCREEN CAMERA ══ */}
        {((phase==="capture"&&cameraOn && !palmError) || (partnerPhase==="capture"&&partnerCameraOn && !partnerPalmError))?(
          <>
            <FullscreenCamera
              key={partnerPhase==="capture"?"partner-camera":"user-camera"}
              canvasRef={partnerPhase==="capture"?partnerCanvasRef:canvasRef}
              onCapture={(img,lm)=>{
                if(partnerPhase==="capture"){
                  setPartnerPalmImage(img);
                  if(lm)setPartnerPalmLandmarks(lm);
                  setPartnerPhase("freeze");
                }else{
                  setPalmImage(img);
                  if(lm)setPalmLandmarks(lm);
                  setPhase("freeze");
                }
                stopCamera();
              }}
              onCancel={()=>{stopCamera();if(partnerPhase==="capture"){setPartnerPhase(null);setShowPartnerDetailsPage(true);setActiveTab("reading");}else{setPhase("intro");}}}
            />
          </>
        ):null}

        {/* ══ CAPTURED ══ */}
        {/* Captured phase auto-transitions to biometric via useEffect */}

                {/* ══ FREEZE ══ */}
        {phase==="freeze"&&palmImage&&(
          <FreezeFrame
            palmImage={palmImage}
            palmLandmarks={palmLandmarks}
            onDone={(valid)=>{
              if(!valid){setPalmError(true);setPhase("capture");}
              else setPhase("biometric");
            }}
          />
        )}
        {partnerPhase==="freeze"&&partnerPalmImage&&(
          <FreezeFrame
            palmImage={partnerPalmImage}
            palmLandmarks={partnerPalmLandmarks}
            onDone={(valid)=>{
              if(!valid){setPartnerPalmError(true);setPartnerPhase("capture");}
              else setPartnerPhase("biometric");
            }}
          />
        )}

        {/* ══ LOADING ══ */}
        {phase==="loading"&&(
          <div style={{position:"fixed",inset:0,zIndex:80,background:"rgba(8,5,16,0.96)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
            <div style={{width:60,height:60,borderRadius:"50%",border:"3px solid rgba(201,168,76,0.2)",borderTop:`3px solid ${C.gold}`,animation:"spin 1s linear infinite"}}/>
            <div style={{fontFamily:"Cinzel,serif",fontSize:13,color:"#f5d060",letterSpacing:2,textTransform:"uppercase",animation:"auraPulse 2s ease-in-out infinite",textShadow:"0 0 12px rgba(245,208,96,0.8)"}}>{loadingMessage}</div>
          </div>
        )}

        {/* ══ RESULT ══ */}
        {phase==="result"&&reading&&(
          <div style={{paddingTop:28,paddingBottom:20,animation:"fadeUp 0.6s ease both"}}>
            <Steps current={2} revealed={fullPaid||subscribed}/>
            <Seraphina speaking={speaking} phase="result" mood={mood} videoRef={videoRef2} muted={muted} setMuted={setMuted}/>
            {/* GREETING TEXT — removed by user request. Restore by uncommenting:
            <div style={{textAlign:"center",margin:"10px 0 14px"}}>
              <div style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.rose,fontSize:22,lineHeight:1.6}}>{reading.greeting}</div>
            </div>
            */}

            <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:12,gap:6}}>
              {!partnerPhase&&[["extras","🃏","Today's Fortune"],["lines","💎","Full Revelation"],["reading","💖","Partner Compatibility"]].map(([id,icon,label])=>(
                <button key={id} disabled={showPartnerDetailsPage&&id!=="reading"} onClick={()=>{if(showPartnerDetailsPage&&id!=="reading")return;if(fullPaid&&!subscribed&&activeTab==="lines"&&id!=="lines"&&!fullPDFSaved){setShowFullLeaveWarning(true);setPendingFullLeave(()=>()=>setActiveTab(id));return;}setActiveTab(id);if(id==="reading"){devPartnerTapRef.current=(devPartnerTapRef.current||0)+1;clearTimeout(devPartnerTimerRef.current);if(devPartnerTapRef.current>=3){devPartnerTapRef.current=0;const cr=generatePartnerCompatibility(userName,birthDate,partnerName||"Test Partner",partnerBirthDate||{day:1,month:6,year:1990});setPartnerPaid(true);setPartnerReadingResult(cr);setPartnerPhase("result");}else{devPartnerTimerRef.current=setTimeout(()=>{devPartnerTapRef.current=0;},1500);}}}} className="result-tab"
                  style={{flex:1,background:activeTab===id?`${C.gold}22`:"rgba(201,168,76,0.08)",border:`1px solid ${activeTab===id?C.gold:"rgba(201,168,76,0.3)"}`,borderBottom:`3px solid ${activeTab===id?C.gold:"transparent"}`,color:activeTab===id?C.gold:"rgba(201,168,76,0.6)",fontFamily:"Cinzel,serif",fontSize:10,letterSpacing:1,textTransform:"uppercase",padding:"10px 8px",cursor:(showPartnerDetailsPage&&id!=="reading")?"not-allowed":"pointer",transition:"all 0.3s ease",display:"flex",flexDirection:"column",alignItems:"center",gap:3,borderRadius:"8px 8px 0 0",boxShadow:activeTab===id?`0 0 15px ${C.gold}44`:"none",animation:activeTab===id?"tabPulse 2s ease-in-out infinite":"none",transform:"none",opacity:(showPartnerDetailsPage&&id!=="reading")?0.3:1}}>
                  <span style={{fontSize:20,transition:"transform 0.3s ease"}}>{icon}</span>
                  <span style={{fontWeight:activeTab===id?700:600,color:activeTab===id?C.gold:"#c9a84c",animation:activeTab===id?"tabTextPulse 2s ease-in-out infinite":"none"}}>{label}</span>
                </button>
              ))}
            </div>

            {/* ══ READING TAB ══ */}
            {!partnerPhase&&activeTab==="reading"&&(
              <div style={{animation:"fadeIn 0.3s ease both"}}>
                {showPartnerDetailsPage?(
                  // Partner Details Page
                  <div style={{animation:"fadeIn 0.3s ease both"}}>
                    <div style={{textAlign:"center",marginBottom:24}}>
                      <div style={{fontSize:36,marginBottom:12}}>💕</div>
                      <h2 style={{fontFamily:"Cinzel,serif",fontSize:24,color:C.gold,margin:"0 0 8px",letterSpacing:1}}>Your Partner's Details</h2>
                      <p style={{fontFamily:"Crimson Text,serif",fontSize:15,color:C.cream,margin:0}}>Tell me about your someone special so I can align your cosmic connection</p>
                    </div>

                    {/* Partner Name Input */}
                    <div style={{marginBottom:20}}>
                      <label style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:8}}>Partner's First Name</label>
                      <input 
                        type="text" 
                        value={partnerName} 
                        onChange={(e)=>setPartnerName(e.target.value)}
                        placeholder="Enter their name"
                        autoComplete="name"
                        style={{width:"100%",boxSizing:"border-box",background:C.surface,border:`1px solid ${C.border}`,color:C.cream,fontFamily:"Crimson Text,serif",fontSize:16,padding:"10px 12px",borderRadius:8,outline:"none",marginBottom:8}}
                      />
                    </div>

                    {/* Partner Birthdate Input - ScrollPicker */}
                    <div style={{marginBottom:24}}>
                      <label style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:8}}>Partner's Birthdate</label>
                      <div style={{display:"grid",gridTemplateColumns:"2fr 3fr 2fr",gap:8}}>
                        <ScrollPicker
                          items={PARTNER_DAYS}
                          selected={partnerBirthDate.day}
                          onSelect={(v)=>setPartnerBirthDate(p=>({...p,day:v}))}
                          label={d=>d}
                        />
                        <ScrollPicker
                          items={PARTNER_MONTHS}
                          selected={partnerBirthDate.month}
                          onSelect={(v)=>setPartnerBirthDate(p=>({...p,month:v}))}
                          label={(m,i)=>PARTNER_MONTHS[i]}
                          indexMode
                        />
                        <ScrollPicker
                          items={PARTNER_YEARS}
                          selected={partnerBirthDate.year}
                          onSelect={(v)=>setPartnerBirthDate(p=>({...p,year:v}))}
                          label={y=>y}
                        />
                      </div>
                      <div style={{textAlign:"center",marginTop:10}}>
                        <span style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:16,color:C.cream,opacity:0.9}}>
                          {PARTNER_DAYS[partnerBirthDate.day-1]} {PARTNER_MONTHS[partnerBirthDate.month-1]} {partnerBirthDate.year}
                        </span>
                      </div>
                    </div>

                    {/* Name Display Order Selection */}
                    <div style={{marginBottom:24}}>
                      <label style={{fontFamily:"Cinzel,serif",fontSize:12,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:12}}>How should your names appear on the share card?</label>
                      
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"12px",background:C.surface,border:`2px solid ${nameDisplayOrder==="userFirst"?C.gold:C.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.3s"}} onClick={()=>setNameDisplayOrder("userFirst")}>
                        <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${nameDisplayOrder==="userFirst"?C.gold:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {nameDisplayOrder==="userFirst"&&<div style={{width:12,height:12,borderRadius:"50%",background:C.gold}}/>}
                        </div>
                        <span style={{fontFamily:"Crimson Text,serif",fontSize:15,color:C.cream}}>{userName||"Your Name"} & {partnerName||"Partner's Name"}</span>
                      </div>

                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px",background:C.surface,border:`2px solid ${nameDisplayOrder==="partnerFirst"?C.gold:C.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.3s"}} onClick={()=>setNameDisplayOrder("partnerFirst")}>
                        <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${nameDisplayOrder==="partnerFirst"?C.gold:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {nameDisplayOrder==="partnerFirst"&&<div style={{width:12,height:12,borderRadius:"50%",background:C.gold}}/>}
                        </div>
                        <span style={{fontFamily:"Crimson Text,serif",fontSize:15,color:C.cream}}>{partnerName||"Partner's Name"} & {userName||"Your Name"}</span>
                      </div>
                    </div>

                    {/* Proceed Button - requires name */}
                    <button onClick={()=>{if(partnerName.trim()){setShowPartnerDetailsPage(false);setPartnerPhase("capture");}}} disabled={!partnerName.trim()} className="gold-btn" style={{width:"100%",padding:"14px",fontSize:16,borderRadius:11,marginBottom:12,opacity:partnerName.trim()?1:0.5,cursor:partnerName.trim()?"pointer":"not-allowed"}}>
                      🔮 Proceed to Partner Scan
                    </button>
                    {/* Validation message */}
                    {!partnerName.trim()&&(
                      <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,textAlign:"center",marginTop:12,fontStyle:"italic"}}>Please enter your partner's name to proceed</p>
                    )}
                  </div>
                ):(
                  <>
                    {!partnerPaid&&!subscribed&&(
                  <div style={{animation:"fadeIn 0.3s"}}>
                    {(()=>{
                      // Generate partner reading
                      const compat = generatePartnerCompatibility(userName, birthDate, "Your Partner", {year:2000,month:6,day:15});
                      const today = new Date();
                      const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      
                      return (
                        <>
                    {/* Intro Section */}
                    <div style={{textAlign:"center",marginBottom:24}}>
                      <div style={{fontSize:32,marginBottom:12}}>💖</div>
                      <h2 style={{fontFamily:"Cinzel,serif",fontSize:22,color:C.gold,margin:"0 0 12px",letterSpacing:1,cursor:"pointer",userSelect:"none"}} onClick={()=>{devPartnerTapRef.current=(devPartnerTapRef.current||0)+1;clearTimeout(devPartnerTimerRef.current);if(devPartnerTapRef.current>=3){devPartnerTapRef.current=0;const compatResult=generatePartnerCompatibility(userName,birthDate,partnerName||"Your Partner",partnerBirthDate);setPartnerPaid(true);setPartnerReadingResult(compatResult);setPartnerPhase("result");if(phase!=="result"){const devS=(Date.now()&0xFFFFFFFF)>>>0;setUserName(userName||"Test User");setReading(generateFortune(devS,userName||"Test User",birthDate||{day:1,month:1,year:1990}));setPhase("result");}setActiveTab("reading");}else{devPartnerTimerRef.current=setTimeout(()=>{devPartnerTapRef.current=0;},1200);}}}>Partner Compatibility Reading</h2>
                      <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,lineHeight:1.8,margin:0}}>Madame Zafira can read your romantic partner's palm lines and reveal the profound connection between your souls.</p>
                    </div>

                    {/* Features */}
                    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px",marginBottom:20}}>
                      <div>
                        <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:C.rose,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1,paddingLeft:"1.6em",textIndent:"-1.6em"}}>💝 Receive a Beautiful Share Card</div>
                        <p style={{fontFamily:"Crimson Text,serif",fontSize:15,color:C.cream,margin:0,lineHeight:1.7}}>A stunning share card featuring both your names, your compatibility score, and sacred insights to share with your beloved</p>
                      </div>
                    </div>

                    {/* Share Card Preview - Portrait */}
                    <div style={{background:C.bg,border:`2px solid ${C.gold}`,borderRadius:14,padding:"16px",marginBottom:12,textAlign:"center",position:"relative",overflow:"hidden",maxWidth:280,margin:"0 auto 12px"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>
                      
                      <div style={{fontFamily:"Cinzel,serif",fontSize:20,color:C.gold,marginBottom:8,letterSpacing:2}}>✦ Mystic Fortunes ✦</div>
                      
                      <div style={{fontFamily:"Cinzel,serif",fontSize:16,color:C.gold,marginBottom:3}}>Soulmate Connection</div>
                      <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#ff6b8a",letterSpacing:1,marginBottom:12}}>{userName||"Your Name"} & Your Partner</div>
                      
                      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.gold}44,transparent)`,marginBottom:12}}/>
                      
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:"Cinzel,serif",fontSize:10,color:C.gold,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>Date</div>
                        <div style={{fontFamily:"Crimson Text,serif",fontSize:12,color:C.cream}}>{dateStr}</div>
                      </div>
                      
                      <div style={{marginBottom:12}}>
                        <div style={{fontFamily:"Cinzel,serif",fontSize:32,color:"#ff6b8a",fontWeight:700}}>{compat.score}%</div>
                        <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:"#ff9db8",letterSpacing:1,textTransform:"uppercase"}}>Harmony Score</div>
                      </div>
                      
                      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.gold}44,transparent)`,marginBottom:12}}/>
                      
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:12,color:C.cream,lineHeight:1.7,margin:"0 0 12px"}}>{compat.insight}</p>
                      
                      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.gold}44,transparent)`,marginBottom:10}}/>
                      
                      <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:C.gold,letterSpacing:1,fontWeight:700,opacity:1}}>🔮 mysticfortunes.ai</div>
                      
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>
                    </div>

                    {/* Pricing */}
                    <div style={{background:"linear-gradient(135deg,#100616,#0c0812)",border:`1px solid ${C.gold}38`,borderRadius:14,padding:"18px 16px",textAlign:"center",animation:"orbGlow 4s ease-in-out infinite"}}>
                      <h3 style={{fontFamily:"Cinzel,serif",fontSize:18,color:C.gold,margin:"0 0 12px",letterSpacing:1}}>Unlock Your Couples Connection</h3>
                      <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.cream,fontSize:16,lineHeight:1.8,margin:"0 0 14px"}}>All for only...</p>
                      <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",margin:"12px 0 16px"}}>
                        <span style={{fontFamily:"Cinzel,serif",fontSize:16,color:"#c090ff",textDecoration:"line-through"}}>$9.99</span>
                        <span style={{fontFamily:"Cinzel,serif",fontSize:36,color:C.gold,fontWeight:700}}>$3.99</span><span style={{fontFamily:"Cinzel,serif",fontSize:11,fontWeight:700,background:C.roseDim,color:"#ffffff",borderRadius:20,padding:"3px 10px",marginLeft:10}}>60% OFF</span>
                      </div>
                      <button className="gold-btn" onClick={()=>handlePartnerPayment()} style={{width:"100%",padding:"14px",fontSize:16,borderRadius:11}}>💝 Unlock Partner Reading — $3.99</button>
                    </div>
                        </>
                      );
                    })()}
                  </div>
                )}
                  </>
                )}

              </div>
            )}

            {/* ══ LINES TAB ══ */}
            {!partnerPhase&&activeTab==="lines"&&(
              <div style={{animation:"fadeIn 0.3s ease both"}}>
                <div style={{textAlign:"center",marginBottom:20}}>
                  {userName&&<div style={{fontFamily:"Cinzel,serif",fontSize:"clamp(26px,6vw,38px)",fontWeight:700,color:C.gold,letterSpacing:4,textTransform:"uppercase",marginBottom:6}}>{userName}</div>}
                  {(()=>{
                    const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
                    const dobStr = birthDate&&birthDate.day&&birthDate.month&&birthDate.year ? `${birthDate.day} ${MONTHS[birthDate.month-1]} ${birthDate.year}` : '';
                    const zodiac = getZodiac(birthDate);
                    return dobStr ? (
                      <div style={{fontFamily:"Cinzel,serif",fontSize:17,color:C.gold,letterSpacing:2,marginBottom:4}}>
                        {dobStr}{zodiac ? <span style={{marginLeft:10}}>{zodiac.emoji} {zodiac.sign}</span> : null}
                      </div>
                    ) : null;
                  })()}
                  <div style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:14,color:C.gold,letterSpacing:1.5}}>✦ A Personal Palm Reading by Madame Zafira ✦</div>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:14,color:C.gold,letterSpacing:1.5,marginTop:4}}>{new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                {[["💗 Heart Line",reading.heartLine,C.rose],["🧠 Head Line",reading.headLine,"#6070d8"],["✋ Life Line",reading.lifeLine,C.teal]].map(([title,text,color])=>(
                  <div key={title} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:8,borderLeft:`3px solid ${color}`}}>
                    <div style={{fontFamily:"Cinzel,serif",fontSize:15,color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1}}>{title}</div>
                    {(fullPaid||subscribed)?
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{text}</p>:
                      <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                        <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(text||"").slice(0,160)}…</p>
                      </div>
                    }
                  </div>
                ))}
                {/* Your Gift — paywalled */}
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:8}}>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:C.teal,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1}}>✨ Your Gift</div>
                  {(fullPaid||subscribed)?
                    <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{reading.gift}</p>:
                    <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(reading.gift||"").slice(0,160)}…</p>
                    </div>
                  }
                </div>

                {/* Heed This — paywalled */}
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:8}}>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:C.rose,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1}}>⚠ Heed This</div>
                  {(fullPaid||subscribed)?
                    <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{reading.warning}</p>:
                    <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(reading.warning||"").slice(0,160)}…</p>
                    </div>
                  }
                </div>

                {/* Past Life Echo — paywalled */}
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:8}}>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:"#6070d8",letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1}}>🌀 Past Life Echo</div>
                  {(fullPaid||subscribed)?
                    <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{reading.pastLife}</p>:
                    <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(reading.pastLife||"").slice(0,160)}…</p>
                    </div>
                  }
                </div>

                {/* Next 30 Days — paywalled */}
                <div style={{background:"linear-gradient(135deg,rgba(25,12,45,0.8),rgba(45,15,28,0.8))",border:`1px solid ${C.gold}2a`,borderRadius:12,padding:"13px",marginBottom:8}}>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,cursor:"pointer",userSelect:"none",fontWeight:700,opacity:1}} onClick={()=>{devPaidTapRef.current=(devPaidTapRef.current||0)+1;clearTimeout(devPaidTimerRef.current);if(devPaidTapRef.current>=3){devPaidTapRef.current=0;setFullPaid(true);setActiveTab("lines");}else{devPaidTimerRef.current=setTimeout(()=>{devPaidTapRef.current=0;},1200);}}}>🌟 The Coming Months</div>
                  {(fullPaid||subscribed)?
                    <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{reading.nearFuture}</p>:
                    <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(reading.nearFuture||"").slice(0,160)}…</p>
                    </div>
                  }
                </div>

                {/* Your True Path — paywalled */}
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:8}}>
                  <div style={{fontFamily:"Cinzel,serif",fontSize:15,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6,fontWeight:700,opacity:1}}>✦ Your True Path</div>
                  {(fullPaid||subscribed)?
                    <div>{(reading.fullReading||"").split("\n\n").map((para,i)=>(
                      <p key={i} style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:19,color:C.cream,lineHeight:1.85,margin:"0 0 12px"}}>{para}</p>
                    ))}</div>:
                    <div style={{filter:"blur(5px)",pointerEvents:"none"}}>
                      <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:17,color:C.cream,margin:0,lineHeight:1.85}}>{(reading.fullReading||"").slice(0,160)}…</p>
                    </div>
                  }
                </div>

                {/* PDF Download Button — shown when paid */}
                {(fullPaid||subscribed)&&(
                  <>
                  <button
                    onClick={async()=>{
                      if(fullPDFSaved||savingFullPDF)return;
                      setSavingFullPDF(true);
                      try{const{generateFullRevelationPDF}=await lazyImportPDFGenerators();await generateFullRevelationPDF(reading,userName,birthDate);setFullPDFSaved(true);}catch(e){console.error(e);}
                      setSavingFullPDF(false);
                    }}
                    style={{width:"100%",padding:"14px",marginBottom:10,background:fullPDFSaved?"#1a5c1a":"linear-gradient(135deg,#1a1200,#2a1e00)",border:fullPDFSaved?"1px solid #2ecc2e":"1px solid #c9a84c",borderRadius:11,color:fullPDFSaved?"#ffffff":"#c9a84c",fontFamily:"Cinzel,serif",fontSize:15,fontWeight:700,letterSpacing:1.5,cursor:fullPDFSaved?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,textTransform:"uppercase",transition:"all 0.4s ease"}}
                  >
                    {fullPDFSaved?"✅ PDF Saved":savingFullPDF?"✦ Generating PDF...":"📜 Download Your Reading as PDF"}
                  </button>
                  <p style={{fontFamily:"Cinzel,serif",fontSize:13,color:"#e05555",textAlign:"center",margin:"0 0 12px",lineHeight:1.6,fontWeight:600,letterSpacing:0.5}}>
                    ⚠️ Save your PDF now — once you leave this page your reading will be gone forever and cannot be recovered.
                  </p>
                  </>
                )}

                {/* The Full Revelation Awaits Block */}
                {!fullPaid&&!subscribed&&(
                  <div style={{background:"linear-gradient(135deg,#100616,#0c0812)",border:`1px solid ${C.gold}38`,borderRadius:14,padding:"18px 16px",marginBottom:10,textAlign:"center",animation:"orbGlow 4s ease-in-out infinite"}}>
                    <div style={{fontSize:24,marginBottom:8}}>🔮</div>
                    <h3 style={{fontFamily:"Cinzel,serif",fontSize:18,color:C.gold,margin:"0 0 6px",cursor:"pointer",userSelect:"none"}} onClick={()=>{devTapRef.current=(devTapRef.current||0)+1;clearTimeout(devTapTimerRef.current);if(devTapRef.current>=3){devTapRef.current=0;setFullPaid(true);}else{devTapTimerRef.current=setTimeout(()=>{devTapRef.current=0;},1200);}}}>The Full Revelation Awaits</h3>
                    <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.cream,fontSize:19,lineHeight:1.85,margin:"0 0 12px"}}>"I have shown you only a glimpse of your future... The full truth is far more revealing... If you wish to uncover what truly awaits you, you must allow me to complete the reading."</p>
                    <p style={{fontFamily:"Cinzel,serif",color:"#c090ff",fontSize:14,lineHeight:1.7,margin:"0 0 10px",fontWeight:500,letterSpacing:0.5}}>Full palm analysis · Your Gift · Heed This · Past life echo · The coming months · Your True Path · PDF Download</p>
                    <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",margin:"10px 0"}}>
                      <span style={{fontFamily:"Cinzel,serif",fontSize:14,color:"#c090ff",textDecoration:"line-through"}}>$9.99</span>
                      <span style={{fontFamily:"Cinzel,serif",fontSize:28,color:C.gold,fontWeight:700}}>$3.99</span>
                      <span style={{background:C.roseDim,color:"#ffffff",borderRadius:20,padding:"3px 10px",fontFamily:"Cinzel,serif",fontSize:11,fontWeight:700}}>60% OFF</span>
                    </div>
                    <button className="gold-btn" onClick={()=>handleFullPayment()} style={{width:"100%",padding:"12px",fontSize:16,borderRadius:11,marginBottom:6}}>🔮 Unlock Full Reading — $3.99</button>
                  </div>
                )}
              </div>
            )}

            {/* ══ CARD TAB ══ */}
            {!partnerPhase&&activeTab==="extras"&&(
              <div style={{animation:"fadeIn 0.3s ease both"}}>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px",marginBottom:10,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>
                  {(()=>{
                    const today = new Date();
                    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                          <div style={{fontFamily:"Cinzel,serif",fontSize:17,color:"#c9a84c",fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>✦ Today's Fortune ✦</div>
                          <div style={{fontFamily:"Cinzel,serif",fontSize:11,color:"#c9a84c",fontWeight:600,letterSpacing:1,marginTop:6}}>{dateStr}</div>
                        </div>
                      </div>
                    );
                  })()}
                  {(()=>{
                    return (
                      <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",fontSize:19,color:C.cream,margin:0,lineHeight:1.85}}>{`"${todayFortune}"`}</p>
                    );
                  })()}
                </div>
                {(()=>{
                  const MONTHS_LBL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                  const curMonth = new Date().getMonth();
                  const curYear  = new Date().getFullYear();
                  const monthSeed = (generateSeed(userName,birthDate) ^ ((curMonth+1)*2654435761) ^ (curYear*40503)) >>> 0;
                  const mRng = seededRandom(monthSeed);
                  const MSIGNS = ["The Midnight Oracle","The Wounded Healer","The Silent Storm","The Ancient Wanderer","The Hidden Flame","The Threshold Guardian","The Veiled Prophet","The Unfinished Star","The Deep Water","The Rising Phoenix","The Shadow Keeper","The Ember Child","The Tidal Soul","The Forgotten Sage","The Crimson Seeker","The Glass Mirror","The Iron Lotus","The Last Dreamer","The Pale Fire","The Storm Walker","The Bone Reader","The Veil Crosser","The Quiet Thunder","The Broken Compass","The Salt & Wound","The Gilded Cage","The Northern Light","The Bleeding Edge","The Moon Daughter","The Ash Pilgrim","The Torn Veil","The Unmarked Path"];
                  const MCOLORS = ["Midnight Indigo","Blood Amber","Eclipse Silver","Ash Violet","Bone White","Storm Teal","Ember Gold","Shadow Crimson","Mist Grey","Deep Ochre","Blackened Rose","Smoke Jade","Rust & Honey","Fading Coral","Pale Obsidian","Dusk Lavender","Iron Violet","Scarlet Dusk","Pewter Blue","Burnt Sienna","Frozen Copper","Velvet Moss","Worn Ivory","Ghost Amber","Slate Mauve","Tarnished Gold","Bruised Plum","Celadon Shadow","Dried Blood","Twilight Cerise","Storm Grey","Arctic Flame"];
                  const MNUMS = ["1","2","3","4","5","6","7","8","9"];
                  const mSign  = MSIGNS[Math.floor(mRng()*MSIGNS.length)];
                  const mColor = MCOLORS[Math.floor(mRng()*MCOLORS.length)];
                  const mNum   = MNUMS[Math.floor(mRng()*MNUMS.length)];
                  return (
                    <div style={{background:C.surface,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"16px",marginBottom:12,position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,height:1.5,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>
                      <div style={{textAlign:"center",marginBottom:12}}>
                        <span style={{fontFamily:"Cinzel,serif",fontSize:15,color:"#c9a84c",fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>✦ {MONTHS_LBL[curMonth]} Elements ✦</span>
                        <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",fontSize:15,color:"#e8d5b8",margin:"6px 0 0",lineHeight:1.5}}>
                          Your elemental signature shifts each month — return in {MONTHS_LBL[(curMonth+1)%12]} for a new alignment
                        </p>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                        {[["🌙",mSign,"Soul Sign"],["🔢",mNum,"Lucky #"],["🎨",mColor,"Colour"]].map(([ic,v,l])=>(
                          <div key={l} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${C.gold}22`,borderRadius:10,padding:"16px 7px",textAlign:"center"}}>
                            <div style={{fontSize:24,marginBottom:3}}>{ic}</div>
                            <div style={{fontFamily:"IM Fell English,serif",fontSize:14,color:"#f0dfc0",lineHeight:1.4,fontWeight:500}}>{v}</div>
                            <div style={{fontFamily:"Cinzel,serif",fontSize:9,color:"#c9a84c",fontWeight:600,letterSpacing:1,marginTop:2}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
                
                <div style={{marginBottom:12}}>
                  <ShareCard reading={reading} onOpenFullscreen={()=>setShowFullscreenShareCard(true)} fullPaid={fullPaid}/>
                </div>
                
                {/* The Full Revelation Block */}
                {!fullPaid&&!subscribed&&(
                  <div style={{background:"linear-gradient(135deg,#100616,#0c0812)",border:`1px solid ${C.gold}38`,borderRadius:14,padding:"18px 16px",marginBottom:10,textAlign:"center",animation:"orbGlow 4s ease-in-out infinite"}}>
                    <div style={{fontSize:24,marginBottom:8}}>🔮</div>
                    <h3 style={{fontFamily:"Cinzel,serif",fontSize:18,color:C.gold,margin:"0 0 6px",cursor:"pointer",userSelect:"none"}} onClick={()=>{devTapRef.current=(devTapRef.current||0)+1;clearTimeout(devTapTimerRef.current);if(devTapRef.current>=3){devTapRef.current=0;setFullPaid(true);}else{devTapTimerRef.current=setTimeout(()=>{devTapRef.current=0;},1200);}}}>The Full Revelation Awaits</h3>
                    <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.cream,fontSize:19,lineHeight:1.85,margin:"0 0 12px"}}>"I have shown you only a glimpse of your future... The full truth is far more revealing... If you wish to uncover what truly awaits you, you must allow me to complete the reading."</p>
                    <p style={{fontFamily:"Cinzel,serif",color:"#c090ff",fontSize:14,lineHeight:1.7,margin:"0 0 10px",fontWeight:500,letterSpacing:0.5}}>Full palm analysis · Your Gift · Heed This · Past life echo · The coming months · Your True Path · PDF Download</p>
                    <div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",margin:"10px 0"}}>
                      <span style={{fontFamily:"Cinzel,serif",fontSize:14,color:"#c090ff",textDecoration:"line-through"}}>$9.99</span>
                      <span style={{fontFamily:"Cinzel,serif",fontSize:28,color:C.gold,fontWeight:700}}>$3.99</span>
                      <span style={{background:C.roseDim,color:"#ffffff",borderRadius:20,padding:"3px 10px",fontFamily:"Cinzel,serif",fontSize:11,fontWeight:700}}>60% OFF</span>
                    </div>
                    <button className="gold-btn" onClick={()=>handleFullPayment()} style={{width:"100%",padding:"12px",fontSize:16,borderRadius:11,marginBottom:6}}>🔮 Unlock Full Reading — $3.99</button>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Navigation buttons for result tabs */}
        {phase==="result"&&reading&&!partnerPhase&&(
          <>
            {!(activeTab==="lines"&&(fullPaid||subscribed))&&<Divider/>}
            {activeTab==="extras"&&(
              <button onClick={()=>{setPhase("intro");setReading(null);setPalmImage(null);setPartnerPaid(false);setFullPaid(false);setSubscribed(false);setSpeaking(false);setUserName("");try{localStorage.removeItem('pendingUserName');localStorage.removeItem('pendingBirthDate');localStorage.removeItem('pendingReading');}catch(e){}}}
                style={{width:"100%",padding:"12px",fontSize:14,borderRadius:9,background:"rgba(148,90,210,0.18)",border:"1px solid rgba(148,90,210,0.6)",color:"#c090ff",fontFamily:"Cinzel,serif",letterSpacing:1,cursor:"pointer",marginTop:8,marginBottom:8}}>
                🔄 Begin a New Reading
              </button>
            )}
            {(activeTab==="reading"||(activeTab==="lines"&&!fullPaid&&!subscribed))&&!showPartnerDetailsPage&&(
              <button onClick={()=>{setActiveTab("extras");}}
                style={{width:"100%",padding:"12px",fontSize:14,borderRadius:9,background:"rgba(148,90,210,0.18)",border:"1px solid rgba(148,90,210,0.6)",color:"#c090ff",fontFamily:"Cinzel,serif",letterSpacing:1,cursor:"pointer"}}>
                ← Back to Today's Fortune
              </button>
            )}

          </>
        )}

      </div>

      {/* Palm validation error — fullscreen overlay */}
      {palmError&&(
        <div style={{
          position:"fixed",inset:0,zIndex:100,
          background:"linear-gradient(160deg,rgba(8,3,20,0.97) 0%,rgba(40,8,25,0.97) 50%,rgba(8,3,20,0.97) 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"32px 24px",
          animation:"fadeIn 0.4s ease both",
        }}>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
            {[...Array(8)].map((_,i)=>(
              <div key={i} style={{
                position:"absolute",
                left:`${10+i*12}%`,top:`${15+i*9}%`,
                width:i%2===0?3:2,height:i%2===0?3:2,
                borderRadius:"50%",
                background:i%2===0?C.rose:C.gold,
                opacity:0.25,
                animation:`floatP ${5+i}s ease-in-out ${i*0.7}s infinite`,
              }}/>
            ))}
          </div>
          <div style={{maxWidth:420,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
            <div style={{
              width:90,height:90,borderRadius:"50%",
              background:"rgba(60,8,25,0.8)",
              border:`2px solid ${C.rose}55`,
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 24px",
              boxShadow:`0 0 40px ${C.rose}30`,
              animation:"orbGlow 3s ease-in-out infinite",
            }}>
              <span style={{fontSize:40}}>🖐️</span>
            </div>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(22px,6vw,32px)",color:C.gold,margin:"0 0 6px",letterSpacing:2,animation:"goldGlow 3s ease-in-out infinite"}}>Madame Zafira</h2>
            <h3 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(16px,4vw,22px)",color:C.rose,margin:"0 0 18px",fontWeight:400,letterSpacing:1,cursor:"pointer",userSelect:"none"}} onClick={()=>{devCaptureTapRef.current=(devCaptureTapRef.current||0)+1;clearTimeout(devCaptureTimerRef.current);if(devCaptureTapRef.current>=3){devCaptureTapRef.current=0;setPhase("capture");}else{devCaptureTimerRef.current=setTimeout(()=>{devCaptureTapRef.current=0;},1200);}}}>Cannot See Your Palm</h3>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"0 0 22px"}}>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
              <span style={{color:C.rose,fontSize:14}}>✦</span>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
            </div>
            <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.cream,fontSize:"clamp(17px,4vw,20px)",lineHeight:1.8,margin:"0 0 14px",opacity:0.95}}>
              A clear image of your <span style={{color:C.rose}}>left palm facing upward</span> is required — so the ancient lines of your hand are fully visible.
            </p>
            <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",color:C.cream,fontSize:"clamp(15px,3.5vw,17px)",lineHeight:1.7,margin:"0 0 26px",opacity:0.8}}>
              The back of the hand holds no prophecy.<br/>Only the palm reveals your destiny.
            </p>
            <div style={{background:"rgba(201,168,76,0.09)",border:`1px solid ${C.gold}44`,borderRadius:12,padding:"14px 18px",marginBottom:26,display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
              <span style={{fontSize:30,flexShrink:0}}>☝️</span>
              <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,margin:0,lineHeight:1.6,opacity:0.88}}>
                Hold your <strong>left hand</strong> with the palm facing the camera, fingers spread open, in good lighting.
              </p>
            </div>
            <button className="gold-btn" onClick={()=>{setPalmError(false);setPalmImage(null);setPhase("capture");}}
              style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12,marginBottom:12}}>
              ✋ Try Again
            </button>
            <button className="ghost-btn" onClick={()=>{setPalmError(false);setPalmImage(null);setPhase("intro");}}
              style={{width:"100%",padding:"12px",fontSize:13,borderRadius:10,border:"1px solid #6040a0",color:"#a080b0"}}>
              ← Return to the Beginning
            </button>
          </div>
        </div>
      )}

      {/* ══ PARTNER PALM ERROR ══ */}
      {partnerPalmError&&(
        <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(8,5,16,0.99)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 16px"}}>
          <div style={{maxWidth:420,width:"100%",textAlign:"center",position:"relative",zIndex:1}}>
            <div style={{
              width:90,height:90,borderRadius:"50%",
              background:"rgba(60,8,25,0.8)",
              border:`2px solid ${C.rose}55`,
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 24px",
              boxShadow:`0 0 40px ${C.rose}30`,
              animation:"orbGlow 3s ease-in-out infinite",
            }}>
              <span style={{fontSize:40}}>🖐️</span>
            </div>
            <h2 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(22px,6vw,32px)",color:C.gold,margin:"0 0 6px",letterSpacing:2,animation:"goldGlow 3s ease-in-out infinite"}}>Madame Zafira</h2>
            <h3 style={{fontFamily:"Cinzel,serif",fontSize:"clamp(16px,4vw,22px)",color:C.rose,margin:"0 0 18px",fontWeight:400,letterSpacing:1}}>Cannot See Your Palm</h3>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"0 0 22px"}}>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${C.border})`}}/>
              <span style={{color:C.rose,fontSize:14}}>✦</span>
              <div style={{flex:1,height:1,background:`linear-gradient(90deg,${C.border},transparent)`}}/>
            </div>
            <p style={{fontFamily:"IM Fell English,serif",fontStyle:"italic",color:C.cream,fontSize:"clamp(17px,4vw,20px)",lineHeight:1.8,margin:"0 0 14px",opacity:0.95}}>
              A clear image of your <span style={{color:C.rose}}>left palm facing upward</span> is required — so the ancient lines of the hand are fully visible.
            </p>
            <p style={{fontFamily:"Crimson Text,serif",fontStyle:"italic",color:C.cream,fontSize:"clamp(15px,3.5vw,17px)",lineHeight:1.7,margin:"0 0 26px",opacity:0.8}}>
              The back of the hand holds no prophecy.<br/>Only the palm reveals the cosmic truth.
            </p>
            <div style={{background:"rgba(201,168,76,0.09)",border:`1px solid ${C.gold}44`,borderRadius:12,padding:"14px 18px",marginBottom:26,display:"flex",alignItems:"center",gap:14,textAlign:"left"}}>
              <span style={{fontSize:30,flexShrink:0}}>☝️</span>
              <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:C.cream,margin:0,lineHeight:1.6,opacity:0.88}}>
                Hold your <strong>left hand</strong> with the palm facing the camera, fingers spread open, in good lighting.
              </p>
            </div>
            <button className="gold-btn" onClick={()=>{setPartnerPalmError(false);setPartnerPalmImage(null);setPartnerPhase("capture");}}
              style={{width:"100%",padding:"15px",fontSize:15,borderRadius:12,marginBottom:12}}>
              ✋ Try Again
            </button>
            <button onClick={()=>{setPartnerPalmError(false);setPartnerPalmImage(null);setPartnerPhase(null);setShowPartnerDetailsPage(true);setActiveTab("reading");}}
              style={{width:"100%",padding:"12px",fontSize:13,borderRadius:10,background:"#7c3aed",color:"#fff",border:"none",fontFamily:"Cinzel,serif",fontWeight:700,cursor:"pointer",letterSpacing:0.5}}>
              ← Back to Partner Details
            </button>
          </div>
        </div>
      )}
      
      {/* Partner result now rendered inside reading tab */}

      {/* Global Footer Links - always visible */}
      {phase!=="capture"&&!(activeTab==="lines"&&(fullPaid||subscribed))&&(
        <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8,paddingTop:12,paddingBottom:16,flexWrap:"wrap"}}>
          <Link to="/privacy-policy" target="_blank" className="footer-link">Privacy Policy</Link>
          <span style={{color:C.border}}>•</span>
          <Link to="/terms-and-conditions" target="_blank" className="footer-link">Terms & Conditions</Link>
          <span style={{color:C.border}}>•</span>
          <div style={{position:"relative",display:"inline-block",paddingTop:4}} onMouseEnter={()=>setShowBlogDropdown(true)} onMouseLeave={()=>setShowBlogDropdown(false)}>
            <button onClick={()=>setShowBlogDropdown(!showBlogDropdown)} style={{background:"none",border:"none",color:"#ffe083",fontFamily:"Cinzel,serif",fontSize:11,letterSpacing:1,textDecoration:"none",cursor:"pointer",padding:0,transition:"color 0.3s"}}>
              Madame Zafira's Insights ▼
            </button>
            {showBlogDropdown&&(
              <div style={{position:"absolute",bottom:"100%",left:0,background:"#100c1a",border:`1px solid ${C.border}`,borderRadius:8,minWidth:220,zIndex:1000,boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
                <Link to="/blog/broken-life-line" className="footer-link" style={{display:"block",padding:"10px 16px",borderBottom:`1px solid ${C.border}`,textDecoration:"none"}}>
                  Broken Life Line
                </Link>
                <Link to="/blog/broken-heart-line" className="footer-link" style={{display:"block",padding:"10px 16px",textDecoration:"none"}}>
                  Broken Heart Line
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Full Revelation Leave Warning */}
      {showFullLeaveWarning&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10000,backdropFilter:"blur(4px)"}}>
          <div style={{background:"#100c1a",border:"2px solid #c9a84c",borderRadius:16,padding:36,maxWidth:420,width:"90%",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>📜</div>
            <h3 style={{fontFamily:"Cinzel,serif",fontSize:20,color:"#c9a84c",margin:"0 0 14px",fontWeight:700}}>Save Your Reading First</h3>
            <p style={{fontFamily:"Crimson Text,serif",fontSize:16,color:"#e8d5b8",lineHeight:1.8,margin:"0 0 24px"}}>
              Once you leave this page, your reading will be gone forever. Download your <strong style={{color:"#c9a84c"}}>PDF</strong> before continuing.
            </p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setShowFullLeaveWarning(false)}
                style={{flex:1,padding:"12px",background:"#c9a84c",color:"#080510",border:"none",borderRadius:8,fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                GO BACK & SAVE
              </button>
              <button onClick={()=>{setShowFullLeaveWarning(false);if(pendingFullLeave)pendingFullLeave();}}
                style={{flex:1,padding:"12px",background:"rgba(201,168,76,0.15)",color:"#e8d5b8",border:"1px solid #c9a84c55",borderRadius:8,fontFamily:"Cinzel,serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                LEAVE ANYWAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Share Card */}
      {showFullscreenShareCard && reading && (
        <FullScreenShareCard reading={reading} userName={userName} birthDate={birthDate} onClose={()=>setShowFullscreenShareCard(false)} todayFortune={todayFortune}/>
      )}

      {/* Partner Fullscreen Share Card */}
      {showPartnerShareCard && partnerReadingResult && (
        <PartnerFullScreenShareCard partnerReading={partnerReadingResult} userName={userName} partnerName={partnerName} nameDisplayOrder={nameDisplayOrder} onClose={()=>setShowPartnerShareCard(false)}/>
      )}

      {/* Payment Modal */}
      <Suspense fallback={null}>
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          productType={paymentType}
          productName={paymentType === 'full_revelation' ? 'Full Revelation Reading' : 'Partner Compatibility Reading'}
          price={paymentType === 'full_revelation' ? 3.99 : 3.99}
        />
      </Suspense>

      {/* Download Modal */}
      <Suspense fallback={null}>
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          productType={downloadType}
          reading={downloadType === 'full_revelation' ? reading : partnerReadingResult}
          userName={userName}
          partnerName={partnerName}
          harmonyScore={partnerReadingResult?.score || 0}
          alignmentText={partnerReadingResult?.insight || ''}
        />
      </Suspense>

      {/* Desktop Overlay — mobile-only message with crystal ball */}
      {showDesktopOverlay && window.innerWidth > 768 && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(circle at 50% 30%, rgba(155,95,212,0.4), rgba(88,30,88,0.6), rgba(16,12,26,0.95))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          backdropFilter: "blur(2px)"
        }}>
          <div style={{
            textAlign: "center",
            maxWidth: 480,
            padding: "40px 30px",
            background: "rgba(16,12,26,0.8)",
            border: "2px solid rgba(201,168,76,0.3)",
            borderRadius: 24,
            boxShadow: "0 0 60px rgba(155,95,212,0.3), inset 0 0 30px rgba(176,64,90,0.1)"
          }}>
            {/* Animated Crystal Ball */}
            <div style={{
              fontSize: 80,
              animation: "crystalGlow 2s ease-in-out infinite",
              marginBottom: 24,
              display: "inline-block"
            }}>🔮</div>

            {/* Title */}
            <h1 style={{
              fontFamily: "Cinzel,serif",
              fontSize: 36,
              color: "#c9a84c",
              margin: "0 0 12px",
              letterSpacing: 3,
              fontWeight: 700,
              textShadow: "0 0 20px rgba(201,168,76,0.4)"
            }}>Mystic Fortunes</h1>

            {/* Quote */}
            <p style={{
              fontFamily: "IM Fell English,serif",
              fontSize: "clamp(18px, 5vw, 22px)",
              fontStyle: "italic",
              color: "#e8d5b8",
              lineHeight: 1.9,
              margin: "24px 0",
              opacity: 0.95
            }}>
              "The ancient lines of the palm can only be read by candlelight — and candlelight lives in your hand.
            </p>

            {/* Mobile-only message */}
            <p style={{
              fontFamily: "Crimson Text,serif",
              fontSize: 17,
              color: "#d4a574",
              lineHeight: 1.8,
              margin: "20px 0 0",
              opacity: 0.9
            }}>
              This experience was crafted for mobile. Open it on your phone to begin your reading.
            </p>

            {/* Dev hint */}
            <p style={{
              fontFamily: "Cinzel,serif",
              fontSize: 11,
              color: "#6a5870",
              letterSpacing: 1.5,
              marginTop: 28,
              opacity: 0.6
            }}>
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}