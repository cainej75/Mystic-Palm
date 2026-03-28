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

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;margin:0;padding:0;}
.page{
  background:#000;
  width:700px;
  padding:36px 36px 44px 36px;
  position:relative;
  outline:3px solid #c9a84c;
  outline-offset:-3px;
}
.corner{position:absolute;width:24px;height:24px;}
.c-tl{top:12px;left:12px;border-top:1.5px solid rgba(201,168,76,0.5);border-left:1.5px solid rgba(201,168,76,0.5);}
.c-tr{top:12px;right:12px;border-top:1.5px solid rgba(201,168,76,0.5);border-right:1.5px solid rgba(201,168,76,0.5);}
.c-bl{bottom:12px;left:12px;border-bottom:1.5px solid rgba(201,168,76,0.5);border-left:1.5px solid rgba(201,168,76,0.5);}
.c-br{bottom:12px;right:12px;border-bottom:1.5px solid rgba(201,168,76,0.5);border-right:1.5px solid rgba(201,168,76,0.5);}

/* Header */
.hdr{text-align:center;margin-bottom:10px;}
.hdr-title{font-family:'Cinzel',serif;font-size:32px;font-weight:700;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;line-height:1.1;}
.hdr-divider{height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:10px 0 12px;}
.hdr-meta{font-family:'IM Fell English',serif;font-style:italic;font-size:12px;color:#6a5870;letter-spacing:1px;margin-bottom:4px;}
.hdr-name{font-family:'IM Fell English',serif;font-style:italic;font-size:30px;color:#c9a84c;margin-bottom:16px;letter-spacing:1px;}

/* Boxes */
.box{border-radius:8px;padding:11px 14px;margin-bottom:8px;background:#0f0b18;border:1px solid #2e1f40;}
.box-rose  {border-left:3px solid #b0405a;}
.box-indigo{border-left:3px solid #6070d8;}
.box-teal  {border-left:3px solid #2a8a7a;}
.box-next30{background:linear-gradient(135deg,rgba(25,12,45,0.98),rgba(45,15,28,0.98));border:1px solid rgba(201,168,76,0.18);}

.box-label{font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;}
.lbl-rose  {color:#b0405a;}
.lbl-indigo{color:#6070d8;}
.lbl-teal  {color:#2a8a7a;}
.lbl-gold  {color:#c9a84c;}

.box-body{font-family:'Crimson Text',serif;font-style:italic;font-size:15.5px;color:#e8d5b8;line-height:1.8;}
.para{margin-bottom:10px;}
.para:last-child{margin-bottom:0;}

/* Footer */
.footer{text-align:center;margin-top:16px;padding-top:14px;border-top:1px solid rgba(201,168,76,0.22);}
.footer-brand{font-family:'Cinzel',serif;font-size:10px;color:rgba(201,168,76,0.5);letter-spacing:3px;text-transform:uppercase;}
.footer-date{font-family:'IM Fell English',serif;font-style:italic;font-size:11px;color:#6a5870;margin-top:2px;}
</style>
</head>
<body>
<div class="page">
  <div class="corner c-tl"></div>
  <div class="corner c-tr"></div>
  <div class="corner c-bl"></div>
  <div class="corner c-br"></div>

  <div class="hdr">
    <div class="hdr-title">Full Revelation</div>
    <div class="hdr-divider"></div>
    <div class="hdr-name">${name}</div>
    <div class="hdr-meta">${dobStr ? `Born ${dobStr} &nbsp;·&nbsp; ` : ''}${dateStr}</div>
  </div>

  <div class="box box-rose">
    <div class="box-label lbl-rose">💗 Heart Line</div>
    <div class="box-body">${reading?.heartLine || ''}</div>
  </div>

  <div class="box box-indigo">
    <div class="box-label lbl-indigo">🧠 Head Line</div>
    <div class="box-body">${reading?.headLine || ''}</div>
  </div>

  <div class="box box-teal">
    <div class="box-label lbl-teal">✋ Life Line</div>
    <div class="box-body">${reading?.lifeLine || ''}</div>
  </div>

  <div class="box">
    <div class="box-label lbl-teal">✨ Your Gift</div>
    <div class="box-body">${reading?.gift || ''}</div>
  </div>

  <div class="box">
    <div class="box-label lbl-rose">⚠ Heed This</div>
    <div class="box-body">${reading?.warning || ''}</div>
  </div>

  <div class="box">
    <div class="box-label lbl-indigo">🌀 Past Life Echo</div>
    <div class="box-body">${reading?.pastLife || ''}</div>
  </div>

  <div class="box box-next30">
    <div class="box-label lbl-gold">🌟 The Next 30 Days</div>
    <div class="box-body">${reading?.nearFuture || ''}</div>
  </div>

  <div class="box">
    <div class="box-label lbl-gold">✦ Madame La Voyante Speaks</div>
    <div class="box-body">
      ${fullReadingParas.map(p => `<div class="para">${p}</div>`).join('')}
    </div>
  </div>

  <div class="footer">
    <div class="footer-brand">✦ &nbsp; Madame La Voyante &nbsp; ✦</div>
    <div class="footer-date">Your personal palm reading &nbsp;·&nbsp; ${dateStr}</div>
  </div>
</div>
</body>
</html>`

  // Load html2canvas
  if (!window.html2canvas) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
      s.onload = res; s.onerror = rej
      document.head.appendChild(s)
    })
    await new Promise(r => setTimeout(r, 100))
  }

  // Load jsPDF
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = res; s.onerror = rej
      document.head.appendChild(s)
    })
    await new Promise(r => setTimeout(r, 100))
  }

  // Mount hidden container
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;background:#000;'
  wrap.innerHTML = htmlContent
  document.body.appendChild(wrap)
  const pageEl = wrap.querySelector('.page')

  // Wait for fonts
  await new Promise(r => setTimeout(r, 1200))

  try {
    // Render full page to canvas
    const canvas = await window.html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#000000',
      logging: false,
      width: pageEl.scrollWidth,
      height: pageEl.scrollHeight,
      windowWidth: pageEl.scrollWidth,
      windowHeight: pageEl.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.97)
    const { jsPDF } = window.jspdf

    // Calculate PDF dimensions to fit the entire canvas
    const pxW = canvas.width
    const pxH = canvas.height
    const pdfW = 210 // A4 width in mm
    const pdfH = Math.ceil((pxH / pxW) * pdfW)

    const pdf = new jsPDF({ unit: 'mm', format: [pdfW, pdfH], orientation: 'portrait' })
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH, '', 'FAST')
    pdf.save(`MadameLaVoyante_${name.replace(/\s+/g, '_')}_FullRevelation.pdf`)
  } finally {
    document.body.removeChild(wrap)
  }
}
