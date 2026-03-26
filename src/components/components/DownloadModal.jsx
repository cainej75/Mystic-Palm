// src/components/DownloadModal.jsx
import { useState } from 'react'
import { generateFullRevelationPDF } from '../utils/generateFullRevelationPDF'
import { generatePartnerCompatibilityPDF } from '../utils/generatePartnerCompatibilityPDF'

export default function DownloadModal({
  isOpen,
  onClose,
  productType,
  reading,
  userName,
  partnerName,
  harmonyScore,
  alignmentText,
}) {
  const [downloading, setDownloading] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

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

  if (!isOpen) return null

  const handleDownload = async () => {
    setDownloading(true)
    try {
      if (productType === 'full_revelation') {
        await generateFullRevelationPDF(reading, userName)
      } else if (productType === 'partner_compatibility') {
        await generatePartnerCompatibilityPDF(
          reading,
          userName,
          partnerName,
          harmonyScore,
          alignmentText
        )
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleClose = () => {
    setShowWarning(true)
  }

  // Warning Modal
  if (showWarning) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          style={{
            background: C.surface,
            border: `2px solid ${C.rose}`,
            borderRadius: 16,
            padding: 40,
            maxWidth: 450,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <p
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 24,
              color: C.rose,
              margin: '0 0 16px',
              fontWeight: 700,
            }}
          >
            ⚠️ Warning
          </p>
          <p
            style={{
              fontFamily: 'Crimson Text,serif',
              fontSize: 16,
              color: C.cream,
              lineHeight: 1.8,
              margin: '0 0 24px',
            }}
          >
            {productType === 'full_revelation'
              ? 'This reading will disappear forever if you leave this page without downloading the PDF.'
              : 'This compatibility reading will disappear forever if you leave this page without downloading the PDF.'}
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => setShowWarning(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: C.gold,
                color: C.bg,
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Cinzel,serif',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              GO BACK & DOWNLOAD
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: C.roseDim,
                color: C.cream,
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Cinzel,serif',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 1,
              }}
            >
              LEAVE ANYWAY
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Download Modal
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: 40,
          maxWidth: 500,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: C.gold,
            fontSize: 24,
            cursor: 'pointer',
            width: 40,
            height: 40,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 32,
              margin: '0 0 8px',
              color: C.gold,
            }}
          >
            📥
          </p>
          <h2
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 24,
              color: C.gold,
              margin: '0 0 8px',
            }}
          >
            Download Your Reading
          </h2>
          <p
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 12,
              color: C.muted,
              margin: 0,
              letterSpacing: 1,
            }}
          >
            ✦ SAVE YOUR REVELATION ✦
          </p>
        </div>

        {/* Info */}
        <div
          style={{
            background: 'rgba(42, 138, 122, 0.1)',
            border: `1px solid ${C.teal}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontFamily: 'Crimson Text,serif',
              fontSize: 14,
              color: C.cream,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Your reading will be generated as a PDF. This is your only copy — save it carefully!
            {productType === 'partner_compatibility' && ' The PDF includes your compatibility score and alignment analysis.'}
          </p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            width: '100%',
            padding: '14px',
            background: downloading ? C.goldDim : C.gold,
            color: C.bg,
            border: 'none',
            borderRadius: 8,
            fontFamily: 'Cinzel,serif',
            fontSize: 14,
            fontWeight: 700,
            cursor: downloading ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            marginBottom: 12,
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? 'GENERATING PDF...' : '⬇️ DOWNLOAD PDF'}
        </button>

        {/* Continue Button */}
        <button
          onClick={onClose}
          disabled={downloading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'none',
            color: C.gold,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            fontFamily: 'Cinzel,serif',
            fontSize: 12,
            fontWeight: 700,
            cursor: downloading ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            opacity: downloading ? 0.5 : 1,
          }}
        >
          I'LL DOWNLOAD LATER
        </button>

        {/* Warning */}
        <p
          style={{
            fontFamily: 'Cinzel,serif',
            fontSize: 11,
            color: C.muted,
            margin: '16px 0 0',
            textAlign: 'center',
            fontStyle: 'italic',
            letterSpacing: 0.5,
          }}
        >
          ⚠️ This reading will be lost if you leave without downloading
        </p>
      </div>
    </div>
  )
}
