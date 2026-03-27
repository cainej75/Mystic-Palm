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
  const onOneLine = (name1 + ' & ' + name2).length <= 26

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #080510;
          color: #e8d5b8;
          font-family: 'Crimson Text', Georgia, serif;
          padding: 24px 20px 40px;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .page-title {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 700;
          color: #c9a84c;
          text-align: center;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .heart { font-size: 36px; text-align: center; margin-bottom: 20px; }

        /* ── Harmony Score Box ── */
        .score-box {
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 16px;
          padding: 22px 18px;
          margin-bottom: 20px;
          text-align: center;
        }
        .score-label {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: #c9a84c;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .score-number {
          font-family: 'Cinzel', serif;
          font-size: 64px;
          font-weight: 700;
          color: #b0405a;
          line-height: 1;
          margin-bottom: 12px;
        }
        .insight-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 17px;
          color: #e8d5b8;
          line-height: 1.8;
        }

        /* ── Alignment ── */
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(201,168,76,0.4); }
        .divider-title {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 700;
          white-space: nowrap;
        }
        .alignment-section { margin-bottom: 22px; }
        .alignment-text {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 17px;
          color: #e8d5b8;
          line-height: 1.85;
        }

        /* ── Share Card ── */
        .share-card {
          background: linear-gradient(160deg, #0c0818 0%, #100c1a 50%, #0a0614 100%);
          border: 1px solid rgba(201,168,76,0.5);
          border-radius: 18px;
          padding: 26px 20px 22px;
          margin-bottom: 14px;
          position: relative;
          text-align: center;
        }
        .card-top-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        }
        .card-bottom-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        }
        .card-brand {
          font-family: 'Cinzel', serif;
          font-size: 15px;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: 3px;
          margin-bottom: 4px;
        }
        .card-subtitle {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: #c9a84c;
          letter-spacing: 4px;
          opacity: 0.85;
          margin-bottom: 14px;
        }
        .card-hr {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
          margin: 12px 0;
        }
        .card-names {
          font-family: 'Cinzel', serif;
          font-size: 17px;
          color: #b0405a;
          letter-spacing: 1px;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 14px;
        }
        .card-date-label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .card-date {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          color: #e8d5b8;
          margin-bottom: 14px;
        }
        .card-score {
          font-family: 'Cinzel', serif;
          font-size: 52px;
          font-weight: 700;
          color: #b0405a;
          line-height: 1;
          margin-bottom: 4px;
        }
        .card-score-label {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .card-insight {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 13px;
          color: #e8d5b8;
          line-height: 1.75;
          margin-bottom: 18px;
        }
        .card-footer {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        /* ── Lunar note ── */
        .lunar-note {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 16px;
          color: #a080b0;
          text-align: center;
          line-height: 1.7;
          margin-bottom: 30px;
          padding: 0 6px;
        }

        /* ── Footer ── */
        .footer {
          text-align: center;
          padding-top: 18px;
          border-top: 1px solid rgba(201,168,76,0.3);
        }
        .footer-brand {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          color: #c9a84c;
          letter-spacing: 5px;
          text-transform: uppercase;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>

      <!-- Header -->
      <div class="page-title">Your Cosmic Connection</div>
      <div class="heart">❤️</div>

      <!-- Harmony Score Box -->
      <div class="score-box">
        <div class="score-label">✦ Harmony Score ✦</div>
        <div class="score-number">${score}%</div>
        <div class="insight-text">${insight}</div>
      </div>

      <!-- Alignment -->
      <div class="alignment-section">
        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-title">Your Alignment</span>
          <div class="divider-line"></div>
        </div>
        <div class="alignment-text">${alignment}</div>
      </div>

      <!-- Share Card -->
      <div class="share-card">
        <div class="card-top-line"></div>
        <div class="card-brand">✦ Mystic Fortunes ✦</div>
        <div class="card-subtitle">Soulmate Connection</div>
        <div class="card-hr"></div>
        <div class="card-names">
          ${onOneLine
            ? `${name1} &amp; ${name2}`
            : `${name1}<br/><span style="font-size:13px;letter-spacing:3px">&amp;</span><br/>${name2}`
          }
        </div>
        <div class="card-date-label">Date</div>
        <div class="card-date">${dateStr}</div>
        <div class="card-hr"></div>
        <div class="card-score">${score}%</div>
        <div class="card-score-label">Harmony Score</div>
        <div class="card-hr"></div>
        <div class="card-insight">"${insight}"</div>
        <div class="card-footer">🔮 &nbsp; MYSTICFORTUNES.AI</div>
        <div class="card-bottom-line"></div>
      </div>

      <!-- Lunar note -->
      <div class="lunar-note">
        Your cosmic alignment shifts with each lunar cycle. Return in ${nextMonth} as new celestial patterns emerge — the tides may reveal a deeper dimension of your connection.
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-brand">✦ &nbsp; MYSTICFORTUNES.AI &nbsp; ✦</div>
      </div>

    </body>
    </html>
  `

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
