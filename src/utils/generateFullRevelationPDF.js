// src/utils/generateFullRevelationPDF.js

export async function generateFullRevelationPDF(reading, userName, birthDate) {
  const name    = userName || 'Seeker'
  const today   = new Date()
  const dateStr = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  let dobStr = ''
  if (birthDate && birthDate.day && birthDate.month && birthDate.year) {
    dobStr = `${birthDate.day} ${MONTHS[birthDate.month - 1]} ${birthDate.year}`
  }

  const fullReadingParas = (reading?.fullReading || '').split('\n\n').filter(Boolean)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Full Revelation — ${name}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:     #080510;
  --surface:#100c1a;
  --border: #2e1f40;
  --gold:   #c9a84c;
  --rose:   #b0405a;
  --teal:   #2a8a7a;
  --indigo: #6070d8;
  --cream:  #e8d5b8;
}

html, body {
  background: var(--bg);
  color: var(--cream);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── Print button (hidden when printing) ── */
.print-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  background: #1a1000;
  border-bottom: 1px solid var(--gold);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
}
.print-bar p {
  font-family: 'Cinzel', serif;
  font-size: 12px;
  color: var(--cream);
  letter-spacing: 1px;
}
.print-btn {
  background: var(--gold);
  color: #080510;
  border: none;
  padding: 9px 22px;
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  border-radius: 6px;
  cursor: pointer;
}
.print-btn:hover { background: #e8d5b8; }

/* ── Page wrapper ── */
.page {
  max-width: 780px;
  margin: 64px auto 40px;
  padding: 40px 36px 48px;
  background: var(--bg);
  border: 2px solid var(--gold);
  border-radius: 2px;
  position: relative;
}

/* Corner ornaments */
.page::before, .page::after,
.page-inner::before, .page-inner::after {
  content: '';
  position: absolute;
  width: 28px;
  height: 28px;
}
.page::before  { top: 10px;    left: 10px;    border-top: 1.5px solid rgba(201,168,76,0.45); border-left:  1.5px solid rgba(201,168,76,0.45); }
.page::after   { top: 10px;    right: 10px;   border-top: 1.5px solid rgba(201,168,76,0.45); border-right: 1.5px solid rgba(201,168,76,0.45); }
.page-inner::before { bottom: 10px; left: 10px;    border-bottom: 1.5px solid rgba(201,168,76,0.45); border-left:  1.5px solid rgba(201,168,76,0.45); }
.page-inner::after  { bottom: 10px; right: 10px;   border-bottom: 1.5px solid rgba(201,168,76,0.45); border-right: 1.5px solid rgba(201,168,76,0.45); }
.page-inner { position: relative; }

/* ── Header ── */
.hdr { text-align: center; margin-bottom: 28px; }

.hdr-eye {
  font-size: 36px;
  margin-bottom: 10px;
  display: block;
}
.hdr-title {
  font-family: 'Cinzel', serif;
  font-size: 34px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 6px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 14px;
}
.hdr-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  margin: 0 auto 16px;
  max-width: 400px;
}
.hdr-name {
  font-family: 'Cinzel', serif;
  font-weight: 700;
  font-size: 34px;
  color: var(--gold);
  letter-spacing: 6px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 10px;
}
.hdr-meta {
  font-family: 'Cinzel', serif;
  font-size: 15px;
  color: var(--gold);
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 4px;
}
.hdr-sub {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 13px;
  color: var(--gold);
  letter-spacing: 2px;
  margin-top: 12px;
}

/* ── Page 2+ continued header ── */
.continued {
  display: none;
}
@media print {
  .continued {
    display: block;
    break-before: page;
    page-break-before: always;
    text-align: center;
    padding-top: 32px;
    margin-bottom: 20px;
  }
}
.continued-text {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--gold);
  letter-spacing: 2px;
}

