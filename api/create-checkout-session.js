// api/create-checkout-session.js
import Stripe from 'stripe'
import { coupons } from '../src/config/coupons.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Coupon configuration
const coupons = {
  SAVE1: {
    discountAmount: 1.00,
    active: true,
    description: "$1 off any reading",
  },
  SAVE2: {
    discountAmount: 2.00,
    active: true,
    description: "$2 off any reading",
  },
  WELCOME: {
    discountAmount: 0.50,
    active: true,
    description: "50¢ off for new users",
  },
  MYSTICAL: {
    discountAmount: 1.50,
    active: true,
    description: "$1.50 off",
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { productType, couponCode } = req.body

    // Pricing
    const prices = {
      full_revelation: 499, // $4.99 in cents
      partner_compatibility: 399, // $3.99 in cents
    }

    const price = prices[productType]
    if (!price) {
      return res.status(400).json({ error: 'Invalid product type' })
    }

    // Validate coupon if provided
    let discountAmount = 0
    if (couponCode) {
      const coupon = coupons[couponCode.toUpperCase()]
      if (coupon && coupon.active) {
        discountAmount = coupon.discountAmount * 100 // Convert to cents
      }
    }

    const finalPrice = Math.max(0, price - discountAmount)

    // Create Stripe session
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
      success_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&type=${productType}`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/cancelled`,
      metadata: {
        productType,
        couponCode: couponCode || 'none',
      },
    })

    res.status(200).json({ sessionId: session.id, clientSecret: session.client_secret })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
}
