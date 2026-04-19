import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:      "#05030d",
  surface: "#0d0919",
  border:  "#2e1f40",
  gold:    "#c9a84c",
  goldDim: "#7a6530",
  rose:    "#b0405a",
  teal:    "#2a8a7a",
  cream:   "#e8d5b8",
  muted:   "#6a5870",
};

const FEATURES = [
  {
    id: "fortune",
    glyph: "☽",
    title: "Today's Reading",
    subtitle: "Your Personal Revelation",
    teaser: "Every day the universe speaks differently. Let Madame Zafira draw together the forces surrounding you and reveal what today holds in store.",
    cta: "Begin Your Reading",
    status: "live",
    action: "start",
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
    teaser: "Two paths. One destiny. Discover whether the cosmos intended your union — or merely your crossing.",
    cta: "Read Our Palms",
    status: "live",
    action: "start",
    accent: C.rose,
    shimmer: "rgba(176,64,90,0.07)",
    borderIdle: "#b0405a77",
    borderHover: "#b0405acc",
  },
  {
    id: "blog",
    glyph: "⊕",
    title: "Madame Zafira's Insights",
    subtitle: "Palmistry & Ancient Lore",
    teaser: "What the ancients carved into stone, Madame Zafira whispers into words. Forgotten knowledge. Forbidden patterns — the beautiful and the brutal.",
    cta: "Explore Archives",
    status: "live",
    action: "navigate",
    to: "/blog",
    accent: "#e8a87c",
    shimmer: "rgba(232,168,124,0.06)",
    borderIdle: "#e8a87c77",
    borderHover: "#e8a87ccc",
  },
  {
    id: "seeking",
    glyph: "✦",
    title: "Seeking a Soulmate",
    subtitle: "AI Vision · Coming Soon",
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
    cta: "Awakening Soon",
    status: "soon",
    accent: C.teal,
    shimmer: "rgba(42,138,122,0.04)",
    borderIdle: "#2a8a7a44",
    borderHover: "#2a8a7a44",
  },
  {
    id: "tarot",
    glyph: "✺",
    title: "Secrets of the Tarot",
    subtitle: "Veil of Arcana · Coming Soon",
    cta: "Awakening Soon",
    status: "soon",
    accent: "#a78bfa",
    shimmer: "rgba(167,139,250,0.04)",
    borderIdle: "#a78bfa44",
    borderHover: "#a78bfa44",
  },
];

