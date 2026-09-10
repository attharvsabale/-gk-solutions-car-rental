import { describe, expect, it } from 'vitest'
import { calculateRentalPrice } from './pricingService'
import { pricingConfig } from '@/config/pricingConfig'
import type { Car } from '@/types/car'

const baseCar: Car = {
  id: 'car-test-1',
  brand: 'Hyundai',
  model: 'Creta',
  variant: 'SX',
  year: 2026,
  category: 'SUV',
  pricePerDay: 4000,
  pricePerWeek: 25200,
  pricePerMonth: 84000,
  locationId: 'loc-a',
  fuelType: 'Petrol',
  transmission: 'Automatic',
  seats: 5,
  doors: 5,
  largeBags: 2,
  smallBags: 2,
  mileageLimitPerDay: 200,
  rating: 4.5,
  reviewCount: 100,
  images: [],
  features: [],
  description: '',
  available: true,
  insuranceIncluded: false,
  deposit: 10000,
  instantBooking: true,
  cancellationPolicy: { fullRefundHours: 48, partialRefundHours: 24, partialRefundPercent: 50 },
  minimumDriverAge: 21,
}

describe('calculateRentalPrice', () => {
  it('charges plain daily rate with no discount for short rentals (1-6 days)', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04', // 3 days
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    expect(result.numberOfDays).toBe(3)
    expect(result.basePrice).toBe(12000)
    expect(result.discountAmount).toBe(0)
    expect(result.discountLabel).toBeNull()
  })

  it('applies a 10% weekly discount for rentals of 7-29 days', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-08', // 7 days
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    const rawBase = 4000 * 7
    expect(result.discountLabel).toBe('Weekly discount')
    expect(result.discountAmount).toBe(rawBase * 0.1)
    expect(result.basePrice).toBe(rawBase * 0.9)
  })

  it('applies a 20% monthly discount for rentals of 30+ days', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-31', // 30 days
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    const rawBase = 4000 * 30
    expect(result.discountLabel).toBe('Monthly discount')
    expect(result.discountAmount).toBe(rawBase * 0.2)
  })

  it('adds a one-way drop-off fee only when pickup and drop-off locations differ', () => {
    const same = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })
    const different = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-b',
    })

    expect(same.locationFee).toBe(0)
    expect(different.locationFee).toBeGreaterThan(0)
    expect(different.total).toBeGreaterThan(same.total)
  })

  it('only charges insurance fee when selected and not already included in the rental', () => {
    const withInsurance = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: true,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })
    const alreadyIncluded = calculateRentalPrice({
      car: { ...baseCar, insuranceIncluded: true },
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: true,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    expect(withInsurance.insuranceFee).toBe(pricingConfig.insuranceFeePerDay * 3)
    expect(alreadyIncluded.insuranceFee).toBe(0)
  })

  it('multiplies extras by quantity and number of days', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04', // 3 days
      extras: [{ extraId: 'extra-child-seat', quantity: 2 }],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    // child seat is ₹300/day
    expect(result.extrasTotal).toBe(300 * 2 * 3)
  })

  it('applies service fee and GST on top of the pre-tax subtotal', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    const expectedServiceFee = result.basePrice * pricingConfig.serviceFeeRate
    const expectedTaxes = (result.basePrice + expectedServiceFee) * pricingConfig.taxRate

    expect(result.serviceFee).toBeCloseTo(expectedServiceFee, 5)
    expect(result.taxes).toBeCloseTo(expectedTaxes, 5)
    expect(result.total).toBeCloseTo(result.basePrice + expectedServiceFee + expectedTaxes, 5)
  })

  it('keeps the security deposit separate from the total', () => {
    const result = calculateRentalPrice({
      car: baseCar,
      pickupDate: '2026-01-01',
      dropoffDate: '2026-01-04',
      extras: [],
      insuranceSelected: false,
      pickupLocationId: 'loc-a',
      dropoffLocationId: 'loc-a',
    })

    expect(result.deposit).toBe(baseCar.deposit)
    expect(result.total).toBeLessThan(result.total + result.deposit)
  })
})
