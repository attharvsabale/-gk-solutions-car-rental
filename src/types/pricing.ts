export interface PriceBreakdown {
  numberOfDays: number
  dailyRate: number
  basePrice: number
  discountLabel: string | null
  discountAmount: number
  locationFee: number
  insuranceFee: number
  extrasTotal: number
  serviceFee: number
  taxes: number
  subtotal: number
  total: number
  deposit: number
}
