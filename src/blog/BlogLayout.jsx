import { Link } from 'react-router-dom';

export default function BlogLayout({ children, title, date, heroImage, heroAlt }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d0a14 0%, #120d1c 60%, #0a0a12 100%)',
      color: '#e8d5b8',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: '0 0 60px',
    }}>

      {/* Top bar */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <Link to="/" style={{
          color: '#c9a84c',
          textDecoration: 'none',
          fontSize: 13,
          letterSpacing: 1,
          fontFamily: "'Georgia', serif",
          opacity: 0.85,
        }}>
          ← Return to MysticFortunes
        </Link>
        <div style={{
          fontSize: 11,
          letterSpacing: 3,
          color: '#6a5870',
          textTransform: 'uppercase',
          fontFamily: "'Georgia', serif",
        }}>
          Madame Zafira's Insights
        </div>
      </div>

      {/* Post header */}
      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '52px 24px 36px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{
          fontSize: 11,
          letterSpacing: 4,
          color: '#c9a84c',
          textTransform: 'uppercase',
          marginBottom: 20,
          fontFamily: "'Georgia', serif",
        }}>
          ✦ &nbsp; Madame Zafira's Insights &nbsp; ✦
        </div>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: 700,
          lineHeight: 1.3,
          margin: '0 0 20px',
          color: '#e8d5b8',
          fontFamily: "'Georgia', serif",
        }}>
          {title}
        </h1>
        {date && (
          <div style={{
            fontSize: 13,
            color: '#6a5870',
            fontFamily: "'Georgia', serif",
            fontStyle: 'italic',
          }}>
            {date}
          </div>
        )}
      </div>

      {/* Hero image */}
      {heroImage && (
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '0 24px',
        }}>
          <img
            src={heroImage}
            alt={heroAlt || title}
            style={{
              width: '100%',
              maxHeight: 480,
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: 12,
              display: 'block',
              marginTop: 36,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      )}

      {/* Post content */}
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '48px 24px 0',
        fontSize: 'clamp(16px, 2.5vw, 18px)',
        lineHeight: 1.85,
        color: '#d4c4a8',
      }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: 680,
        margin: '60px auto 0',
        padding: '24px 24px 0',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        textAlign: 'center',
        fontSize: 13,
        color: '#6a5870',
        fontFamily: "'Georgia', serif",
        fontStyle: 'italic',
      }}>
        Madame Zafira is the resident oracle of MysticFortunes.ai — Ancient Wisdom, Modern Magic.
        <div style={{ marginTop: 16 }}>
          <Link to="/" style={{
            color: '#c9a84c',
            textDecoration: 'none',
            fontSize: 13,
            letterSpacing: 1,
          }}>
            ← Back to MysticFortunes
          </Link>
        </div>
      </div>

    </div>
  );
}
