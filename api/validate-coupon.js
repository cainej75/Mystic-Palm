// api/validate-coupon.js
// Coupon configuration embedded here to avoid import path issues
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
