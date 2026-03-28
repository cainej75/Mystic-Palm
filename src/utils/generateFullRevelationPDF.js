// src/utils/generateFullRevelationPDF.js

async function loadPdfMake() {
  if (window.pdfMake) return window.pdfMake

  await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js'
    s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
  await new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js'
    s.onload = res; s.onerror = rej
    document.head.appendChild(s)
  })
  await new Promise(r => setTimeout(r, 200))
  return window.pdfMake
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const BG       = '#080510'
const SURFACE  = '#100c1a'
const GOLD     = '#c9a84c'
const GOLD_DIM = '#7a6020'
const ROSE     = '#b0405a'
const TEAL     = '#2a8a7a'
const INDIGO   = '#6070d8'
const CREAM    = '#e8d5b8'
const DARK_BG  = '#0d0818'
const NEXT_BG  = '#190c2d'

// ─── Thin gold rule ───────────────────────────────────────────────────────────
function divider() {
  return {
    canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: GOLD_DIM }],
    margin: [0, 8, 0, 10],
  }
}

// ─── Block with left-accent bar ───────────────────────────────────────────────
function block({ label, text, accentColor, labelColor, bgColor }) {
  const paras = (text || '—').split('\n\n').filter(Boolean)
  return {
    table: {
      widths: [3, '*'],
      body: [[
        { text: '', fillColor: accentColor || '#2e1f40', border: [false,false,false,false] },
        {
          stack: [
            { text: label, bold: true, fontSize: 8, color: labelColor || GOLD, characterSpacing: 1.8, margin: [0,0,0,5] },
            ...paras.map((p, i) => ({
              text: p,
              italics: true,
              fontSize: 11.5,
              color: CREAM,
              lineHeight: 1.7,
              margin: [0, 0, 0, i < paras.length - 1 ? 7 : 0],
            })),
          ],
          fillColor: bgColor || SURFACE,
          border: [false,false,false,false],
          margin: [10, 10, 10, 10],
        },
      ]],
    },
    layout: {
      defaultBorder: false,
      paddingLeft: () => 0, paddingRight: () => 0,
      paddingTop:  () => 0, paddingBottom: () => 0,
    },
    margin: [0, 0, 0, 8],
  }
}

