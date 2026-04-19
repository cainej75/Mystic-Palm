import React, { useState } from "react";

// ── Colour palette ───────────────────────────────────────────────────────────
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
  purpleBright: "#c090ff",
};

// ── Question definitions ─────────────────────────────────────────────────────
const QUESTIONS_ROMANTIC = [
  {
    id: "q1",
    question: "How did you meet?",
    options: [
      "We were brought together by chance",
      "Through friends or family",
      "We found each other online",
      "Through work or study",
      "We have known each other since childhood",
      "It is a long story…",
    ],
  },
  {
    id: "q2",
    question: "How long have you been together?",
    options: [
      "We have just found each other",
      "A few weeks or months",
      "One to two years",
      "Three to five years",
      "Longer than I can remember",
    ],
  },
  {
    id: "q3",
    question: "What draws you most to them?",
    options: [
      "Their warmth and heart",
      "Their mind and depth",
      "Their energy and spirit",
      "The mystery they carry",
      "The way they make me feel safe",
    ],
  },
  {
    id: "q4",
    question: "What is the greatest challenge your connection faces?",
    options: [
      "Distance or time apart",
      "Trust and vulnerability",
      "Communication and understanding",
      "Outside pressures",
      "Nothing — we are aligned",
    ],
  },
];

const QUESTIONS_CURIOUS = [
  {
    id: "q1",
    question: "How did you meet?",
    options: [
      "We were brought together by chance",
      "Through friends or family",
      "We found each other online",
      "Through work or study",
      "We have known each other since childhood",
      "It is a long story…",
    ],
  },
  {
    id: "q2",
    question: "What is this connection to you?",
    options: [
      "A deep friendship",
      "A family bond",
      "Someone I once loved",
      "A connection I cannot quite explain",
    ],
  },
  {
    id: "q3",
    question: "What do you admire most about them?",
    options: [
      "Their strength of character",
      "Their kindness toward others",
      "Their creative spirit",
      "Their wisdom",
    ],
  },
  {
    id: "q4",
    question: "What do you hope this reading reveals?",
    options: [
      "Why we are so deeply connected",
      "Whether our bond will last",
      "What we bring out in each other",
      "What the stars say about us",
    ],
  },
];

