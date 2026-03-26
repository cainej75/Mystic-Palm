// api/validate-coupon.js
import { coupons } from '../src/config/coupons.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    const { couponCode } = req.body

    if (!couponCode) {
      return res.status(400).json({ valid: false, error: 'No coupon code provided' })
    }

    const coupon = coupons[couponCode.toUpperCase()]

    if (!coupon || !coupon.active) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid or expired coupon code' 
      })
    }

    return res.status(200).json({
      valid: true,
      discountAmount: coupon.discountAmount,
      description: coupon.description,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}
