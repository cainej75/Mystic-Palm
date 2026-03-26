// src/utils/generateFullRevelationPDF.js
import html2pdf from 'html2pdf.js'

export async function generateFullRevelationPDF(reading, userName) {
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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
        
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
        
        .user-name {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: ${C.gold};
          margin-top: 15px;
        }
        
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border-left: 3px solid ${C.gold};
          background: rgba(42, 138, 122, 0.1);
        }
        
        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          color: ${C.teal};
          margin: 0 0 15px 0;
          font-weight: 700;
        }
        
        .section-content {
          font-size: 14px;
          line-height: 1.8;
          color: ${C.cream};
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
        
        .crystal-ball {
          text-align: center;
          font-size: 40px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">MYSTIC FORTUNES</h1>
          <h2 class="subtitle">Full Revelation</h2>
          <p class="user-name">${userName}</p>
        </div>
        
        ${reading.sections ? reading.sections.map(section => `
          <div class="section">
            <h3 class="section-title">${section.title}</h3>
            <p class="section-content">${section.content}</p>
          </div>
        `).join('') : ''}
        
        <div class="footer">
          <p>✦ MYSTICFORTUNES.AI ✦</p>
          <div class="crystal-ball">🔮</div>
        </div>
      </div>
    </body>
    </html>
  `

  const options = {
    margin: 10,
    filename: `${userName}-Full-Revelation.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }

  html2pdf().set(options).from(htmlContent).save()
}