// ── Option pill card ─────────────────────────────────────────────────────────
function OptionCard({ label, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        padding: "13px 16px",
        textAlign: "left",
        background: selected ? `rgba(201,168,76,0.15)` : C.surface,
        border: `1.5px solid ${selected ? C.gold : C.border}`,
        borderRadius: 10,
        color: selected ? C.gold : C.cream,
        fontFamily: "Crimson Text, serif",
        fontSize: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: selected ? `0 0 12px rgba(201,168,76,0.2)` : "none",
      }}
    >
      {/* Radio dot */}
      <div style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `2px solid ${selected ? C.gold : C.border}`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s",
      }}>
        {selected && (
          <div style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: C.gold,
          }} />
        )}
      </div>
      {label}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function SoulmateQuestions({ userName, partnerName, nameDisplayOrder = "userFirst", onComplete, onBack }) {
  const [justCurious, setJustCurious] = useState(false);
  const [answers, setAnswers] = useState({ q1: null, q2: null, q3: null, q4: null });

  const questions = justCurious ? QUESTIONS_CURIOUS : QUESTIONS_ROMANTIC;
  const allAnswered = questions.every(q => answers[q.id] !== null);

  const handleToggle = () => {
    setJustCurious(v => !v);
    // Reset answers when switching — questions change
    setAnswers({ q1: null, q2: null, q3: null, q4: null });
  };

  const handleAnswer = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleComplete = () => {
    if (!allAnswered) return;
    onComplete(answers, justCurious);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 90,
      background: `linear-gradient(160deg, ${C.bg} 0%, #0d0820 50%, ${C.bg} 100%)`,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    }}>
      <div style={{
        maxWidth: 540,
        margin: "0 auto",
        padding: "0 16px 60px",
        boxSizing: "border-box",
      }}>

        {/* Back button */}
        <div style={{ paddingTop: 20, marginBottom: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1.5px solid #8b5cf6",
              color: C.purpleBright,
              fontFamily: "Cinzel, serif",
              fontSize: 12,
              letterSpacing: 1,
              cursor: "pointer",
              padding: "7px 16px",
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.color = C.purpleBright; }}
          >
            ← Back
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="/Mystic_Fortunes_Logo_cropped.webp"
            alt="Mystic Fortunes"
            style={{ width: "clamp(180px,60vw,280px)", height: "auto", display: "block", margin: "0 auto", filter: "drop-shadow(0 0 10px #c9a84c55)" }}
          />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24, padding: "0 8px" }}>
          <div style={{ fontFamily: "Cinzel,serif", fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
            ✦ The Bond Between {nameDisplayOrder === "partnerFirst" ? partnerName : userName} &amp; {nameDisplayOrder === "partnerFirst" ? userName : partnerName} ✦
          </div>
          <p style={{ fontFamily: "IM Fell English,serif", fontStyle: "italic", fontSize: 17, color: C.cream, margin: 0, lineHeight: 1.7, opacity: 0.92 }}>
            Madame Zafira must understand the nature of your connection before the lines can be fully interpreted.
          </p>
        </div>

        {/* Just Curious toggle */}
        <div style={{
          background: C.surface,
          border: `1px solid ${justCurious ? "#8b5cf6" : C.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          transition: "border-color 0.3s",
        }}>
          <div>
            <div style={{ fontFamily: "Cinzel,serif", fontSize: 12, color: justCurious ? C.purpleBright : C.purpleBright, letterSpacing: 1, marginBottom: 3, transition: "color 0.3s" }}>
              We are not a couple
            </div>
            <div style={{ fontFamily: "Crimson Text,serif", fontStyle: "italic", fontSize: 14, color: C.purple, lineHeight: 1.4 }}>
              We are just curious about our connection
            </div>
          </div>
          <button
            onClick={handleToggle}
            style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              background: justCurious ? "#8b5cf6" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(201,168,76,0.3)",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.3s",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <div style={{
              position: "absolute",
              top: 3,
              left: justCurious ? 26 : 3,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "white",
              transition: "left 0.3s",
              boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
          <span style={{ color: C.goldDim, fontSize: 12 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: 32, animation: "fadeIn 0.4s ease both", animationDelay: `${qi * 0.08}s` }}>
            <div style={{
              fontFamily: "Cinzel,serif",
              fontSize: 13,
              color: C.gold,
              letterSpacing: 1.5,
              marginBottom: 14,
              fontWeight: 600,
            }}>
              {qi + 1}. {q.question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map(opt => (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={answers[q.id] === opt}
                  onSelect={() => handleAnswer(q.id, opt)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${C.border})` }} />
          <span style={{ color: C.goldDim, fontSize: 12 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)` }} />
        </div>

        {/* Madame Zafira note */}
        <p style={{
          fontFamily: "IM Fell English,serif",
          fontStyle: "italic",
          fontSize: 15,
          color: C.purple,
          textAlign: "center",
          margin: "0 0 20px",
          lineHeight: 1.7,
          padding: "0 8px",
        }}>
          {allAnswered
            ? `The lines are ready to speak, ${userName || "Seeker"}…`
            : "Answer all four questions to reveal your reading."}
        </p>

        {/* Continue button */}
        <button
          onClick={handleComplete}
          disabled={!allAnswered}
          className="gold-btn"
          style={{
            width: "100%",
            padding: "15px",
            fontSize: 16,
            borderRadius: 12,
            letterSpacing: 1.5,
            opacity: allAnswered ? 1 : 0.4,
            cursor: allAnswered ? "pointer" : "not-allowed",
          }}
        >
          🔮 Reveal Our Connection
        </button>

        {/* Footer */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginTop:40,paddingTop:20,paddingBottom:16,borderTop:"1px solid rgba(201,168,76,0.15)",width:"100%"}}>
          <p style={{fontFamily:"Cinzel,serif",fontSize:"clamp(13px,3.5vw,16px)",color:"rgba(201,168,76,0.85)",margin:0,letterSpacing:"2px",textShadow:"0 0 12px rgba(201,168,76,0.4)"}}>🔮 MysticFortunes.AI</p>
          <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
            <a href="/privacy-policy" target="_blank" style={{color:"#ffe083",fontFamily:"Cinzel,serif",fontSize:11,letterSpacing:1,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>e.currentTarget.style.color="#b0405a"} onMouseLeave={e=>e.currentTarget.style.color="#ffe083"}>Privacy Policy</a>
            <span style={{color:"#2e1f40"}}>•</span>
            <a href="/terms-and-conditions" target="_blank" style={{color:"#ffe083",fontFamily:"Cinzel,serif",fontSize:11,letterSpacing:1,textDecoration:"none",transition:"color 0.3s"}} onMouseEnter={e=>e.currentTarget.style.color="#b0405a"} onMouseLeave={e=>e.currentTarget.style.color="#ffe083"}>Terms & Conditions</a>
          </div>
        </div>

      </div>
    </div>
  );
}
