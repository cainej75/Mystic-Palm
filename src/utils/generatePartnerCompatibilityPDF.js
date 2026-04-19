// src/utils/generatePartnerCompatibilityPDF.js
// Built on the same html2canvas + jsPDF pipeline as generateFullRevelationPDF.js

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

async function buildCroppedHero(base64src, targetW, targetH) {
  return new Promise((resolve) => {
    if (!base64src) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const c   = document.createElement('canvas');
      c.width   = targetW;
      c.height  = targetH;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#080510';
      ctx.fillRect(0, 0, targetW, targetH);
      const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const sw    = img.naturalWidth  * scale;
      const sh    = img.naturalHeight * scale;
      const dx    = (targetW - sw) / 2;
      const dy    = (targetH - sh) * 0.3;
      ctx.drawImage(img, dx, dy, sw, sh);
      const grad = ctx.createLinearGradient(0, 0, 0, targetH);
      grad.addColorStop(0,   'rgba(8,5,16,0.0)');
      grad.addColorStop(0.5, 'rgba(8,5,16,0.15)');
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
const HERO_H = 200;
const gold   = '#c9a84c';
const rose   = '#b0405a';
const bg     = '#080510';
const purple = '#c090ff';

const BLOCK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=IM+Fell+English:ital@0;1&family=Crimson+Text:ital,wght@0,400;1,400;1,600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  :root{--bg:#080510;--surface:#100c1a;--border:#2e1f40;--gold:#c9a84c;--rose:#b0405a;--teal:#2a8a7a;--indigo:#6070d8;--purple:#c090ff;--cream:#e8d5b8;}
  .block{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:13px 15px;}
  .block-gold{border-left:3px solid var(--gold);}
  .block-rose{border-left:3px solid var(--rose);}
  .block-teal{border-left:3px solid var(--teal);}
  .block-indigo{border-left:3px solid var(--indigo);}
  .block-purple{background:linear-gradient(135deg,rgba(80,30,120,0.3),rgba(30,10,60,0.5));border:1px solid rgba(192,144,255,0.3);border-left:3px solid var(--purple);}
  .block-label{font-family:'Cinzel',serif;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
  .lbl-gold{color:var(--gold);}.lbl-rose{color:var(--rose);}.lbl-teal{color:var(--teal);}.lbl-indigo{color:var(--indigo);}.lbl-purple{color:var(--purple);}
  .block-text{font-family:'Crimson Text',serif;font-style:italic;font-size:17px;color:var(--cream);line-height:1.74;}
  .score-box{background:linear-gradient(160deg,#0c0818 0%,#100c1a 50%,#0a0614 100%);border:2px solid rgba(201,168,76,0.6);border-radius:10px;padding:18px 24px;text-align:center;margin-bottom:10px;}
`;

function getZodiacPDF(bd) {
  if (!bd?.day || !bd?.month) return null;
  const d = bd.day, m = bd.month;
  if ((m===1&&d>=20)||(m===2&&d<=18)) return {sign:'Aquarius',  emoji:'♒'};
  if ((m===2&&d>=19)||(m===3&&d<=20)) return {sign:'Pisces',    emoji:'♓'};
  if ((m===3&&d>=21)||(m===4&&d<=19)) return {sign:'Aries',     emoji:'♈'};
  if ((m===4&&d>=20)||(m===5&&d<=20)) return {sign:'Taurus',    emoji:'♉'};
  if ((m===5&&d>=21)||(m===6&&d<=20)) return {sign:'Gemini',    emoji:'♊'};
  if ((m===6&&d>=21)||(m===7&&d<=22)) return {sign:'Cancer',    emoji:'♋'};
  if ((m===7&&d>=23)||(m===8&&d<=22)) return {sign:'Leo',       emoji:'♌'};
  if ((m===8&&d>=23)||(m===9&&d<=22)) return {sign:'Virgo',     emoji:'♍'};
  if ((m===9&&d>=23)||(m===10&&d<=22))return {sign:'Libra',     emoji:'♎'};
  if ((m===10&&d>=23)||(m===11&&d<=21))return{sign:'Scorpio',   emoji:'♏'};
  if ((m===11&&d>=22)||(m===12&&d<=21))return{sign:'Sagittarius',emoji:'♐'};
  return {sign:'Capricorn', emoji:'♑'};
}

export async function generatePartnerCompatibilityPDF(
  reading, name1, name2, harmonyScore, _alignmentText,
  pdfNarrative, soulmateAnswers, soulmateJustCurious
) {
  const today   = new Date();
  const dateStr = today.toLocaleDateString('en-AU', {day:'numeric',month:'long',year:'numeric'});
  const score   = harmonyScore || reading?.score || 88;
  const insight = reading?.insight || '';
  const headline = pdfNarrative?.headline || 'A Deeper Connection Reading';
  const connectionType = soulmateJustCurious ? 'connection' : 'soulmate connection';

  // Load scripts
  await Promise.all([
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
  ]);

  // Hero image
  const heroRaw = await imageToBase64('/soulmate-hero.webp');
  const heroPng = await buildCroppedHero(heroRaw, PAGE_W, HERO_H);
  const heroTag = heroPng
    ? `<img src="${heroPng}" width="${PAGE_W}" height="${HERO_H}" style="display:block;width:${PAGE_W}px;height:${HERO_H}px;" />`
    : `<div style="width:${PAGE_W}px;height:${HERO_H}px;background:#0d0520;display:block;"></div>`;

  // Bottom ornament bar
  const bottomBar = `
    <div style="width:100%;height:28px;position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;top:50%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.9) 20%,${gold} 50%,rgba(201,168,76,0.9) 80%,transparent);"></div>
      <span style="position:relative;z-index:1;font-family:'Cinzel',serif;font-size:13px;color:${gold};background:${bg};padding:0 14px;letter-spacing:4px;">💗 &nbsp; 💗</span>
    </div>`;

  // Page 1 header — names, signs, score, insight
  const p1Header = `
    <div style="text-align:center;padding-bottom:14px;">
      <div style="font-family:'Cinzel',serif;font-weight:700;font-size:28px;color:${gold};letter-spacing:4px;margin-bottom:6px;">${name1} &amp; ${name2}</div>
      <div style="font-family:'IM Fell English',serif;font-style:italic;font-size:15px;color:${gold};letter-spacing:1.5px;margin-bottom:5px;">✦ ${headline} ✦</div>
      <div style="font-family:'Cinzel',serif;font-size:12px;color:${gold};letter-spacing:1.5px;margin-bottom:14px;">${dateStr}</div>

      <div class="score-box">
        <div style="font-family:'Cinzel',serif;font-size:52px;font-weight:700;color:${rose};line-height:1;">${score}%</div>
        <div style="font-family:'Cinzel',serif;font-size:11px;color:${gold};letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Harmony Score</div>
        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent);margin:12px 0;"></div>
        <div style="font-family:'IM Fell English',serif;font-style:italic;font-size:16px;color:#e8d5b8;line-height:1.7;">"${insight}"</div>
      </div>
    </div>`;

  // The 6 narrative content blocks
  const narrativeBlocks = pdfNarrative ? [
    `<div class="block block-gold"><div class="block-label lbl-gold">💫 &nbsp; Celestial Compatibility</div><div class="block-text">${pdfNarrative.celestialCompatibility||''}</div></div>`,
    `<div class="block block-rose"><div class="block-label lbl-rose">💗 &nbsp; The Language of Love</div><div class="block-text">${pdfNarrative.languageOfLove||''}</div></div>`,
    `<div class="block block-teal"><div class="block-label lbl-teal">🌊 &nbsp; How You Found Each Other</div><div class="block-text">${pdfNarrative.howYouFoundEachOther||''}</div></div>`,
    `<div class="block block-indigo"><div class="block-label lbl-indigo">⚡ &nbsp; The Tension Between You</div><div class="block-text">${pdfNarrative.tensionBetweenYou||''}</div></div>`,
    `<div class="block block-gold"><div class="block-label lbl-gold">🌟 &nbsp; Your Path Forward</div><div class="block-text">${pdfNarrative.pathForward||''}</div></div>`,
    `<div class="block block-purple"><div class="block-label lbl-purple">✨ &nbsp; A Message From the Stars</div><div class="block-text" style="font-family:'IM Fell English',serif;">${pdfNarrative.messageFromTheStars||''}</div></div>`,
  ] : [];

  // Answers summary block (if available)
  const answersBlock = soulmateAnswers ? `
    <div class="block block-gold" style="background:rgba(201,168,76,0.06);">
      <div class="block-label lbl-gold">✦ &nbsp; Their Story</div>
      <div class="block-text" style="font-size:15px;">
        <div style="margin-bottom:6px;"><span style="color:${gold};font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;">HOW THEY MET</span><br/>${soulmateAnswers.q1||''}</div>
        <div style="margin-bottom:6px;"><span style="color:${gold};font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;">${soulmateJustCurious?'NATURE OF CONNECTION':'TIME TOGETHER'}</span><br/>${soulmateAnswers.q2||''}</div>
        <div style="margin-bottom:6px;"><span style="color:${gold};font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;">${soulmateJustCurious?'WHAT THEY ADMIRE':'WHAT DRAWS THEM'}</span><br/>${soulmateAnswers.q3||''}</div>
        <div><span style="color:${gold};font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;">${soulmateJustCurious?'WHAT THEY HOPE TO DISCOVER':'GREATEST CHALLENGE'}</span><br/>${soulmateAnswers.q4||''}</div>
      </div>
    </div>` : '';

  const allBlocks = narrativeBlocks.length
    ? [...narrativeBlocks, answersBlock].filter(Boolean)
    : [answersBlock].filter(Boolean);

  const blocks = arr => arr.map(b => `<div style="margin-bottom:10px;">${b}</div>`).join('');

  // Measure heights to paginate
  const HDR_H    = 220; // approx height of score box + names header on page 1
  const P1_AVAIL = PAGE_H - HERO_H - 16 - HDR_H - 28;

  let p1Blocks = [], p2Blocks = [], p3Blocks = [];
  if (allBlocks.length) {
    const heights = await measureBlocks(allBlocks, BLOCK_CSS);
    let used = 0;
    let onPage2 = false;
    let p2Used  = 0;
    const P2_AVAIL = PAGE_H - 36 - 28 - 60; // page 2: top padding + bottom bar + footer

    for (let i = 0; i < allBlocks.length; i++) {
      if (!onPage2 && used + heights[i] <= P1_AVAIL) {
        p1Blocks.push(allBlocks[i]);
        used += heights[i];
      } else if (!onPage2) {
        onPage2 = true;
        p2Blocks.push(allBlocks[i]);
        p2Used += heights[i];
      } else if (p2Used + heights[i] <= P2_AVAIL) {
        p2Blocks.push(allBlocks[i]);
        p2Used += heights[i];
      } else {
        p3Blocks.push(allBlocks[i]);
      }
    }
  }

  const footerHtml = `
    <div style="text-align:center;padding-top:16px;border-top:1px solid rgba(201,168,76,0.2);margin-top:4px;">
      <div style="font-family:'Cinzel',serif;font-size:12px;color:${gold};letter-spacing:4px;text-transform:uppercase;margin-bottom:5px;">✦ &nbsp; Madame Zafira &nbsp; ✦ &nbsp; MysticFortunes.ai</div>
      <div style="font-family:'IM Fell English',serif;font-style:italic;font-size:13px;color:${gold};">${name1} &amp; ${name2} &nbsp;·&nbsp; ${dateStr}</div>
    </div>`;

  // Build pages
  const page1Html = `
    <style>${BLOCK_CSS}</style>
    <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:${bg};overflow:hidden;">
      ${heroTag}
      <div style="padding:16px 52px 0;">
        ${p1Header}
        ${blocks(p1Blocks)}
      </div>
      <div style="padding:0 52px;">${bottomBar}</div>
    </div>`;

  const page2Html = p2Blocks.length ? `
    <style>${BLOCK_CSS}</style>
    <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:${bg};overflow:hidden;">
      <div style="padding:36px 52px 0;">
        ${blocks(p2Blocks)}
        ${p3Blocks.length ? '' : footerHtml}
      </div>
      <div style="padding:0 52px;">${bottomBar}</div>
    </div>` : null;

  const page3Html = p3Blocks.length ? `
    <style>${BLOCK_CSS}</style>
    <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:${bg};overflow:hidden;">
      <div style="padding:36px 52px 0;">
        ${blocks(p3Blocks)}
        ${footerHtml}
      </div>
      <div style="padding:0 52px;">${bottomBar}</div>
    </div>` : null;

  // Render pages
  const canvases = await Promise.all([
    renderPageToCanvas(page1Html, PAGE_W, PAGE_H),
    page2Html ? renderPageToCanvas(page2Html, PAGE_W, PAGE_H) : null,
    page3Html ? renderPageToCanvas(page3Html, PAGE_W, PAGE_H) : null,
  ]);

  const { jsPDF } = window.jspdf;
  const pdf  = new jsPDF({orientation:'portrait', unit:'px', format:'a4'});
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  pdf.addImage(canvases[0].toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pdfW, pdfH);
  if (canvases[1]) { pdf.addPage(); pdf.addImage(canvases[1].toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pdfW, pdfH); }
  if (canvases[2]) { pdf.addPage(); pdf.addImage(canvases[2].toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pdfW, pdfH); }

  const filename = `Mystic-Fortunes-${(name1||'').replace(/\s+/g,'-')}-${(name2||'').replace(/\s+/g,'-')}-${dateStr.replace(/\s+/g,'-')}.pdf`;
  pdf.save(filename);
}