function FeatureCard({ feature, index, onStartReading, onClose }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isLive = feature.status === "live";

  const handleHeaderClick = () => {
    if (!isLive) return;
    setExpanded(v => !v);
  };

  const handleCTA = (e) => {
    e.stopPropagation();
    if (!isLive) return;
    if (feature.action === "navigate") {
      navigate(feature.to);
      onClose();
    } else {
      onClose();
      onStartReading(feature.id);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: (hovered || expanded) && isLive
          ? `radial-gradient(ellipse at 25% 25%, ${feature.shimmer} 0%, ${C.surface} 65%)`
          : C.surface,
        border: `1px solid ${(hovered || expanded) && isLive ? feature.borderHover : feature.borderIdle}`,
        borderRadius: 4,
        cursor: isLive ? "pointer" : "default",
        opacity: feature.status === "soon" ? 0.5 : 1,
        transition: "all 0.3s ease",
        boxShadow: (hovered || expanded) && isLive
          ? `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${feature.accent}12`
          : "0 2px 16px rgba(0,0,0,0.3)",
        animation: `drawerCardReveal 0.45s ease both`,
        animationDelay: `${index * 0.07}s`,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Corner ornaments */}
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ position:"absolute", top:0, left:0, pointerEvents:"none" }}>
        <g fill="none" stroke={(hovered || expanded) && isLive ? feature.accent + "77" : C.border} strokeWidth="0.7">
          <path d="M2 2 L12 2 M2 2 L2 12" />
          <circle cx="2" cy="2" r="1.5" fill={(hovered || expanded) && isLive ? feature.accent + "77" : C.border} />
        </g>
      </svg>
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ position:"absolute", top:0, right:0, transform:"scale(-1,1)", pointerEvents:"none" }}>
        <g fill="none" stroke={(hovered || expanded) && isLive ? feature.accent + "77" : C.border} strokeWidth="0.7">
          <path d="M2 2 L12 2 M2 2 L2 12" />
          <circle cx="2" cy="2" r="1.5" fill={(hovered || expanded) && isLive ? feature.accent + "77" : C.border} />
        </g>
      </svg>

      {/* Sealed badge */}
      {!isLive && (
        <div style={{
          position:"absolute", top:10, right:12,
          fontFamily:"Cinzel, serif", fontSize:8,
          letterSpacing:2.5, color:C.muted, textTransform:"uppercase",
        }}>
          ⌀ sealed
        </div>
      )}

      {/* ── Header row — always visible, tap to expand ── */}
      <div
        onClick={handleHeaderClick}
        style={{
          display: "flex", alignItems: "center",
          gap: 16, padding: "18px 22px",
        }}
      >
        {/* Glyph */}
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 22,
          color: isLive ? feature.accent : C.muted,
          lineHeight: 1, flexShrink: 0,
          textShadow: (hovered || expanded) && isLive ? `0 0 20px ${feature.accent}66` : "none",
          transition: "text-shadow 0.3s ease",
        }}>
          {feature.glyph}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 14, fontWeight: 700,
            color: isLive ? feature.accent : C.muted,
            letterSpacing: 0.6, marginBottom: 2,
          }}>
            {feature.title}
          </div>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 8,
            color: "#a089b8", letterSpacing: 2.5, textTransform: "uppercase",
          }}>
            {feature.subtitle}
          </div>
        </div>

        {/* Chevron — only on live items */}
        {isLive && (
          <div style={{
            color: feature.accent,
            fontSize: 22, flexShrink: 0,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            opacity: 0.75,
          }}>
            ▾
          </div>
        )}
      </div>

      {/* ── Expandable body ── */}
      <div style={{
        maxHeight: expanded ? 320 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{
          padding: "0 22px 18px",
          borderTop: `1px solid ${feature.accent}22`,
        }}>
          {/* Teaser */}
          <p style={{
            fontFamily: "Crimson Text, serif", fontStyle: "italic",
            fontSize: 14, color: C.cream, lineHeight: 1.65,
            margin: "12px 0 14px", opacity: 0.82,
          }}>
            {feature.teaser}
          </p>

          {/* CTA button */}
          <button
            onClick={handleCTA}
            style={{
              fontFamily: "Cinzel, serif", fontSize: 10,
              fontWeight: 700, letterSpacing: 2,
              textTransform: "uppercase",
              color: C.bg,
              background: feature.accent,
              border: "none", borderRadius: 3,
              padding: "9px 20px",
              cursor: "pointer",
              boxShadow: `0 3px 14px ${feature.accent}44`,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {feature.cta} →
          </button>
        </div>
      </div>

      {/* Bottom shimmer when expanded */}
      {expanded && (
        <div style={{
          position:"absolute", bottom:0, left:"8%", right:"8%",
          height:1,
          background:`linear-gradient(90deg, transparent, ${feature.accent}66, transparent)`,
        }} />
      )}
    </div>
  );
}

export default function NavDrawer({ isOpen, onClose, onStartReading }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimating(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setAnimating(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!animating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(5,3,13,0.75)",
          backdropFilter: "blur(4px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 1001,
        maxHeight: "88dvh",
        background: `linear-gradient(to bottom, #0f0a1e, ${C.bg})`,
        borderTop: `1px solid #c9a84c44`,
        borderRadius: "20px 20px 0 0",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>

        {/* Drag handle */}
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "14px 0 8px",
          flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 4,
            borderRadius: 2,
            background: "#c9a84c55",
          }} />
        </div>

        {/* Header */}
        <div style={{
          textAlign: "center",
          padding: "4px 22px 16px",
          flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            fontFamily: "Cinzel, serif",
            fontSize: 15, fontWeight: 700,
            color: C.gold,
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(201,168,76,0.3)",
          }}>
            The Mystic Realm
          </div>
          <div style={{
            display:"flex", alignItems:"center",
            justifyContent:"center", gap:8, marginTop:8,
          }}>
            <div style={{ flex:1, maxWidth:40, height:"0.5px", background:`linear-gradient(90deg, transparent, ${C.goldDim})` }} />
            <span style={{ color:C.goldDim, fontSize:9, letterSpacing:4 }}>✦ ✦ ✦</span>
            <div style={{ flex:1, maxWidth:40, height:"0.5px", background:`linear-gradient(90deg, ${C.goldDim}, transparent)` }} />
          </div>
        </div>

        {/* Scrollable cards */}
        <div style={{
          overflowY: "auto",
          flex: 1,
          padding: "16px 18px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          WebkitOverflowScrolling: "touch",
        }}>
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.id}
              feature={f}
              index={i}
              onStartReading={onStartReading}
              onClose={onClose}
            />
          ))}
        </div>

        {/* Close button */}
        <div style={{
          padding: "12px 18px 24px",
          flexShrink: 0,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
        }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: C.cream,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 24px",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.gold}
            onMouseLeave={e => e.currentTarget.style.color = C.cream}
          >
            ✕ Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes drawerCardReveal {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </>
  );
}