/* ── Reading blocks ── */
.block {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
  page-break-inside: avoid;
}
.block-rose   { border-left: 3px solid var(--rose); }
.block-indigo { border-left: 3px solid var(--indigo); }
.block-teal   { border-left: 3px solid var(--teal); }
.block-next30 {
  background: linear-gradient(135deg, rgba(25,12,45,0.98), rgba(45,15,28,0.98));
  border: 1px solid rgba(201,168,76,0.22);
}
.block-zafira {
  background: linear-gradient(135deg, #0d0818, #100c1a);
  border: 1px solid rgba(201,168,76,0.3);
}

.block-label {
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.lbl-rose   { color: var(--rose); }
.lbl-indigo { color: var(--indigo); }
.lbl-teal   { color: var(--teal); }
.lbl-gold   { color: var(--gold); }

.block-text {
  font-family: 'Crimson Text', serif;
  font-style: italic;
  font-size: 17px;
  color: var(--cream);
  line-height: 1.85;
}
.block-text p { margin-bottom: 12px; }
.block-text p:last-child { margin-bottom: 0; }

/* ── Divider ── */
.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
  margin: 16px 0;
}

/* ── Footer ── */
.footer {
  text-align: center;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(201,168,76,0.2);
}
.footer-brand {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  color: rgba(201,168,76,0.55);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.footer-date {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 12px;
  color: rgba(201,168,76,0.35);
}

/* ── Print rules ── */
@media print {
  @page {
    margin: 0;
    size: A4;
  }
  html, body {
    background: #080510 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .print-bar { display: none !important; }
  .page {
    margin: 0 auto;
    border-radius: 0;
    max-width: 100%;
    width: 100%;
    min-height: 100vh;
    border-left: none;
    border-right: none;
    border-top: none;
  }
  .block { page-break-inside: avoid; }
}
</style>
</head>
<body>

<!-- Print bar — hidden on print -->
<div class="print-bar">
  <p>✦ &nbsp; Your Full Revelation is ready &nbsp; — &nbsp; Save as PDF below</p>
  <button class="print-btn" onclick="window.print()">📜 Save as PDF</button>
</div>

<div class="page">
  <div class="page-inner">

    <!-- Header -->
    <div class="hdr">
      <span class="hdr-eye">🔮</span>
      <div class="hdr-title">Full Revelation</div>
      <div class="hdr-divider"></div>
      <div class="hdr-name">${name}</div>
      <div class="hdr-meta">${dateStr}</div>
      <div class="hdr-sub">✦ &nbsp; A Personal Palm Reading by Madame Zafira &nbsp; ✦</div>
    </div>

    <!-- Continued marker — only visible on page 2+ when printing -->
    <div class="continued">
      <span class="continued-text">— continued —</span>
    </div>

    <!-- Heart Line -->
    <div class="block block-rose">
      <div class="block-label lbl-rose">💗 &nbsp; Heart Line</div>
      <div class="block-text">${reading?.heartLine || ''}</div>
    </div>

    <!-- Head Line -->
    <div class="block block-indigo">
      <div class="block-label lbl-indigo">🧠 &nbsp; Head Line</div>
      <div class="block-text">${reading?.headLine || ''}</div>
    </div>

    <!-- Life Line -->
    <div class="block block-teal">
      <div class="block-label lbl-teal">✋ &nbsp; Life Line</div>
      <div class="block-text">${reading?.lifeLine || ''}</div>
    </div>

    <div class="section-divider"></div>

    <!-- Continued — forces page 2 start here when printing -->
    <div class="continued">
      <span class="continued-text">— continued —</span>
    </div>

    <!-- Your Gift -->
    <div class="block block-teal">
      <div class="block-label lbl-teal">✨ &nbsp; Your Gift</div>
      <div class="block-text">${reading?.gift || ''}</div>
    </div>

    <!-- Heed This -->
    <div class="block block-rose">
      <div class="block-label lbl-rose">⚠ &nbsp; Heed This</div>
      <div class="block-text">${reading?.warning || ''}</div>
    </div>

    <!-- Past Life Echo -->
    <div class="block block-indigo">
      <div class="block-label lbl-indigo">🌀 &nbsp; Past Life Echo</div>
      <div class="block-text">${reading?.pastLife || ''}</div>
    </div>

    <div class="section-divider"></div>

    <!-- Next 30 Days -->
    <div class="block block-next30">
      <div class="block-label lbl-gold">🌟 &nbsp; The Next 30 Days</div>
      <div class="block-text">${reading?.nearFuture || ''}</div>
    </div>

    <!-- Madame Zafira Speaks -->
    <div class="block block-zafira">
      <div class="block-label lbl-gold">✦ &nbsp; Madame Zafira Speaks</div>
      <div class="block-text">
        ${fullReadingParas.map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">✦ &nbsp; Madame Zafira &nbsp; ✦ &nbsp; MysticFortunes.ai</div>
      <div class="footer-date">Your personal palm reading &nbsp;·&nbsp; ${dateStr}</div>
    </div>

  </div>
</div>

<script>
  // Auto-trigger print after fonts have loaded
  document.fonts.ready.then(() => {
    setTimeout(() => window.print(), 600)
  })
</script>
</body>
</html>`

  // Open in a new window
  const win = window.open('', '_blank', 'width=900,height=900')
  if (!win) {
    alert('Please allow pop-ups for this site to download your reading as a PDF.')
    return
  }
  win.document.write(html)
  win.document.close()
}
