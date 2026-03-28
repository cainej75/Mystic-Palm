// api/create-checkout-session.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const COUPON_CONFIG = {
  SAVE1: { discountAmount: 1.00, active: true, description: "$1 off any reading" },
  SAVE2: { discountAmount: 2.00, active: true, description: "$2 off any reading" },
  WELCOME: { discountAmount: 0.50, active: true, description: "50¢ off for new users" },
  MYSTICAL: { discountAmount: 1.50, active: true, description: "$1.50 off" },
  FREE4U: { discountAmount: 9.99, active: true, description: "100% off - complimentary reading" },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { productType, couponCode } = req.body

    const prices = {
      full_revelation: 399,
      partner_compatibility: 399,
    }

    const price = prices[productType]
    if (!price) {
      return res.status(400).json({ error: 'Invalid product type' })
    }

    let discountAmount = 0
    if (couponCode) {
      const coupon = COUPON_CONFIG[couponCode.toUpperCase()]
      if (coupon && coupon.active) {
        discountAmount = coupon.discountAmount * 100
      }
    }

    const finalPrice = Math.max(0, price - discountAmount)

    // Use the request's own origin so the redirect always goes back to the same domain
    // This fixes the localStorage mismatch between mysticfortunes.ai and mystic-palm.vercel.app
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0,3).join('/')
    const baseUrl = origin
      || process.env.NEXT_PUBLIC_SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173')

    // If fully discounted, bypass Stripe and redirect directly to success
    if (finalPrice === 0) {
      const freeUrl = `${baseUrl}/success?session_id=free_${Date.now()}&type=${productType}&free=true`
      return res.status(200).json({ url: freeUrl })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productType === 'full_revelation' ? 'Full Revelation Reading' : 'Partner Compatibility Reading',
              description: productType === 'full_revelation'
                ? 'Unlock your complete palm reading with all sections'
                : 'Unlock your partner compatibility analysis',
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&type=${productType}`,
      cancel_url: `${baseUrl}/cancelled`,
      metadata: {
        productType,
        couponCode: couponCode || 'none',
      },
    })

    res.status(200).json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
}
