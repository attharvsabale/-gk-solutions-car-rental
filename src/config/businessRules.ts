export const businessRules = {
  minimumRentalDays: 1,
  maximumRentalDays: 60,
  minimumDriverAge: 21,
  weeklyDiscountThresholdDays: 7,
  monthlyDiscountThresholdDays: 30,
  weeklyDiscountRate: 0.1,
  monthlyDiscountRate: 0.2,
  differentDropoffLocationFee: 1500,
  cancellation: {
    fullRefundHoursBefore: 48,
    partialRefundHoursBefore: 24,
    partialRefundPercent: 50,
  },
  bookingIdPrefix: 'CR',
  transactionIdPrefix: 'TXN',
} as const
