// src/config/coupons.js
// Coupon configuration - edit this to add/modify/disable coupons
// discountAmount is in USD (e.g., 1.00 = $1.00 off)

export const coupons = {
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

// Function to validate coupon
export function validateCoupon(code) {
  if (!code) return null
  
  const coupon = coupons[code.toUpperCase()]
  if (coupon && coupon.active) {
    return coupon
  }
  return null
}

// Function to get discount amount
export function getCouponDiscount(code) {
  const coupon = validateCoupon(code)
  return coupon ? coupon.discountAmount : 0
}

// Instructions for updating coupons:
// 1. Add new coupon: NEWCODE: { discountAmount: 1.00, active: true, description: "..." }
// 2. Disable coupon: Set active: false
// 3. Remove coupon: Delete the entire entry
// 4. Commit changes to GitHub
// 5. Vercel will automatically redeploy
