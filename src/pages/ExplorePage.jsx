import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const C = {
  bg:      "#05030d",
  surface: "#0d0919",
  border:  "#2e1f40",
  gold:    "#c9a84c",
  goldDim: "#7a6530",
  goldPale:"#f0d88a",
  rose:    "#b0405a",
  teal:    "#2a8a7a",
  cream:   "#e8d5b8",
  muted:   "#6a5870",
  purple:  "#7c3aed",
};

function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      speed: 0.003 + Math.random() * 0.006,
      phase: Math.random() * Math.PI * 2,
    }));
    let frame;
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const alpha = 0.12 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,216,138,${alpha})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}



function CornerOrnament({ mirror = false, color }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32"
      style={{ display:"block", transform: mirror ? "scale(-1,1)" : "none" }}>
      <g fill="none" stroke={color} strokeWidth="0.7">
        <path d="M2 2 L16 2 M2 2 L2 16" />
        <path d="M2 2 L9 9" />
        <circle cx="16" cy="2" r="1.2" fill={color} />
        <circle cx="2" cy="16" r="1.2" fill={color} />
        <path d="M7 2 Q11 7 16 7" strokeDasharray="1.5,2" opacity="0.6" />
        <circle cx="2" cy="2" r="1.8" fill={color} />
      </g>
    </svg>
  );
}

const FEATURES = [
  {
    id: "fortune",
    glyph: "☽",
    title: "Today's Reading",
    subtitle: "Your Personal Revelation",
    teaser: "Every day the universe speaks differently. Let Madame Zafira draw together the forces surrounding you and reveal what today holds in store.",
    cta: "Begin Your Reading",
    status: "live",
    to: "/",
    accent: C.gold,
    shimmer: "rgba(201,168,76,0.07)",
    borderIdle: "#c9a84c77",
    borderHover: "#c9a84ccc",
  },
  {
    id: "soulmate",
    glyph: "♾",
    title: "Soulmate Connection",
    subtitle: "Partner Compatibility",
    teaser: "Two palms. One destiny. Discover whether the cosmos intended your union — or merely your crossing.",
    cta: "Read Our Palms",
    status: "live",
    to: "/",
    accent: C.rose,
    shimmer: "rgba(176,64,90,0.07)",
    borderIdle: "#b0405a77",
    borderHover: "#b0405acc",
  },
  {
    id: "seeking",
    glyph: "✦",
    title: "Seeking a Soulmate",
    subtitle: "AI Vision · Coming Soon",
    teaser: "Speak the shape of your longing into the void. Madame Zafira will conjure their face from the mist.",
    cta: "Awakening Soon",
    status: "soon",
    accent: "#c084fc",
    shimmer: "rgba(192,132,252,0.04)",
    borderIdle: "#c084fc44",
    borderHover: "#c084fc44",
  },
  {
    id: "ask",
    glyph: "◈",
    title: "Ask Madame Zafira",
    subtitle: "Oracle · Coming Soon",
    teaser: "Cast your question into the ether. She who dwells beyond the veil hears all that is whispered.",
    cta: "Awakening Soon",
    status: "soon",
    accent: C.teal,
    shimmer: "rgba(42,138,122,0.04)",
    borderIdle: "#2a8a7a44",
    borderHover: "#2a8a7a44",
  },
  {
    id: "blog",
    glyph: "⊕",
    title: "Madame Zafira's Insights",
    subtitle: "Palmistry & Ancient Lore",
    teaser: "The scrolls of the ancient seers, translated for those brave enough to read what the lines truly say.",
    cta: "Enter the Archive",
    status: "live",
    to: "/blog",
    accent: "#e8a87c",
    shimmer: "rgba(232,168,124,0.06)",
    borderIdle: "#e8a87c77",
    borderHover: "#e8a87ccc",
  },
];

