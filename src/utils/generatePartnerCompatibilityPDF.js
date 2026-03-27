// src/utils/generatePartnerCompatibilityPDF.js
import html2pdf from 'html2pdf.js'

export async function generatePartnerCompatibilityPDF(reading, userName, partnerName, harmonyScore, alignmentText) {
  const score     = harmonyScore || reading?.score || 88
  const insight   = reading?.insight   || ''
  const alignment = alignmentText || reading?.alignment || ''
  const name1     = userName    || 'You'
  const name2     = partnerName || 'Your Partner'
  const today     = new Date()
  const dateStr   = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const nextMonth = MONTHS[(today.getMonth() + 1) % 12]

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #080510;
          color: #e8d5b8;
          font-family: 'Crimson Text', Georgia, serif;
          width: 210mm;
          min-height: 297mm;
          padding: 0;
        }

        .page {
          background: linear-gradient(160deg, #0c0818 0%, #100c1a 40%, #0a0614 100%);
          min-height: 297mm;
          padding: 40px 50px 50px;
          position: relative;
          overflow: hidden;
        }

        /* Corner ornaments */
        .corner { position: absolute; width: 60px; height: 60px; }
        .corner-tl { top: 16px; left: 16px; border-top: 2px solid #c9a84c; border-left: 2px solid #c9a84c; }
        .corner-tr { top: 16px; right: 16px; border-top: 2px solid #c9a84c; border-right: 2px solid #c9a84c; }
        .corner-bl { bottom: 16px; left: 16px; border-bottom: 2px solid #c9a84c; border-left: 2px solid #c9a84c; }
        .corner-br { bottom: 16px; right: 16px; border-bottom: 2px solid #c9a84c; border-right: 2px solid #c9a84c; }

        /* Top border shimmer */
        .top-border {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8d5b8, #c9a84c, transparent);
        }
        .bottom-border {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8d5b8, #c9a84c, transparent);
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(201,168,76,0.3);
          position: relative;
        }

        .brand {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: #c9a84c;
          letter-spacing: 6px;
          text-transform: uppercase;
          margin-bottom: 14px;
          opacity: 0.8;
        }

        .main-title {
          font-family: 'Cinzel', serif;
          font-size: 38px;
          font-weight: 900;
          color: #c9a84c;
          letter-spacing: 3px;
          line-height: 1.1;
          margin-bottom: 6px;
          text-shadow: 0 0 40px rgba(201,168,76,0.4);
        }

        .sub-title {
          font-family: 'IM Fell English', serif;
          font-size: 16px;
          font-style: italic;
          color: #b0405a;
          letter-spacing: 1px;
          margin-bottom: 20px;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent);
        }
        .divider-gem { color: #c9a84c; font-size: 14px; }

        /* Names banner */
        .names-banner {
          background: linear-gradient(135deg, rgba(176,64,90,0.15), rgba(201,168,76,0.08));
          border: 1px solid rgba(176,64,90,0.4);
          border-radius: 12px;
          padding: 18px 30px;
          text-align: center;
          margin-bottom: 28px;
        }

        .names-label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          color: rgba(201,168,76,0.6);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .names-text {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          color: #b0405a;
          letter-spacing: 2px;
        }

        .names-ampersand {
          color: #c9a84c;
          margin: 0 10px;
          font-size: 20px;
        }

        .names-date {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: rgba(201,168,76,0.5);
          letter-spacing: 2px;
          margin-top: 8px;
        }

        /* Score panel */
        .score-panel {
          background: linear-gradient(160deg, rgba(176,64,90,0.12), rgba(120,30,60,0.08));
          border: 1px solid rgba(176,64,90,0.5);
          border-radius: 16px;
          padding: 30px 24px;
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .score-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #b0405a, transparent);
        }

        .score-label {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: #c9a84c;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .score-number {
          font-family: 'Cinzel', serif;
          font-size: 88px;
          font-weight: 900;
          color: #b0405a;
          line-height: 1;
          margin-bottom: 4px;
          text-shadow: 0 0 60px rgba(176,64,90,0.6);
        }

        .score-percent {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          color: #b0405a;
        }

        .score-sublabel {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: rgba(201,168,76,0.7);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-top: 6px;
        }

        /* Quote / insight */
        .insight-block {
          background: rgba(201,168,76,0.05);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 12px;
          padding: 22px 28px;
          margin-bottom: 24px;
          text-align: center;
        }

        .insight-title {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          color: rgba(201,168,76,0.6);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .insight-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 16px;
          color: #e8d5b8;
          line-height: 1.9;
        }

        /* Alignment section */
        .alignment-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4));
        }
        .section-line-r {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(201,168,76,0.4), transparent);
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 700;
          white-space: nowrap;
        }

        .alignment-box {
          background: linear-gradient(135deg, rgba(42,138,122,0.08), rgba(10,6,20,0.5));
          border: 1px solid rgba(42,138,122,0.3);
          border-left: 3px solid #2a8a7a;
          border-radius: 0 10px 10px 0;
          padding: 20px 24px;
        }

        .alignment-text {
          font-family: 'IM Fell English', serif;
          font-size: 15px;
          font-style: italic;
          color: #e8d5b8;
          line-height: 1.95;
        }

        /* Lunar note */
        .lunar-note {
          background: rgba(106,88,112,0.1);
          border: 1px solid rgba(106,88,112,0.3);
          border-radius: 10px;
          padding: 16px 22px;
          margin-bottom: 30px;
          text-align: center;
        }

        .lunar-text {
          font-family: 'Crimson Text', serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(232,213,184,0.65);
          line-height: 1.7;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding-top: 24px;
          border-top: 1px solid rgba(201,168,76,0.25);
        }

        .footer-brand {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: #c9a84c;
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 6px;
          opacity: 0.8;
        }

        .footer-tagline {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 12px;
          color: rgba(201,168,76,0.4);
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="top-border"></div>
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>

        <!-- Header -->
        <div class="header">
          <div class="brand">✦ Mystic Fortunes ✦</div>
          <div class="main-title">Your Cosmic Connection</div>
          <div class="sub-title">A Soulmate Compatibility Reading</div>
          <div class="divider">
            <div class="divider-line"></div>
            <span class="divider-gem">❤️</span>
            <div class="divider-line"></div>
          </div>
        </div>

        <!-- Names -->
        <div class="names-banner">
          <div class="names-label">✦ Reading Prepared For ✦</div>
          <div class="names-text">
            ${name1}
            <span class="names-ampersand">&</span>
            ${name2}
          </div>
          <div class="names-date">${dateStr}</div>
        </div>

        <!-- Score -->
        <div class="score-panel">
          <div class="score-label">✦ Harmony Score ✦</div>
          <div class="score-number">${score}<span class="score-percent">%</span></div>
          <div class="score-sublabel">Cosmic Alignment</div>
        </div>

        <!-- Insight quote -->
        ${insight ? `
        <div class="insight-block">
          <div class="insight-title">✦ The Stars Speak ✦</div>
          <div class="insight-text">"${insight}"</div>
        </div>
        ` : ''}

        <!-- Alignment -->
        ${alignment ? `
        <div class="alignment-section">
          <div class="section-header">
            <div class="section-line"></div>
            <span class="section-title">Your Alignment</span>
            <div class="section-line-r"></div>
          </div>
          <div class="alignment-box">
            <div class="alignment-text">${alignment}</div>
          </div>
        </div>
        ` : ''}

        <!-- Lunar note -->
        <div class="lunar-note">
          <div class="lunar-text">
            🌙 &nbsp; Your cosmic alignment shifts with each lunar cycle. Return in ${nextMonth} as new celestial patterns emerge — the tides may reveal a deeper dimension of your connection.
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-brand">✦ &nbsp; MYSTICFORTUNES.AI &nbsp; ✦</div>
          <div class="footer-tagline">Where the stars reveal what the heart already knows</div>
        </div>

        <div class="bottom-border"></div>
      </div>
    </body>
    </html>
  `

  // Wait for fonts to load before rendering
  await new Promise(resolve => setTimeout(resolve, 1500))

  const options = {
    margin: 0,
    filename: `${name1}-${name2}-Cosmic-Connection.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#080510',
      logging: false,
    },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  }

  html2pdf().set(options).from(htmlContent).save()
}
