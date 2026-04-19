// src/utils/generateFullRevelationPDF.js

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function imageToBase64(url) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.onerror   = reject;
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

// Pre-crop and composite the hero into an exactly-sized PNG.
// Returns a base64 PNG that is exactly targetW × targetH pixels.
// html2canvas can render this as a plain <img> with no cropping tricks needed.
async function buildCroppedHero(base64src, targetW, targetH) {
  return new Promise((resolve) => {
    if (!base64src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const c   = document.createElement('canvas');
      c.width   = targetW;
      c.height  = targetH;
      const ctx = c.getContext('2d');
      // Dark background
      ctx.fillStyle = '#080510';
      ctx.fillRect(0, 0, targetW, targetH);
      // Cover-crop: scale so image fills width, anchor vertically at 30%
      const scale  = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const sw     = img.naturalWidth  * scale;
      const sh     = img.naturalHeight * scale;
      const dx     = (targetW - sw) / 2;
      const dy     = (targetH - sh) * 0.3;
      ctx.drawImage(img, dx, dy, sw, sh);
      // Gradient overlay fading to solid dark at bottom
      const grad = ctx.createLinearGradient(0, 0, 0, targetH);
      grad.addColorStop(0,   'rgba(8,5,16,0.0)');
      grad.addColorStop(0.6, 'rgba(8,5,16,0.0)');
      grad.addColorStop(1,   'rgba(8,5,16,1.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, targetW, targetH);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = base64src;
  });
}

async function renderPageToCanvas(html, width, height) {
  const div = document.createElement('div');
  div.style.cssText = `position:fixed;left:-9999px;top:0;width:${width}px;`;
  div.innerHTML     = html;
  document.body.appendChild(div);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 800));
  const canvas = await window.html2canvas(div, {
    scale:           2,
    backgroundColor: '#080510',
    useCORS:         true,
    allowTaint:      true,
    logging:         false,
    imageTimeout:    0,
    width,
    height,
  });
  document.body.removeChild(div);
  return canvas;
}

async function measureBlocks(blocks, css) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:690px;';
  wrap.innerHTML     = `<style>${css}</style>` +
    blocks.map(h => `<div class="mb">${h}</div>`).join('');
  document.body.appendChild(wrap);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 250));
  const heights = [...wrap.querySelectorAll('.mb')].map(el => el.offsetHeight + 10);
  document.body.removeChild(wrap);
  return heights;
}

const PAGE_W = 794;
const PAGE_H = 1123;
const HERO_H = 190;
const gold   = '#c9a84c';
const bg     = '#080510';

