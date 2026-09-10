import type { Car } from '@/types/car'
import type { SelectedExtra } from '@/types/extras'
import type { PriceBreakdown } from '@/types/pricing'
import { businessRules } from '@/config/businessRules'
import { pricingConfig } from '@/config/pricingConfig'
import { calculateDays } from '@/lib/date'
import { getExtraById } from '@/data/extras'

export interface CalculateRentalPriceInput {
  car: Car
  pickupDate: string
  dropoffDate: string
  extras: SelectedExtra[]
  insuranceSelected: boolean
  pickupLocationId: string
  dropoffLocationId: string
}

/**
 * Single source of truth for rental pricing. Components must call this
 * instead of computing totals inline, so pricing rules stay consistent
 * across the car detail panel, booking review, and booking history.
 */
export function calculateRentalPrice(input: CalculateRentalPriceInput): PriceBreakdown {
  const { car, pickupDate, dropoffDate, extras, insuranceSelected, pickupLocationId, dropoffLocationId } = input

  const numberOfDays = calculateDays(pickupDate, dropoffDate)
  const dailyRate = car.pricePerDay
  const rawBase = dailyRate * numberOfDays

  let discountLabel: string | null = null
  let discountAmount = 0

  if (numberOfDays >= businessRules.monthlyDiscountThresholdDays) {
    discountLabel = 'Monthly discount'
    discountAmount = rawBase * businessRules.monthlyDiscountRate
  } else if (numberOfDays >= businessRules.weeklyDiscountThresholdDays) {
    discountLabel = 'Weekly discount'
    discountAmount = rawBase * businessRules.weeklyDiscountRate
  }

  const basePrice = rawBase - discountAmount

  const locationFee = pickupLocationId !== dropoffLocationId ? businessRules.differentDropoffLocationFee : 0

  const insuranceFee = insuranceSelected && !car.insuranceIncluded
    ? pricingConfig.insuranceFeePerDay * numberOfDays
    : 0

  const extrasTotal = extras.reduce((sum, selected) => {
    const extra = getExtraById(selected.extraId)
    if (!extra) return sum
    return sum + extra.pricePerDay * selected.quantity * numberOfDays
  }, 0)

  const preTaxSubtotal = basePrice + locationFee + insuranceFee + extrasTotal
  const serviceFee = preTaxSubtotal * pricingConfig.serviceFeeRate
  const taxes = (preTaxSubtotal + serviceFee) * pricingConfig.taxRate
  const subtotal = preTaxSubtotal + serviceFee
  const total = subtotal + taxes

  return {
    numberOfDays,
    dailyRate,
    basePrice,
    discountLabel,
    discountAmount,
    locationFee,
    insuranceFee,
    extrasTotal,
    serviceFee,
    taxes,
    subtotal,
    total,
    deposit: car.deposit,
  }
}