function FeatureCard({ feature, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isLive = feature.status === "live";

  return (
    <div
      onClick={() => isLive && navigate(feature.to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered && isLive
          ? `radial-gradient(ellipse at 25% 25%, ${feature.shimmer} 0%, ${C.surface} 65%)`
          : C.surface,
        border: `1px solid ${hovered && isLive ? feature.borderHover : feature.borderIdle}`,
        borderRadius: 4,
        padding: "28px 26px 24px",
        cursor: isLive ? "pointer" : "default",
        opacity: feature.status === "soon" ? 0.58 : 1,
        transition: "all 0.35s ease",
        transform: hovered && isLive ? "translateY(-3px)" : "none",
        boxShadow: hovered && isLive
          ? `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${feature.accent}14`
          : "0 4px 24px rgba(0,0,0,0.35)",
        animation: `cardReveal 0.6s ease both`,
        animationDelay: `${index * 0.09}s`,
      }}
    >
      {/* Corner ornaments */}
      <div style={{ position:"absolute", top:0, left:0 }}>
        <CornerOrnament color={hovered && isLive ? feature.accent + "88" : C.border + "cc"} />
      </div>
      <div style={{ position:"absolute", top:0, right:0 }}>
        <CornerOrnament mirror color={hovered && isLive ? feature.accent + "88" : C.border + "cc"} />
      </div>

      {/* Sealed badge */}
      {!isLive && (
        <div style={{
          position:"absolute", top:12, right:14,
          fontFamily:"Cinzel, serif", fontSize:9,
          letterSpacing:2.5, color:C.muted, textTransform:"uppercase",
        }}>
          ⌀ sealed
        </div>
      )}

      {/* Glyph */}
      <div style={{
        fontFamily: "Cinzel, serif",
        fontSize: 28,
        color: isLive ? feature.accent : C.muted,
        marginBottom: 12,
        lineHeight: 1,
        textShadow: hovered && isLive ? `0 0 24px ${feature.accent}77` : "none",
        transition: "text-shadow 0.35s ease",
      }}>
        {feature.glyph}
      </div>

      {/* Expanding rule */}
      <div style={{
        width: hovered && isLive ? 52 : 20,
        height: 1,
        background: `linear-gradient(90deg, ${isLive ? feature.accent : C.border}, transparent)`,
        marginBottom: 14,
        transition: "width 0.4s ease",
      }} />

      <div style={{
        fontFamily: "Cinzel, serif",
        fontSize: 16, fontWeight: 700,
        color: isLive ? feature.accent : C.muted,
        letterSpacing: 0.8, marginBottom: 4,
      }}>
        {feature.title}
      </div>
      <div style={{
        fontFamily: "Cinzel, serif",
        fontSize: 9, color: "#a089b8",
        letterSpacing: 3, textTransform: "uppercase",
        marginBottom: 14,
      }}>
        {feature.subtitle}
      </div>

      <p style={{
        fontFamily: "Crimson Text, serif",
        fontStyle: "italic",
        fontSize: 15.5,
        color: C.cream,
        lineHeight: 1.78,
        margin: "0 0 20px",
        opacity: isLive ? 0.8 : 0.4,
      }}>
        {feature.teaser}
      </p>

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        fontFamily: "Cinzel, serif",
        fontSize: 10, fontWeight: 700,
        letterSpacing: 2, textTransform: "uppercase",
        color: isLive ? feature.accent : C.muted,
        opacity: isLive ? 1 : 0.4,
      }}>
        <span>{feature.cta}</span>
        {isLive && (
          <span style={{
            display: "inline-block",
            transform: hovered ? "translateX(5px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}>→</span>
        )}
      </div>

      {/* Bottom shimmer on hover */}
      {hovered && isLive && (
        <div style={{
          position: "absolute", bottom:0, left:"8%", right:"8%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${feature.accent}77, transparent)`,
        }} />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: `radial-gradient(ellipse at 50% 0%, #1a0838 0%, #090418 40%, #05030d 100%)`,
      position: "relative",
      overflowX: "hidden",
    }}>
      <Starfield />

      {/* Bottom fog */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, height:180,
        background:"linear-gradient(to top, rgba(5,3,13,0.85), transparent)",
        pointerEvents:"none", zIndex:1,
      }} />

      <div style={{
        position:"relative", zIndex:2,
        maxWidth: 480, margin:"0 auto",
        padding: "0 22px 80px",
      }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign:"center", paddingTop:16, paddingBottom:8 }}>

          {/* Hero image — bleeds to edges */}
          <div style={{
            margin: "0 -22px 0",
            position: "relative",
            overflow: "hidden",
          }}>
            <img
              src="/crystal-candles.webp"
              alt="Crystal ball under starry sky"
              style={{
                width: "100%",
                display: "block",
                mixBlendMode: "screen",
                filter: "saturate(1.1) brightness(1.0)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 72%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 72%, transparent 100%)",
              }}
            />
          </div>

          {/* Title sits just below the image */}
          <h1 style={{
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(19px, 5.5vw, 25px)",
            fontWeight: 700,
            color: C.gold,
            letterSpacing: 6,
            textTransform: "uppercase",
            margin: "5px 0 5px",
            textShadow: "0 0 40px rgba(201,168,76,0.3)",
          }}>
            The Mystic Realm
          </h1>

          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"center", gap:10,
            margin: "0 0 12px",
          }}>
            <div style={{ flex:1, maxWidth:60, height:"0.5px", background:`linear-gradient(90deg, transparent, ${C.goldDim})` }} />
            <span style={{ color:C.goldDim, fontSize:10, letterSpacing:5 }}>✦ ✦ ✦</span>
            <div style={{ flex:1, maxWidth:60, height:"0.5px", background:`linear-gradient(90deg, ${C.goldDim}, transparent)` }} />
          </div>


        </div>

        {/* ── CARDS ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {FEATURES.map((f, i) => <FeatureCard key={f.id} feature={f} index={i} />)}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          textAlign:"center", marginTop:52,
          display:"flex", flexDirection:"column",
          alignItems:"center", gap:16,
        }}>
          <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
            <Link to="/privacy-policy" target="_blank" className="footer-link">Privacy Policy</Link>
            <span style={{ color:C.border }}>•</span>
            <Link to="/terms-and-conditions" target="_blank" className="footer-link">Terms & Conditions</Link>
          </div>
          <Link to="/" style={{
            display:"inline-flex", alignItems:"center", gap:6,
            fontFamily:"Cinzel, serif", fontSize:10,
            color:C.muted, textDecoration:"none",
            letterSpacing:2, textTransform:"uppercase",
            transition:"color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.cream}
          onMouseLeave={e => e.currentTarget.style.color = C.muted}
          >
            ← Return Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes cardReveal {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
