// src/utils/generateFullRevelationPDF.js

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg:#080510; --surface:#100c1a; --border:#2e1f40;
    --gold:#c9a84c; --rose:#b0405a; --teal:#2a8a7a;
    --indigo:#6070d8; --cream:#e8d5b8;
  }
  .page {
    width:794px; height:1123px;
    background:var(--bg); color:var(--cream);
    padding:48px 52px 56px;
    overflow:hidden;
  }
  .hdr { text-align:center; margin-bottom:20px; }
  .hdr-name { font-family:'Cinzel',serif; font-weight:700; font-size:28px; color:var(--gold); letter-spacing:5px; text-transform:uppercase; line-height:1.1; margin-bottom:8px; }
  .hdr-meta { font-family:'Cinzel',serif; font-size:15px; color:var(--gold); letter-spacing:2px; margin-bottom:4px; }
  .hdr-sub  { font-family:'IM Fell English',serif; font-style:italic; font-size:13px; color:var(--gold); letter-spacing:1.5px; margin-top:8px; }
  .hdr-today{ font-family:'Cinzel',serif; font-size:13px; color:var(--gold); letter-spacing:1.5px; margin-top:6px; }
  .block { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:10px 13px; margin-bottom:10px; }
  .block-rose   { border-left:3px solid var(--rose); }
  .block-indigo { border-left:3px solid var(--indigo); }
  .block-teal   { border-left:3px solid var(--teal); }
  .block-next30 { background:linear-gradient(135deg,rgba(25,12,45,0.98),rgba(45,15,28,0.98)); border:1px solid rgba(201,168,76,0.22); }
  .block-zafira { background:linear-gradient(135deg,#0d0818,#100c1a); border:1px solid rgba(201,168,76,0.3); }
  .block-label  { font-family:'Cinzel',serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
  .lbl-rose   { color:var(--rose); }
  .lbl-indigo { color:var(--indigo); }
  .lbl-teal   { color:var(--teal); }
  .lbl-gold   { color:var(--gold); }
  .block-text { font-family:'Crimson Text',serif; font-style:italic; font-size:14px; color:var(--cream); line-height:1.72; }
  .block-text p { margin-bottom:8px; }
  .block-text p:last-child { margin-bottom:0; }
  .star-divider { display:flex; align-items:center; margin:12px 0; }
  .star-divider::before { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(201,168,76,0.6)); }
  .star-divider::after  { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(201,168,76,0.6),transparent); }
  .star-divider span { color:var(--gold); font-size:12px; padding:0 10px; line-height:1; }
  .footer { text-align:center; margin-top:18px; padding-top:14px; border-top:1px solid rgba(201,168,76,0.2); }
  .footer-brand { font-family:'Cinzel',serif; font-size:10px; color:var(--gold); letter-spacing:4px; text-transform:uppercase; margin-bottom:3px; }
  .footer-date  { font-family:'IM Fell English',serif; font-style:italic; font-size:11px; color:var(--gold); }
`;

async function renderPageToCanvas(html) {
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;';
  div.innerHTML = html;
  document.body.appendChild(div);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 400));
  const canvas = await window.html2canvas(div, {
    scale: 2,
    backgroundColor: '#080510',
    useCORS: true,
    logging: false,
    width: 794,
    height: 1123,
  });
  document.body.removeChild(div);
  return canvas;
}

export async function generateFullRevelationPDF(reading, userName, birthDate) {
  const name    = userName || 'Seeker';
  const today   = new Date();
  const dateStr = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const fullReadingParas = (reading?.fullReading || '').split('\n\n').filter(Boolean);

  // Build DOB string and zodiac
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dobStr = birthDate&&birthDate.day&&birthDate.month&&birthDate.year
    ? `${birthDate.day} ${MONTHS[birthDate.month-1]} ${birthDate.year}` : '';
  function getZodiacPDF(bd) {
    if (!bd||!bd.day||!bd.month) return null;
    const d=bd.day, m=bd.month;
    if((m===1&&d>=20)||(m===2&&d<=18))return{sign:'Aquarius',emoji:'♒'};
    if((m===2&&d>=19)||(m===3&&d<=20))return{sign:'Pisces',emoji:'♓'};
    if((m===3&&d>=21)||(m===4&&d<=19))return{sign:'Aries',emoji:'♈'};
    if((m===4&&d>=20)||(m===5&&d<=20))return{sign:'Taurus',emoji:'♉'};
    if((m===5&&d>=21)||(m===6&&d<=20))return{sign:'Gemini',emoji:'♊'};
    if((m===6&&d>=21)||(m===7&&d<=22))return{sign:'Cancer',emoji:'♋'};
    if((m===7&&d>=23)||(m===8&&d<=22))return{sign:'Leo',emoji:'♌'};
    if((m===8&&d>=23)||(m===9&&d<=22))return{sign:'Virgo',emoji:'♍'};
    if((m===9&&d>=23)||(m===10&&d<=22))return{sign:'Libra',emoji:'♎'};
    if((m===10&&d>=23)||(m===11&&d<=21))return{sign:'Scorpio',emoji:'♏'};
    if((m===11&&d>=22)||(m===12&&d<=21))return{sign:'Sagittarius',emoji:'♐'};
    return{sign:'Capricorn',emoji:'♑'};
  }
  const zodiac = getZodiacPDF(birthDate);
  const dobLine = dobStr ? `${dobStr}${zodiac ? '  ' + zodiac.emoji + ' ' + zodiac.sign : ''}` : '';

  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

  // PAGE 1 — header + all blocks including The Next 30 Days
  const page1Html = `
    <style>${SHARED_STYLES}</style>
    <div class="page">
      <div class="hdr">
        <div class="hdr-name">${name}</div>
        ${dobLine ? `<div class="hdr-meta">${dobLine}</div>` : ''}
        <div class="hdr-sub">✦ &nbsp; A Personal Palm Reading by Madame Zafira &nbsp; ✦</div>
        <div class="hdr-today">${dateStr}</div>
      </div>
      <div class="block block-rose">
        <div class="block-label lbl-rose">💗 &nbsp; Heart Line</div>
        <div class="block-text">${reading?.heartLine || ''}</div>
      </div>
      <div class="block block-indigo">
        <div class="block-label lbl-indigo">🧠 &nbsp; Head Line</div>
        <div class="block-text">${reading?.headLine || ''}</div>
      </div>
      <div class="block block-teal">
        <div class="block-label lbl-teal">✋ &nbsp; Life Line</div>
        <div class="block-text">${reading?.lifeLine || ''}</div>
      </div>
      <div class="star-divider"><span>✦</span></div>
      <div class="block block-teal">
        <div class="block-label lbl-teal">✨ &nbsp; Your Gift</div>
        <div class="block-text">${reading?.gift || ''}</div>
      </div>
      <div class="block block-rose">
        <div class="block-label lbl-rose">⚠ &nbsp; Heed This</div>
        <div class="block-text">${reading?.warning || ''}</div>
      </div>
      <div class="block block-indigo">
        <div class="block-label lbl-indigo">🌀 &nbsp; Past Life Echo</div>
        <div class="block-text">${reading?.pastLife || ''}</div>
      </div>
      <div class="star-divider"><span>✦</span></div>
      <div class="block block-next30">
        <div class="block-label lbl-gold">🌟 &nbsp; The Next 30 Days</div>
        <div class="block-text">${reading?.nearFuture || ''}</div>
      </div>
    </div>
  `;

  // PAGE 2 — no header, starts straight with Madame Zafira Speaks
  const page2Html = `
    <style>${SHARED_STYLES}</style>
    <div class="page">
      <div class="block block-zafira" style="padding-top:20px;">
        <div class="block-label lbl-gold">✦ &nbsp; Madame Zafira Speaks</div>
        <div class="block-text">
          ${fullReadingParas.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
      <div class="footer">
        <div class="footer-brand">✦ &nbsp; Madame Zafira &nbsp; ✦ &nbsp; MysticFortunes.ai</div>
        <div class="footer-date">Your personal palm reading &nbsp;·&nbsp; ${dateStr}</div>
      </div>
    </div>
  `;

  const [canvas1, canvas2] = await Promise.all([
    renderPageToCanvas(page1Html),
    renderPageToCanvas(page2Html),
  ]);

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  pdf.addImage(canvas1.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, pdfH);
  pdf.addPage();
  pdf.addImage(canvas2.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, pdfH);

  pdf.save(`Mystic-Fortunes-${name.replace(/\s+/g,'-')}-${dateStr.replace(/\s+/g,'-')}.pdf`);
}
