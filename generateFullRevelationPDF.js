// src/utils/generateFullRevelationPDF.js

export async function generateFullRevelationPDF(reading, userName, birthDate) {
  const name    = userName || 'Seeker'
  const today   = new Date()
  const dateStr = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  // Format birth date
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  let dobStr = ''
  if (birthDate && birthDate.day && birthDate.month && birthDate.year) {
    dobStr = `${birthDate.day} ${MONTHS[birthDate.month - 1]} ${birthDate.year}`
  }

  const fullReadingParas = (reading?.fullReading || '').split('\n\n').filter(Boolean)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
          background: #000000;
          width: 794px;
        }

        .page {
          background: #000000;
          width: 794px;
          min-height: 1123px;
          padding: 32px 28px 44px;
          border: 3px solid #c9a84c;
          position: relative;
          font-family: 'Crimson Text', Georgia, serif;
          color: #e8d5b8;
        }

        /* Inner gold corner accents */
        .corner { position: absolute; width: 32px; height: 32px; }
        .corner-tl { top: 10px; left: 10px; border-top: 2px solid #c9a84c88; border-left: 2px solid #c9a84c88; }
        .corner-tr { top: 10px; right: 10px; border-top: 2px solid #c9a84c88; border-right: 2px solid #c9a84c88; }
        .corner-bl { bottom: 10px; left: 10px; border-bottom: 2px solid #c9a84c88; border-left: 2px solid #c9a84c88; }
        .corner-br { bottom: 10px; right: 10px; border-bottom: 2px solid #c9a84c88; border-right: 2px solid #c9a84c88; }

        /* ── Header ── */
        .header {
          text-align: center;
          margin-bottom: 22px;
        }
        .header-title {
          font-family: 'Cinzel', serif;
          font-size: 34px;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 0px;
        }
        .header-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin: 10px 0 8px;
        }
        .header-name {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          color: #c9a84c;
          letter-spacing: 3px;
          margin-bottom: 6px;
        }
        .header-meta {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 13px;
          color: #6a5870;
          letter-spacing: 1px;
        }

        /* ── Reading box ── */
        .reading-box {
          background: #100c1a;
          border: 1px solid #2e1f40;
          border-radius: 10px;
          padding: 13px 15px;
          margin-bottom: 9px;
        }
        .box-rose   { border-left: 3px solid #b0405a; }
        .box-indigo { border-left: 3px solid #6070d8; }
        .box-teal   { border-left: 3px solid #2a8a7a; }

        .box-heading {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 7px;
        }
        .color-rose   { color: #b0405a; }
        .color-indigo { color: #6070d8; }
        .color-teal   { color: #2a8a7a; }
        .color-gold   { color: #c9a84c; }

        .box-text {
          font-family: 'Crimson Text', serif;
          font-style: italic;
          font-size: 16px;
          color: #e8d5b8;
          line-height: 1.8;
        }

        /* ── Gift / Warning / Past Life ── */
        .reading-box-plain {
          background: #100c1a;
          border: 1px solid #2e1f40;
          border-radius: 10px;
          padding: 13px 15px;
          margin-bottom: 9px;
        }

        /* ── Next 30 Days ── */
        .reading-box-gradient {
          background: linear-gradient(135deg, rgba(25,12,45,0.95), rgba(45,15,28,0.95));
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 10px;
          padding: 13px 15px;
          margin-bottom: 9px;
        }

        /* ── Madame speaks ── */
        .madame-box {
          background: #100c1a;
          border: 1px solid #2e1f40;
          border-radius: 10px;
          padding: 13px 15px;
          margin-bottom: 9px;
        }
        .madame-para {
          font-family: 'Crimson Text', serif;
          font-style: italic;
          font-size: 16px;
          color: #e8d5b8;
          line-height: 1.85;
          margin-bottom: 11px;
        }
        .madame-para:last-child { margin-bottom: 0; }

        /* ── Footer ── */
        .footer {
          text-align: center;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(201,168,76,0.25);
        }
        .footer-brand {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          color: rgba(201,168,76,0.55);
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .footer-date {
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 11px;
          color: #6a5870;
          margin-top: 3px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Corner accents -->
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>

        <!-- Header -->
        <div class="header">
          <div class="header-title">Full Revelation</div>
          <div class="header-divider"></div>
          <div class="header-name">${name}</div>
          ${dobStr ? `<div class="header-meta">Born ${dobStr} &nbsp;·&nbsp; ${dateStr}</div>` : `<div class="header-meta">${dateStr}</div>`}
        </div>

        <!-- Heart Line -->
        <div class="reading-box box-rose">
          <div class="box-heading color-rose">💗 Heart Line</div>
          <div class="box-text">${reading?.heartLine || ''}</div>
        </div>

        <!-- Head Line -->
        <div class="reading-box box-indigo">
          <div class="box-heading color-indigo">🧠 Head Line</div>
          <div class="box-text">${reading?.headLine || ''}</div>
        </div>

        <!-- Life Line -->
        <div class="reading-box box-teal">
          <div class="box-heading color-teal">✋ Life Line</div>
          <div class="box-text">${reading?.lifeLine || ''}</div>
        </div>

        <!-- Your Gift -->
        <div class="reading-box-plain">
          <div class="box-heading color-teal">✨ Your Gift</div>
          <div class="box-text">${reading?.gift || ''}</div>
        </div>

        <!-- Heed This -->
        <div class="reading-box-plain">
          <div class="box-heading color-rose">⚠ Heed This</div>
          <div class="box-text">${reading?.warning || ''}</div>
        </div>

        <!-- Past Life Echo -->
        <div class="reading-box-plain">
          <div class="box-heading color-indigo">🌀 Past Life Echo</div>
          <div class="box-text">${reading?.pastLife || ''}</div>
        </div>

        <!-- Next 30 Days -->
        <div class="reading-box-gradient">
          <div class="box-heading color-gold">🌟 The Next 30 Days</div>
          <div class="box-text">${reading?.nearFuture || ''}</div>
        </div>

        <!-- Madame La Voyante Speaks -->
        <div class="madame-box">
          <div class="box-heading color-gold">✦ Madame La Voyante Speaks</div>
          ${fullReadingParas.map(p => `<p class="madame-para">${p}</p>`).join('')}
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-brand">✦ Madame La Voyante ✦</div>
          <div class="footer-date">Your personal palm reading — ${dateStr}</div>
        </div>
      </div>
    </body>
    </html>
  `

  // Dynamically load html2pdf
  if (!window.html2pdf) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
      s.onload = res
      s.onerror = rej
      document.head.appendChild(s)
    })
    await new Promise(r => setTimeout(r, 200))
  }

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;width:794px;'
  container.innerHTML = htmlContent
  document.body.appendChild(container)

  try {
    await window.html2pdf()
      .set({
        margin:        0,
        filename:      `MadameLaVoyante_${name.replace(/\s+/g,'_')}_FullRevelation.pdf`,
        image:         { type: 'jpeg', quality: 0.98 },
        html2canvas:   { scale: 2, useCORS: true, backgroundColor: '#000000', logging: false },
        jsPDF:         { unit: 'px', format: [794, 1123], orientation: 'portrait' },
        pagebreak:     { mode: ['avoid-all', 'css'] },
      })
      .from(container.querySelector('.page'))
      .save()
  } finally {
    document.body.removeChild(container)
  }
}
