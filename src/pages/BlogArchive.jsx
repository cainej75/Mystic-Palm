import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const C = {
  bg:     "#080510",
  border: "#2e1f40",
  gold:   "#c9a84c",
  rose:   "#b0405a",
  teal:   "#2a8a7a",
  cream:  "#e8d5b8",
  muted:  "#6a5870",
};

const POSTS = [
  {
    to: "/blog/broken-life-line",
    title: "What Does a Broken Life Line Mean?",
    subtitle: "Palmistry Deep Dive",
    excerpt: "A break in the life line doesn't mean what you think. Madame Zafira reveals the ancient truth behind one of palmistry's most misunderstood markings.",
    accent: C.gold,
    glyph: "☽",
  },
  {
    to: "/blog/broken-heart-line",
    title: "The Broken Heart Line in Palmistry",
    subtitle: "Love & Fate",
    excerpt: "The heart line fractures where life has tested you hardest. Learn what each break reveals about your capacity for love — and what comes next.",
    accent: C.rose,
    glyph: "♾",
  },
  {
    to: "/blog/palmistry-fate-line",
    title: "What Your Fate Line Really Says About Your Destiny",
    subtitle: "The Path Ahead",
    excerpt: "Not everyone has a fate line. Those who do carry a heavier burden — and a rarer gift. Discover what yours is trying to tell you.",
    accent: "#a78bfa",
    glyph: "✦",
  },
  {
    to: "/blog/fortune-teller-machine",
    title: "Fortune Teller Machines",
    subtitle: "History & Mystery",
    excerpt: "From carnival arcades to digital oracles — the strange, enduring human need to have our futures told by something that shouldn't be able to know.",
    accent: "#e8a87c",
    glyph: "⊕",
  },
  {
    to: "/blog/best-psychic-books",
    title: "Best Psychic Books: Madame Zafira's Sacred Reading List",
    subtitle: "The Inner Library",
    excerpt: "Seven psychic books that have earned a permanent place on my candlelit shelf — from beginner guides to advanced texts on clairvoyance and mediumship.",
    accent: "#7ec8c8",
    glyph: "📖",
  },
];

export default function BlogArchive() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    // Navigate back home and signal to open the NavDrawer
    window.sessionStorage.setItem('openNavDrawerOnLoad', 'true');
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: C.bg,
      boxSizing: "border-box",
    }}>

      {/* Background glows */}
      <div style={{
        position: "fixed", top: "-20%", left: "-20%",
        width: "55%", height: "55%",
        background: "radial-gradient(circle, rgba(201,168,76,0.07), transparent)",
        borderRadius: "50%", pointerEvents: "none",
      }}/>
      <div style={{
        position: "fixed", bottom: "-20%", right: "-20%",
        width: "50%", height: "50%",
        background: "radial-gradient(circle, rgba(120,60,180,0.07), transparent)",
        borderRadius: "50%", pointerEvents: "none",
      }}/>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 600,
        margin: "0 auto",
        padding: "0 20px 60px",
        boxSizing: "border-box",
      }}>

        {/* Back button */}
        <div style={{ paddingTop: 20 }}>
          <button
            onClick={handleBackClick}
            style={{
              background: "none", border: "none",
              fontFamily: "Cinzel, serif", fontSize: 12,
              color: C.gold, letterSpacing: 1,
              cursor: "pointer", padding: "6px 0",
              opacity: 1,
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.8"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            ← Back
          </button>
        </div>

        {/* Hero image */}
        <div style={{ position: "relative", width: "100%", marginTop: 16, borderRadius: 8, overflow: "hidden" }}>
          <img
            src="/blog-archive-hero.webp"
            alt="Ancient grimoire"
            width="800"
            height="533"
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
          {/* Fade bottom into page bg */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "45%",
            background: `linear-gradient(to bottom, transparent, ${C.bg})`,
            pointerEvents: "none",
          }}/>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
          <h1 style={{
            fontFamily: "Cinzel, serif",
            fontSize: "clamp(28px, 7vw, 40px)",
            fontWeight: 700, color: C.gold,
            margin: "0 0 16px",
            lineHeight: 1.2,
            textShadow: "0 0 32px rgba(201,168,76,0.4)",
          }}>
            Madame Zafira's Insights
          </h1>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 12,
          }}>
            <div style={{ flex: 1, maxWidth: 60, height: "0.5px", background: `linear-gradient(90deg, transparent, ${C.gold}55)` }}/>
            <span style={{ color: `${C.gold}66`, fontSize: 10, letterSpacing: 4 }}>✦ ✦ ✦</span>
            <div style={{ flex: 1, maxWidth: 60, height: "0.5px", background: `linear-gradient(90deg, ${C.gold}55, transparent)` }}/>
          </div>
        </div>

        {/* Post cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {POSTS.map((post) => (
            <Link
              key={post.to}
              to={post.to}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  background: "#0d0919",
                  border: `1px solid ${post.accent}55`,
                  borderRadius: 6,
                  padding: "22px 24px",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${post.accent}aa`;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${post.accent}18`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${post.accent}55`;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Corner ornament */}
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                  <g fill="none" stroke={`${post.accent}55`} strokeWidth="0.8">
                    <path d="M2 2 L10 2 M2 2 L2 10"/>
                    <circle cx="2" cy="2" r="1.2" fill={`${post.accent}55`}/>
                  </g>
                </svg>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    fontFamily: "Cinzel, serif", fontSize: 20,
                    color: post.accent, flexShrink: 0, marginTop: 2,
                    textShadow: `0 0 16px ${post.accent}66`,
                  }}>
                    {post.glyph}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "clamp(9px, 2.5vw, 11px)",
                      color: post.accent, letterSpacing: 2.5,
                      textTransform: "uppercase", marginBottom: 6, opacity: 0.8,
                    }}>
                      {post.subtitle}
                    </div>
                    <h2 style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "clamp(15px, 4vw, 18px)",
                      fontWeight: 700, color: C.cream,
                      margin: "0 0 10px", lineHeight: 1.3,
                    }}>
                      {post.title}
                    </h2>
                    <p style={{
                      fontFamily: "Crimson Text, serif",
                      fontStyle: "italic",
                      fontSize: "clamp(15px, 4vw, 17px)",
                      color: "rgba(232,213,184,0.65)",
                      margin: "0 0 14px", lineHeight: 1.6,
                    }}>
                      {post.excerpt}
                    </p>
                    <div style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: 2, textTransform: "uppercase",
                      color: post.accent,
                    }}>
                      Read More →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

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
            🔮 MysticFortunes.AI
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
  );
}
