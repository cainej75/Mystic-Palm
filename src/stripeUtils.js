// src/utils/stripeUtils.js
export async function createCheckoutSession(productType, couponCode = null) {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productType,
        couponCode,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session')
    }

    // Redirect to Stripe checkout
    const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
    if (!stripePublicKey) {
      throw new Error('Stripe public key not configured')
    }

    // For now, just return the sessionId
    // The component will handle redirecting to Stripe
    return data.sessionId
  } catch (error) {
    console.error('Checkout error:', error)
    throw error
  }
}

export async function validateCoupon(couponCode) {
  try {
    const response = await fetch('/api/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ couponCode }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Coupon validation error:', error)
    return { valid: false }
  }
}
