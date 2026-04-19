import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const C = {
  gold:    "#ffe083",
  cream:   "#f0dfc0",
  surface: "rgba(255,255,255,0.04)",
  border:  "rgba(201,168,76,0.25)",
};

// Generate 30-min time slots
const TIME_SLOTS = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    TIME_SLOTS.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  }
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

export default function NatalInfoScreen({ onSubmit, onSkip }) {
  const [localQuery,   setLocalQuery]   = useState("");
  const [localPlace,   setLocalPlace]   = useState(null);
  const [localTime,    setLocalTime]    = useState("12:00");
  const [localUnknown, setLocalUnknown] = useState(false);
  const [suggestions,  setSuggestions]  = useState([]);
  const [fetching,     setFetching]     = useState(false);
  const [validationMsg,setValidationMsg]= useState("");
  const [timeConfirmed,setTimeConfirmed]= useState(false);
  const debounceRef  = useRef(null);
  const scrollerRef  = useRef(null);

  // Autocomplete
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (localQuery.length < 2) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setFetching(true);
      try {
        const r = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(localQuery)}&count=6&language=en&format=json`
        );
        const d = await r.json();
        setSuggestions((d.results || []).map(p => ({
          name:      `${p.name}${p.admin1 ? ", " + p.admin1 : ""}${p.country ? ", " + p.country : ""}`,
          latitude:  p.latitude,
          longitude: p.longitude,
        })));
      } catch { setSuggestions([]); }
      setFetching(false);
    }, 380);
  }, [localQuery]);

  // Scroll picker — jump to selected time on mount
  useEffect(() => {
    if (scrollerRef.current && !localUnknown) {
      const idx = TIME_SLOTS.indexOf(localTime);
      if (idx >= 0) scrollerRef.current.scrollTop = idx * 40;
    }
  }, [localUnknown]);

  const handleScroll = e => {
    if (localUnknown) return;
    const idx = Math.round(e.currentTarget.scrollTop / 40);
    setLocalTime(TIME_SLOTS[Math.max(0, Math.min(idx, TIME_SLOTS.length - 1))]);
    setTimeConfirmed(true);
  };

  const handleSubmit = () => {
    const hasPlace = !!localPlace;
    if (!hasPlace && !timeConfirmed) {
      setValidationMsg("Enter birth place and time or click the button below");
      return;
    }
    if (!hasPlace) {
      setValidationMsg("Enter birth place or click the button below");
      return;
    }
    if (!timeConfirmed) {
      setValidationMsg("Scroll to your birth time or toggle \"I don't know\"");
      return;
    }
    setValidationMsg("");
    onSubmit({
      place:     localPlace,
      placeName: localPlace?.name || localQuery || null,
      time:      localUnknown ? null : localTime,
    });
  };

  return (
    <div style={{
      position:   "fixed",
      inset:      0,
      zIndex:     90,
      background: "linear-gradient(160deg,#060210 0%,#0f0625 50%,#060112 100%)",
      overflowY:  "auto",
      WebkitOverflowScrolling: "touch",
    }}>

      {/* Stars */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {[...Array(35)].map((_,i) => (
          <div key={i} style={{
            position:     "absolute",
            left:         `${(i*37+13)%100}%`,
            top:          `${(i*53+7)%100}%`,
            width:        i%5===0 ? 3 : 2,
            height:       i%5===0 ? 3 : 2,
            borderRadius: "50%",
            background:   "white",
            opacity:      0.1 + i%4 * 0.1,
            animation:    `auraPulse ${2+i%3}s ease-in-out ${i%4*0.5}s infinite`,
          }}/>
        ))}
      </div>

      <div style={{
        position:  "relative",
        zIndex:    1,
        maxWidth:  600,
        margin:    "0 auto",
        padding:   "0 20px 60px",
        boxSizing: "border-box",
      }}>

        {/* Back button — same as BlogArchive */}
        <div style={{paddingTop:20}}>
          <button
            onClick={onSkip}
            style={{
              background:    "none",
              border:        "1.5px solid #8b5cf6",
              color:         "#c090ff",
              fontFamily:    "Cinzel, serif",
              fontSize:      12,
              letterSpacing: 1,
              cursor:        "pointer",
              padding:       "7px 16px",
              borderRadius:  8,
              display:       "inline-flex",
              alignItems:    "center",
              gap:           6,
              transition:    "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.color = "#c090ff"; }}
          >← Back</button>
        </div>

        {/* Logo */}
        <div style={{textAlign:"center",marginTop:12,marginBottom:4}}>
          <img
            src="/Mystic_Fortunes_Logo_cropped.webp"
            alt="Mystic Fortunes"
            style={{width:"clamp(180px,60vw,260px)",height:"auto",display:"block",margin:"0 auto",filter:"drop-shadow(0 0 10px #c9a84c55)"}}
          />
        </div>

        {/* Hero image — same pattern as BlogArchive */}
        <div style={{position:"relative", width:"100%", marginTop:16, borderRadius:8, overflow:"hidden"}}>
          <img
            src="/galaxy-hero.webp"
            alt="Night sky"
            width="1400"
            height="933"
            style={{width:"100%", height:"auto", display:"block", objectFit:"cover"}}
          />
          <div style={{
            position:     "absolute",
            bottom:       0,
            left:         0,
            right:        0,
            height:       "45%",
            background:   "linear-gradient(to bottom, transparent, #080510)",
            pointerEvents:"none",
          }}/>
        </div>

        {/* Padded content below hero */}
        <div style={{boxSizing:"border-box"}}>

        {/* Header text */}
        <div style={{textAlign:"center", marginBottom:20, marginTop:16}}>
          <div style={{
            fontFamily:    "Cinzel,serif",
            fontSize:      13,
            color:         C.gold,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom:  10,
          }}>✦ The Celestial Record ✦</div>
          <p style={{
            fontFamily: "Crimson Text,serif",
            fontSize:   14,
            color:      "#ffffff",
            margin:     0,
            lineHeight: 1.55,
            fontStyle:  "italic",
            fontWeight: 600,
          }}>
            The city and hour of your birth are the signature the universe placed on you before you had a name. Share them, and what the lines reveal will speak with far greater precision.
          </p>
        </div>

        {/* Birth Place */}
        <div style={{marginBottom:16}}>
          <label style={{
            fontFamily:    "Cinzel,serif",
            fontSize:      10,
            color:         C.gold,
            letterSpacing: 2,
            textTransform: "uppercase",
            display:       "block",
            marginBottom:  8,
          }}>✦ Where Were You Born</label>

          <div style={{position:"relative"}}>
            <input
              type="text"
              value={localQuery}
              onChange={e => { setLocalQuery(e.target.value); setLocalPlace(null); setValidationMsg(""); }}
              placeholder="The city that received you…"
              autoComplete="off"
              style={{
                width:       "100%",
                padding:     "12px 14px",
                background:  "rgba(255,255,255,0.05)",
                border:      `1px solid ${C.border}`,
                borderRadius: 10,
                color:       C.cream,
                fontFamily:  "Crimson Text,serif",
                fontSize:    16,
                outline:     "none",
                boxSizing:   "border-box",
                caretColor:  C.gold,
              }}
            />
            {fetching && (
              <div style={{
                position:  "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                width: 14, height: 14, borderRadius: "50%",
                border: "2px solid rgba(201,168,76,0.3)",
                borderTop: `2px solid ${C.gold}`,
                animation: "spin 0.8s linear infinite",
              }}/>
            )}
          </div>

          {localPlace && (
            <div style={{fontFamily:"Cinzel,serif",fontSize:10,color:"#4caf7d",letterSpacing:1,marginTop:5}}>
              ✓ {localPlace.name}
            </div>
          )}

          {suggestions.length > 0 && !localPlace && (
            <div style={{
              background:   "#0e0825",
              border:       `1px solid ${C.border}`,
              borderRadius: 8,
              marginTop:    4,
              overflow:     "hidden",
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setLocalPlace(s); setLocalQuery(s.name); setSuggestions([]); }}
                  style={{
                    padding:      "10px 14px",
                    fontFamily:   "Crimson Text,serif",
                    fontSize:     15,
                    color:        C.cream,
                    cursor:       "pointer",
                    borderBottom: i < suggestions.length-1 ? `1px solid rgba(201,168,76,0.1)` : "none",
                  }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(201,168,76,0.08)"}
                  onMouseOut={e  => e.currentTarget.style.background = "transparent"}
                >{s.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Birth Time */}
        <div style={{marginBottom:18}}>
          <label style={{
            fontFamily:    "Cinzel,serif",
            fontSize:      10,
            color:         C.gold,
            letterSpacing: 2,
            textTransform: "uppercase",
            display:       "block",
            marginBottom:  8,
          }}>✦ The Hour of Your Arrival</label>

          <div style={{display:"flex", gap:10, alignItems:"flex-start"}}>

            {/* Scroll wheel */}
            <div style={{
              flex:       1,
              position:   "relative",
              height:     120,
              overflow:   "hidden",
              background: C.surface,
              border:     `1px solid ${localUnknown ? "rgba(201,168,76,0.1)" : C.border}`,
              borderRadius: 10,
              opacity:    localUnknown ? 0.35 : 1,
              transition: "opacity 0.3s",
            }}>
              {/* Fade top */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:40,background:"linear-gradient(to bottom,rgba(6,2,18,0.95),transparent)",pointerEvents:"none",zIndex:2}}/>
              {/* Fade bottom */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(to top,rgba(6,2,18,0.95),transparent)",pointerEvents:"none",zIndex:2}}/>
              {/* Selection highlight */}
              <div style={{position:"absolute",top:"50%",left:0,right:0,transform:"translateY(-50%)",height:40,borderTop:`1px solid rgba(201,168,76,0.35)`,borderBottom:`1px solid rgba(201,168,76,0.35)`,pointerEvents:"none",zIndex:2}}/>

              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                style={{
                  overflowY:       "auto",
                  height:          "100%",
                  scrollSnapType:  "y mandatory",
                  paddingTop:      40,
                  paddingBottom:   40,
                  pointerEvents:   localUnknown ? "none" : "auto",
                }}
              >
                {TIME_SLOTS.map(t => (
                  <div key={t} style={{
                    height:          40,
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    scrollSnapAlign: "start",
                    fontFamily:      "Cinzel,serif",
                    fontSize:        13,
                    color:           localTime === t ? C.gold : "rgba(240,223,192,0.4)",
                    fontWeight:      localTime === t ? 700 : 400,
                    letterSpacing:   1,
                    transition:      "color 0.15s",
                  }}>
                    {formatTime(t)}
                  </div>
                ))}
              </div>
            </div>

            {/* I don't know toggle */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,paddingTop:38}}>
              <button
                onClick={() => { setLocalUnknown(v => !v); setTimeConfirmed(true); }}
                style={{
                  width:        52,
                  height:       28,
                  borderRadius: 14,
                  background:   localUnknown ? C.gold : "rgba(255,255,255,0.08)",
                  border:       `1px solid rgba(201,168,76,0.4)`,
                  cursor:       "pointer",
                  position:     "relative",
                  transition:   "all 0.3s",
                  padding:      0,
                  flexShrink:   0,
                }}
              >
                <div style={{
                  position:   "absolute",
                  top:        3,
                  left:       localUnknown ? 26 : 3,
                  width:      20,
                  height:     20,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.3s",
                  boxShadow:  "0 1px 4px rgba(0,0,0,0.4)",
                }}/>
              </button>
              <span style={{
                fontFamily:    "Cinzel,serif",
                fontSize:      9,
                color:         "#ffe083",
                letterSpacing: 0.5,
                textTransform: "uppercase",
                textAlign:     "center",
                lineHeight:    1.4,
              }}>I don&apos;t<br/>know</span>
            </div>
          </div>

          {localUnknown && (
            <p style={{
              fontFamily: "Crimson Text,serif",
              fontStyle:  "italic",
              fontSize:   14,
              color:      "#ffffff",
              margin:     "8px 0 0",
              lineHeight: 1.55,
              fontWeight: 600,
            }}>
              Without the hour of your birth, your rising sign — the mask the world first sees — must remain unread. What I can see will still be significant.
            </p>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={handleSubmit}
          className="gold-btn"
          style={{width:"100%",padding:"13px",fontSize:14,borderRadius:11,marginBottom:10,letterSpacing:1}}
        >
          🔮 Claim My Reading
        </button>

        {validationMsg && (
          <p style={{
            fontFamily:  "Crimson Text,serif",
            fontStyle:   "italic",
            fontSize:    15,
            color:       "#ff9db8",
            textAlign:   "center",
            margin:      "0 0 10px",
            lineHeight:  1.5,
            animation:   "fadeIn 0.3s ease",
          }}>
            ⚠ {validationMsg}
          </p>
        )}
        <button
          onClick={onSkip}
          style={{
            width:       "100%",
            padding:     "11px",
            fontSize:    13,
            borderRadius: 10,
            background:  "transparent",
            border:      `1px solid ${C.gold}`,
            color:       C.gold,
            fontFamily:  "Cinzel,serif",
            letterSpacing: 0.5,
            cursor:      "pointer",
          }}
        >
          Proceed without this — I will read what the palm alone reveals
        </button>

        {/* Footer */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          marginTop: 40, paddingTop: 20, paddingBottom: 16,
          borderTop: '1px solid rgba(201,168,76,0.15)',
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
    </div>
  );
}
