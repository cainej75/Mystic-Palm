// src/components/PaymentModal.jsx
import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

export default function PaymentModal({ isOpen, onClose, productType, productName, price }) {
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)

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

  // Coupon config — must match api/create-checkout-session.js
  const COUPON_CONFIG = {
    SAVE1:   { discountAmount: 1.00, active: true },
    SAVE2:   { discountAmount: 2.00, active: true },
    WELCOME: { discountAmount: 0.50, active: true },
    MYSTICAL:{ discountAmount: 1.50, active: true },
    FREE4U:  { discountAmount: 9.99, active: true },
  }

  const validateCoupon = () => {
    if (!couponCode.trim()) return
    setValidatingCoupon(true)
    setError('')
    const coupon = COUPON_CONFIG[couponCode.trim().toUpperCase()]
    if (coupon && coupon.active) {
      setDiscountAmount(coupon.discountAmount)
      setError('✦ Code accepted — click Proceed to Payment')
    } else {
      setError('Invalid coupon code')
      setDiscountAmount(0)
    }
    setValidatingCoupon(false)
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          couponCode: couponCode.trim() || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
      if (!stripe) throw new Error('Stripe failed to load')

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const finalPrice = Math.max(0, price - discountAmount)

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
      onClick={onClose}
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
          onClick={onClose}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <h2
          style={{
            fontFamily: 'Cinzel,serif',
            fontSize: 28,
            color: C.gold,
            margin: '0 0 8px',
            textAlign: 'center',
          }}
        >
          {productName}
        </h2>
        <p
          style={{
            fontFamily: 'Cinzel,serif',
            fontSize: 14,
            color: C.muted,
            textAlign: 'center',
            margin: '0 0 24px',
            letterSpacing: 1,
          }}
        >
          ✦ UNLOCK YOUR READING ✦
        </p>

        {/* Price */}
        <div
          style={{
            background: 'rgba(42, 138, 122, 0.1)',
            border: `1px solid ${C.teal}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 12,
              color: C.muted,
              margin: '0 0 8px',
              letterSpacing: 1,
            }}
          >
            TOTAL PRICE
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 24,
                color: C.cream,
                textDecoration: discountAmount > 0 ? 'line-through' : 'none',
              }}
            >
              ${price.toFixed(2)}
            </span>
            {discountAmount > 0 && (
              <>
                <span style={{ color: C.gold }}>→</span>
                <span
                  style={{
                    fontFamily: 'Cinzel,serif',
                    fontSize: 32,
                    color: C.rose,
                    fontWeight: 700,
                  }}
                >
                  ${finalPrice.toFixed(2)}
                </span>
              </>
            )}
          </div>
          {discountAmount > 0 && (
            <p
              style={{
                fontFamily: 'Cinzel,serif',
                fontSize: 12,
                color: C.teal,
                margin: '8px 0 0',
                fontWeight: 700,
              }}
            >
              You save ${discountAmount.toFixed(2)}!
            </p>
          )}
        </div>

        {/* Coupon Input */}
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontFamily: 'Cinzel,serif',
              fontSize: 12,
              color: C.muted,
              display: 'block',
              marginBottom: 8,
              letterSpacing: 1,
            }}
          >
            HAVE A COUPON CODE?
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value)
                setDiscountAmount(0)
              }}
              placeholder="Enter code..."
              style={{
                flex: 1,
                padding: '10px 12px',
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                color: C.cream,
                fontFamily: 'Cinzel,serif',
                fontSize: 12,
                outline: 'none',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') validateCoupon()
              }}
            />
            <button
              onClick={validateCoupon}
              disabled={validatingCoupon || !couponCode.trim()}
              style={{
                padding: '10px 16px',
                background: C.gold,
                color: C.bg,
                border: 'none',
                borderRadius: 8,
                fontFamily: 'Cinzel,serif',
                fontSize: 12,
                fontWeight: 700,
                cursor: validatingCoupon || !couponCode.trim() ? 'not-allowed' : 'pointer',
                opacity: validatingCoupon || !couponCode.trim() ? 0.5 : 1,
                letterSpacing: 1,
              }}
            >
              {validatingCoupon ? 'CHECKING...' : 'APPLY'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: error.startsWith('✦')
                ? 'rgba(42,138,122,0.15)'
                : 'rgba(176, 64, 90, 0.2)',
              border: `1px solid ${error.startsWith('✦') ? C.teal : C.rose}`,
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              fontFamily: 'Crimson Text,serif',
              fontSize: 14,
              color: error.startsWith('✦') ? '#7de8d8' : '#ff9aa2',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Payment Methods Info */}
        <div
          style={{
            background: 'rgba(201, 168, 76, 0.1)',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            fontFamily: 'Cinzel,serif',
            fontSize: 12,
            color: C.muted,
            textAlign: 'center',
            letterSpacing: 0.5,
          }}
        >
          🔒 Secure checkout via Stripe<br/>
          💳 Credit card, Apple Pay, Google Pay accepted
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? C.goldDim : C.gold,
            color: C.bg,
            border: 'none',
            borderRadius: 8,
            fontFamily: 'Cinzel,serif',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            transition: 'all 0.3s',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = C.rose
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = C.gold
          }}
        >
          {loading ? 'PROCESSING...' : `PROCEED TO PAYMENT — $${finalPrice.toFixed(2)}`}
        </button>

        {/* Cancel */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 12,
            padding: '10px',
            background: 'none',
            color: C.gold,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            fontFamily: 'Cinzel,serif',
            fontSize: 12,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: 1,
            opacity: loading ? 0.5 : 1,
          }}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