const BLOCK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--bg:#080510;--surface:#100c1a;--border:#2e1f40;--gold:#c9a84c;--rose:#b0405a;--teal:#2a8a7a;--indigo:#6070d8;--cream:#e8d5b8;}
  .block{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:13px 15px;}
  .block-rose{border-left:3px solid var(--rose);}
  .block-indigo{border-left:3px solid var(--indigo);}
  .block-teal{border-left:3px solid var(--teal);}
  .block-gold{border-left:3px solid var(--gold);}
  .block-next30{background:linear-gradient(135deg,rgba(25,12,45,0.98),rgba(45,15,28,0.98));border:1px solid rgba(201,168,76,0.22);}
  .block-zafira{background:linear-gradient(135deg,#0d0818,#100c1a);border:1px solid rgba(201,168,76,0.3);}
  .block-label{font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
  .lbl-rose{color:var(--rose);}.lbl-indigo{color:var(--indigo);}.lbl-teal{color:var(--teal);}.lbl-gold{color:var(--gold);}
  .block-text{font-family:'Crimson Text',serif;font-style:italic;font-size:17px;color:var(--cream);line-height:1.74;}
  .block-text p{margin-bottom:10px;}.block-text p:last-child{margin-bottom:0;}
`;

export async function generateFullRevelationPDF(reading, userName, birthDate) {
  const name      = userName || 'Seeker';
  const today     = new Date();
  const dateStr   = today.toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});
  const fullParas = (reading?.fullReading||'').split('\n\n').filter(Boolean);

  const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dobStr = birthDate?.day&&birthDate?.month&&birthDate?.year
    ? `${birthDate.day} ${MONTHS[birthDate.month-1]} ${birthDate.year}` : '';

  function getZodiacPDF(bd){
    if(!bd?.day||!bd?.month)return null;
    const d=bd.day,m=bd.month;
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
  const zodiac  = getZodiacPDF(birthDate);
  const dobLine = dobStr?`${dobStr}${zodiac?'  '+zodiac.emoji+' '+zodiac.sign:''}`:'' ;

  const ap = reading?.astroProfile;
  let astroLine='';
  if(ap){
    const pts=[];
    if(ap.moonSign)  pts.push(`🌙 ${ap.moonSign} Moon`);
    if(ap.risingSign)pts.push(`⬆ ${ap.risingSign} Rising`);
    if(ap.lifePath)  pts.push(`✦ Life Path ${ap.lifePath}`);
    if(ap.birthPlace)pts.push(`📍 ${ap.birthPlace}`);
    if(pts.length)   astroLine=pts.join('  ·  ');
  }

  const [heroRaw] = await Promise.all([
    imageToBase64('/crystal-candles.webp'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
  ]);

  // Build a perfectly sized 794×190 PNG — no cropping tricks in the HTML needed
  const heroPng = await buildCroppedHero(heroRaw, PAGE_W, HERO_H);

  // All content blocks
  const allBlocks = [
    `<div class="block block-rose"><div class="block-label lbl-rose">💗 &nbsp; Heart Line</div><div class="block-text">${reading?.heartLine||''}</div></div>`,
    `<div class="block block-indigo"><div class="block-label lbl-indigo">🧠 &nbsp; Head Line</div><div class="block-text">${reading?.headLine||''}</div></div>`,
    `<div class="block block-teal"><div class="block-label lbl-teal">✋ &nbsp; Life Line</div><div class="block-text">${reading?.lifeLine||''}</div></div>`,
    `<div class="block block-gold"><div class="block-label lbl-gold">🌟 &nbsp; Fate Line</div><div class="block-text">${reading?.fateLine||''}</div></div>`,
    `<div class="block block-teal"><div class="block-label lbl-teal">✨ &nbsp; Your Gift</div><div class="block-text">${reading?.gift||''}</div></div>`,
    `<div class="block block-rose"><div class="block-label lbl-rose">⚠ &nbsp; Heed This</div><div class="block-text">${reading?.warning||''}</div></div>`,
    `<div class="block block-indigo"><div class="block-label lbl-indigo">🌀 &nbsp; Past Life Echo</div><div class="block-text">${reading?.pastLife||''}</div></div>`,
    `<div class="block block-next30"><div class="block-label lbl-gold">🌟 &nbsp; The Coming Months</div><div class="block-text">${reading?.nearFuture||''}</div></div>`,
    `<div class="block block-zafira"><div class="block-label lbl-gold">✦ &nbsp; Your True Path</div><div class="block-text">${fullParas.map(p=>`<p>${p}</p>`).join('')}</div></div>`,
  ];

  const heights  = await measureBlocks(allBlocks, BLOCK_CSS);
  const HDR_H    = astroLine ? 155 : 130;
  const P1_AVAIL = PAGE_H - HERO_H - 16 - HDR_H - 28;
  const PN_AVAIL = PAGE_H - 36 - 28 - 70; // subsequent pages: top pad + bottom bar + footer

  // Pack blocks into pages greedily
  const pages = [];
  let current = [], used = 0, avail = P1_AVAIL;
  for (let i = 0; i < allBlocks.length; i++) {
    if (used + heights[i] <= avail) {
      current.push(allBlocks[i]); used += heights[i];
    } else {
      pages.push(current); current = [allBlocks[i]]; used = heights[i]; avail = PN_AVAIL;
    }
  }
  if (current.length) pages.push(current);
  if (pages.length === 0) pages.push([]);

  const p1 = pages[0];
  const extraPages = pages.slice(1);

  const hdrHtml = `
    <div style="text-align:center;padding-bottom:14px;">
      <div style="font-family:'Cinzel',serif;font-weight:700;font-size:32px;color:${gold};letter-spacing:5px;text-transform:uppercase;margin-bottom:8px;">${name}</div>
      ${dobLine  ?`<div style="font-family:'Cinzel',serif;font-size:16px;color:${gold};letter-spacing:2px;margin-bottom:5px;">${dobLine}</div>`:''}
      ${astroLine?`<div style="font-family:'Cinzel',serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:1.5px;margin-bottom:6px;line-height:1.7;">${astroLine}</div>`:''}
      <div style="font-family:'IM Fell English',serif;font-style:italic;font-size:14px;color:${gold};letter-spacing:1.5px;margin-top:5px;">✦ &nbsp; A Personal Palm Reading by Madame Zafira &nbsp; ✦</div>
      <div style="font-family:'Cinzel',serif;font-size:13px;color:${gold};letter-spacing:1.5px;margin-top:5px;">${dateStr}</div>
    </div>`;

  const bottomBar = `
    <div style="width:100%;height:28px;position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.9) 20%,${gold} 50%,rgba(201,168,76,0.9) 80%,transparent);"></div>
      <span style="position:relative;z-index:1;font-family:'Cinzel',serif;font-size:13px;color:${gold};background:${bg};padding:0 14px;letter-spacing:4px;">✦ &nbsp; ✦ &nbsp; ✦</span>
    </div>`;

  const blocks = arr => arr.map(b=>`<div style="margin-bottom:10px;">${b}</div>`).join('');

  // Hero: pre-cropped 794×190 PNG rendered as a plain <img> — exact dimensions, no tricks
  const heroTag = heroPng
    ? `<img src="${heroPng}" width="${PAGE_W}" height="${HERO_H}" style="display:block;width:${PAGE_W}px;height:${HERO_H}px;" />`
    : `<div style="width:${PAGE_W}px;height:${HERO_H}px;background:#0d0520;display:block;"></div>`;

  const footerHtml = `
    <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(201,168,76,0.2);margin-top:4px;">
      <div style="font-family:'Cinzel',serif;font-size:12px;color:${gold};letter-spacing:4px;text-transform:uppercase;margin-bottom:5px;">✦ &nbsp; Madame Zafira &nbsp; ✦ &nbsp; MysticFortunes.ai</div>
      <div style="font-family:'IM Fell English',serif;font-style:italic;font-size:13px;color:${gold};">Your personal palm reading &nbsp;·&nbsp; ${dateStr}</div>
    </div>`;

  const page1Html = `
    <style>${BLOCK_CSS}</style>
    <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:${bg};overflow:hidden;">
      ${heroTag}
      <div style="padding:16px 52px 0;">
        ${hdrHtml}
        ${blocks(p1)}
      </div>
      <div style="padding:0 52px;">${bottomBar}</div>
    </div>`;

  const extraPageHtmls = extraPages.map((pageBlocks, i) => {
    const isLast = i === extraPages.length - 1;
    return `
      <style>${BLOCK_CSS}</style>
      <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:${bg};overflow:hidden;">
        <div style="padding:36px 52px 0;">
          ${blocks(pageBlocks)}
          ${isLast ? footerHtml : ''}
        </div>
        <div style="padding:0 52px;">${bottomBar}</div>
      </div>`;
  });

  const canvases = await Promise.all([
    renderPageToCanvas(page1Html, PAGE_W, PAGE_H),
    ...extraPageHtmls.map(h => renderPageToCanvas(h, PAGE_W, PAGE_H)),
  ]);

  const { jsPDF } = window.jspdf;
  const pdf  = new jsPDF({orientation:'portrait', unit:'px', format:'a4'});
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  canvases.forEach((c, i) => {
    if (i > 0) pdf.addPage();
    pdf.addImage(c.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pdfW, pdfH);
  });

  pdf.save(`Mystic-Fortunes-${name.replace(/\s+/g,'-')}-${dateStr.replace(/\s+/g,'-')}.pdf`);
}
