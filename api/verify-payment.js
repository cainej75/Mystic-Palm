// api/verify-payment.js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' })
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ valid: false })
    }

    // Extract productType from metadata
    const productType = session.metadata.productType
    const amount = (session.amount_total / 100).toFixed(2)

    res.status(200).json({
      valid: true,
      sessionId: session_id,
      productType: productType,
      amount: amount,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: 'Payment verification failed' })
  }
}
