import React, { useState, useEffect } from "react";
import { getProfile, clearProfile } from "../utils/mysticStore";

// ── Simple zodiac helpers (self-contained, no import needed) ─────────────────
const ZODIAC = [
  { sign: "Capricorn", emoji: "♑", from: [1,1],  to: [1,19]  },
  { sign: "Aquarius",  emoji: "♒", from: [1,20], to: [2,18]  },
  { sign: "Pisces",    emoji: "♓", from: [2,19], to: [3,20]  },
  { sign: "Aries",     emoji: "♈", from: [3,21], to: [4,19]  },
  { sign: "Taurus",    emoji: "♉", from: [4,20], to: [5,20]  },
  { sign: "Gemini",    emoji: "♊", from: [5,21], to: [6,20]  },
  { sign: "Cancer",    emoji: "♋", from: [6,21], to: [7,22]  },
  { sign: "Leo",       emoji: "♌", from: [7,23], to: [8,22]  },
  { sign: "Virgo",     emoji: "♍", from: [8,23], to: [9,22]  },
  { sign: "Libra",     emoji: "♎", from: [9,23], to: [10,22] },
  { sign: "Scorpio",   emoji: "♏", from: [10,23],to: [11,21] },
  { sign: "Sagittarius",emoji:"♐", from: [11,22],to: [12,21] },
  { sign: "Capricorn", emoji: "♑", from: [12,22],to: [12,31] },
];

function getZodiacFromDob(dob) {
  if (!dob?.month || !dob?.day) return null;
  const { month, day } = dob;
  for (const z of ZODIAC) {
    const [fm, fd] = z.from;
    const [tm, td] = z.to;
    if (month === fm && day >= fd) return z;
    if (month === tm && day <= td) return z;
  }
  return null;
}

// ── Colour palette (matches App.jsx) ────────────────────────────────────────
const C = {
  bg:      "#080510",
  surface: "#100c1a",
  border:  "#2e1f40",
  gold:    "#c9a84c",
  goldDim: "#7a6530",
  rose:    "#b0405a",
  cream:   "#e8d5b8",
  muted:   "#6a5870",
  purple:  "#b89fcc",
};

// ── Mystical greeting lines ──────────────────────────────────────────────────
const GREETINGS = [
  "The stars have kept your secrets well…",
  "The ancient lines remember you…",
  "Your cosmic signature has not faded…",
  "Madame Zafira felt your return…",
  "The veil parts once more for you…",
];

function pickGreeting(name) {
  // Deterministic pick based on name so it's consistent per user
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return GREETINGS[h % GREETINGS.length];
}

// ── Component ────────────────────────────────────────────────────────────────
export default function WelcomeBack({ onContinue, onReset, onBack, journeyMode }) {
  const [profile, setProfile] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setProfile(p);
      setTimeout(() => setVisible(true), 60); // slight delay for fade-in
    } else {
      // No profile saved — skip straight to reset (show DetailsPage)
      onReset();
    }
  }, []);

  if (!profile) return null;

  const zodiac = getZodiacFromDob(profile.dob);
  const isSoulmate = journeyMode === "soulmate";

  const greeting = isSoulmate
    ? pickGreeting(profile.name)
    : pickGreeting(profile.name);

  const subtitle = isSoulmate
    ? "Your soulmate connection is ready to be revealed…"
    : "A new day brings new signs. The lines have more to say.";

  const handleContinue = () => {
    onContinue(profile.name, profile.dob);
  };

  const handleNotMe = () => {
    clearProfile();
    onReset();
  };

  return (
    <div style={{
      paddingTop: 24,
      paddingBottom: 32,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>

      {/* Back link — top left */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: C.purple,
          fontFamily: "Cinzel, serif",
          fontSize: 12,
          letterSpacing: 1,
          cursor: "pointer",
          padding: "4px 0 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.gold}
        onMouseLeave={e => e.currentTarget.style.color = C.purple}
      >
        ← Back
      </button>

      {/* Decorative top line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        marginBottom: 32,
      }} />

      {/* Madame Zafira portrait - small */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${C.gold}88`,
          boxShadow: `0 0 24px ${C.gold}44, 0 0 48px rgba(160,100,255,0.3)`,
          display: "inline-block",
          animation: "auraPulse 3s ease-in-out infinite",
        }}>
          <img
            src="/madame-zafira-portrait.webp"
            alt="Madame Zafira"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      </div>

      {/* Greeting text */}
      <div style={{ textAlign: "center", marginBottom: 28, padding: "0 8px" }}>
        <p style={{
          fontFamily: "IM Fell English, serif",
          fontStyle: "italic",
          fontSize: 17,
          color: C.purple,
          margin: "0 0 6px",
          letterSpacing: 0.5,
          lineHeight: 1.6,
        }}>
          {greeting}
        </p>

        <p style={{
          fontFamily: "IM Fell English, serif",
          fontStyle: "italic",
          fontSize: 16,
          color: C.cream,
          margin: "0 0 18px",
          letterSpacing: 0.3,
          lineHeight: 1.7,
          opacity: 0.9,
        }}>
          {subtitle}
        </p>

        <h2 style={{
          fontFamily: "Cinzel, serif",
          fontSize: 28,
          fontWeight: 700,
          color: C.gold,
          margin: "0 0 6px",
          letterSpacing: 2,
          lineHeight: 1.2,
        }}>
          Welcome back,
        </h2>
        <h2 style={{
          fontFamily: "Cinzel, serif",
          fontSize: 32,
          fontWeight: 700,
          color: C.rose,
          margin: "0 0 20px",
          letterSpacing: 2,
          lineHeight: 1.2,
        }}>
          {profile.name}
        </h2>

        {/* Zodiac pill */}
        {zodiac && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: `${C.surface}`,
            border: `1px solid ${C.border}`,
            borderRadius: 30,
            padding: "7px 18px",
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 18 }}>{zodiac.emoji}</span>
            <span style={{
              fontFamily: "Cinzel, serif",
              fontSize: 12,
              color: C.gold,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}>
              {zodiac.sign}
            </span>
          </div>
        )}

        {/* DOB display */}
        {profile.dob && (
          <p style={{
            fontFamily: "Crimson Text, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: C.purple,
            margin: "10px 0 0",
          }}>
            {["January","February","March","April","May","June",
              "July","August","September","October","November","December"][profile.dob.month - 1]
            } {profile.dob.day}, {profile.dob.year}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, margin: "0 0 28px",
      }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
        <span style={{ color: C.goldDim, fontSize: 12 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
      </div>

      {/* Continue button */}
      <button
        onClick={handleContinue}
        className="gold-btn"
        style={{
          width: "100%",
          padding: "15px",
          fontSize: 16,
          borderRadius: 12,
          marginBottom: 14,
          letterSpacing: 1.5,
        }}
      >
        🔮 Continue as {profile.name}
      </button>

      {/* Not me link */}
      <button
        onClick={handleNotMe}
        style={{
          width: "100%",
          padding: "11px",
          fontSize: 13,
          borderRadius: 10,
          background: "transparent",
          border: `1px solid #6040a0`,
          color: C.purple,
          fontFamily: "Crimson Text, serif",
          fontStyle: "italic",
          cursor: "pointer",
          transition: "border-color 0.2s, color 0.2s",
          letterSpacing: 0.5,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = C.gold;
          e.currentTarget.style.color = C.gold;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#6040a0";
          e.currentTarget.style.color = C.purple;
        }}
      >
        Not {profile.name}? Enter your details
      </button>

      {/* Bottom decorative line */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        marginTop: 32,
      }} />
    </div>
  );
}