// ─── Block without accent bar (gold bordered) ─────────────────────────────────
function goldBlock({ label, text, bgColor }) {
  const paras = (text || '—').split('\n\n').filter(Boolean)
  return {
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: label, bold: true, fontSize: 8, color: GOLD, characterSpacing: 1.8, margin: [0,0,0,5] },
          ...paras.map((p, i) => ({
            text: p,
            italics: true,
            fontSize: 11.5,
            color: CREAM,
            lineHeight: 1.7,
            margin: [0, 0, 0, i < paras.length - 1 ? 7 : 0],
          })),
        ],
        fillColor: bgColor || SURFACE,
        border: [false,false,false,false],
        margin: [12, 10, 12, 10],
      }]],
    },
    layout: { defaultBorder: false },
    margin: [0, 0, 0, 8],
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateFullRevelationPDF(reading, userName, birthDate) {
  const pdfMake = await loadPdfMake()

  const name = userName || 'Seeker'
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  let dobStr = ''
  if (birthDate?.day && birthDate?.month && birthDate?.year) {
    dobStr = `${birthDate.day} ${MONTHS[birthDate.month - 1]} ${birthDate.year}`
  }

  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [42, 42, 42, 42],

    // Black background + gold border on every page
    background: (currentPage, pageSize) => ({
      canvas: [
        // Full black fill
        { type: 'rect', x: 0, y: 0, w: pageSize.width, h: pageSize.height, color: BG },
        // Gold outer border rectangle
        { type: 'rect', x: 16, y: 16, w: pageSize.width - 32, h: pageSize.height - 32, lineWidth: 1.5, lineColor: GOLD, color: null },
        // Corner accent — top-left
        { type: 'line', x1: 16, y1: 38, x2: 16, y2: 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        { type: 'line', x1: 16, y1: 16, x2: 38, y2: 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        // Corner accent — top-right
        { type: 'line', x1: pageSize.width - 38, y1: 16, x2: pageSize.width - 16, y2: 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        { type: 'line', x1: pageSize.width - 16, y1: 16, x2: pageSize.width - 16, y2: 38, lineWidth: 1.2, lineColor: GOLD_DIM },
        // Corner accent — bottom-left
        { type: 'line', x1: 16, y1: pageSize.height - 38, x2: 16, y2: pageSize.height - 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        { type: 'line', x1: 16, y1: pageSize.height - 16, x2: 38, y2: pageSize.height - 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        // Corner accent — bottom-right
        { type: 'line', x1: pageSize.width - 38, y1: pageSize.height - 16, x2: pageSize.width - 16, y2: pageSize.height - 16, lineWidth: 1.2, lineColor: GOLD_DIM },
        { type: 'line', x1: pageSize.width - 16, y1: pageSize.height - 38, x2: pageSize.width - 16, y2: pageSize.height - 16, lineWidth: 1.2, lineColor: GOLD_DIM },
      ],
    }),

    content: [
      // ── Header ──────────────────────────────────────────────────────────────
      { text: '🔮', fontSize: 24, alignment: 'center', margin: [0, 0, 0, 8] },
      {
        text: 'Full Revelation',
        bold: true, fontSize: 26, color: GOLD,
        alignment: 'center', characterSpacing: 5,
        margin: [0, 0, 0, 10],
      },
      {
        canvas: [{ type: 'line', x1: 100, y1: 0, x2: 415, y2: 0, lineWidth: 0.8, lineColor: GOLD }],
        margin: [0, 0, 0, 10],
      },
      { text: name, italics: true, fontSize: 20, color: GOLD, alignment: 'center', margin: [0, 0, 0, 4] },
      {
        text: [dobStr ? `Born ${dobStr}   ·   ` : '', dateStr].join(''),
        italics: true, fontSize: 9, color: GOLD_DIM,
        alignment: 'center', margin: [0, 0, 0, 4],
      },
      {
        text: '✦   A Personal Palm Reading by Madame Zafira   ✦',
        fontSize: 8, color: '#4a3810', alignment: 'center',
        characterSpacing: 1.5, margin: [0, 0, 0, 20],
      },

      // ── Palm Lines ──────────────────────────────────────────────────────────
      block({ label: '💗  HEART LINE',      text: reading?.heartLine, accentColor: ROSE,   labelColor: ROSE }),
      block({ label: '🧠  HEAD LINE',       text: reading?.headLine,  accentColor: INDIGO, labelColor: INDIGO }),
      block({ label: '✋  LIFE LINE',       text: reading?.lifeLine,  accentColor: TEAL,   labelColor: TEAL }),

      divider(),

      // ── Unlocked sections ───────────────────────────────────────────────────
      block({ label: '✨  YOUR GIFT',       text: reading?.gift,      accentColor: TEAL,   labelColor: TEAL }),
      block({ label: '⚠  HEED THIS',       text: reading?.warning,   accentColor: ROSE,   labelColor: ROSE }),
      block({ label: '🌀  PAST LIFE ECHO', text: reading?.pastLife,  accentColor: INDIGO, labelColor: INDIGO }),

      divider(),

      // ── Next 30 Days ────────────────────────────────────────────────────────
      goldBlock({ label: '🌟  THE NEXT 30 DAYS',       text: reading?.nearFuture,  bgColor: NEXT_BG }),

      // ── Madame Zafira ────────────────────────────────────────────────────────
      goldBlock({ label: '✦  MADAME ZAFIRA SPEAKS',    text: reading?.fullReading, bgColor: DARK_BG }),

      // ── Footer ──────────────────────────────────────────────────────────────
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: GOLD_DIM }],
        margin: [0, 14, 0, 10],
      },
      {
        text: '✦   Madame Zafira   ✦   MysticFortunes.ai',
        bold: true, fontSize: 8, color: GOLD_DIM,
        alignment: 'center', characterSpacing: 2, margin: [0, 0, 0, 3],
      },
      {
        text: `Your personal palm reading   ·   ${dateStr}`,
        italics: true, fontSize: 8, color: '#3a2808', alignment: 'center',
      },
    ],

    defaultStyle: {
      font: 'Roboto',
      fontSize: 11,
      color: CREAM,
    },
  }

  pdfMake.createPdf(docDefinition).download(
    `MadameZafira_${name.replace(/\s+/g, '_')}_FullRevelation.pdf`
  )
}
