// src/utils/generatePartnerCompatibilityPDF.js
import html2pdf from 'html2pdf.js'

export async function generatePartnerCompatibilityPDF(reading, userName, partnerName, harmonyScore, alignmentText) {
  const C = {
    bg: "#080510",
    surface: "#100c1a",
    border: "#2e1f40",
    gold: "#c9a84c",
    goldDim: "#7a6530",
    rose: "#b0405a",
    roseDim: "#5c1a2a",
    teal: "#2a8a7a",
    cream: "#e8d5b8",
    muted: "#6a5870",
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
        
        body {
          margin: 0;
          padding: 40px;
          background: ${C.bg};
          color: ${C.cream};
          font-family: 'Crimson Text', serif;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 1px solid ${C.border};
          padding-bottom: 20px;
        }
        
        .title {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          color: ${C.gold};
          margin: 0;
          font-weight: 700;
        }
        
        .subtitle {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: ${C.rose};
          margin: 10px 0 0 0;
          font-weight: 600;
        }
        
        .names {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: ${C.gold};
          margin-top: 15px;
        }
        
        .names .and {
          color: ${C.rose};
          margin: 0 8px;
          font-weight: 700;
        }
        
        .share-card {
          background: ${C.surface};
          border: 2px solid ${C.gold};
          border-radius: 12px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
        }
        
        .harmony-score {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          color: ${C.rose};
          font-weight: 700;
          margin: 0 0 10px 0;
        }
        
        .harmony-label {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: ${C.muted};
          letter-spacing: 2px;
        }
        
        .alignment-section {
          background: rgba(160, 64, 90, 0.1);
          border-left: 3px solid ${C.rose};
          padding: 20px;
          margin: 30px 0;
        }
        
        .alignment-title {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          color: ${C.rose};
          margin: 0 0 15px 0;
          font-weight: 700;
        }
        
        .alignment-text {
          font-size: 14px;
          line-height: 1.8;
          color: ${C.cream};
          margin: 0;
        }
        
        .monthly-note {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          color: ${C.muted};
          font-style: italic;
          margin-top: 15px;
        }
        
        .footer {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid ${C.border};
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: ${C.goldDim};
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">MYSTIC FORTUNES</h1>
          <h2 class="subtitle">Your Alignment</h2>
          <div class="names">
            <span>${userName}</span>
            <span class="and">&</span>
            <span>${partnerName}</span>
          </div>
        </div>
        
        <div class="share-card">
          <p class="harmony-score">${harmonyScore}%</p>
          <p class="harmony-label">COSMIC ALIGNMENT</p>
        </div>
        
        <div class="alignment-section">
          <h3 class="alignment-title">Your Connection</h3>
          <p class="alignment-text">${alignmentText}</p>
          <p class="monthly-note">✦ This alignment changes monthly based on celestial movements</p>
        </div>
        
        <div class="footer">
          <p>✦ MYSTICFORTUNES.AI ✦</p>
        </div>
      </div>
    </body>
    </html>
  `

  const options = {
    margin: 10,
    filename: `${userName}-${partnerName}-Compatibility.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }

  html2pdf().set(options).from(htmlContent).save()
}
