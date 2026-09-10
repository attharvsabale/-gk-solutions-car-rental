import { beforeEach, describe, expect, it } from 'vitest'
import { checkCarAvailability, setCarAvailabilityOverride } from './availabilityService'
import { storageKeys, storageService } from '@/lib/storageService'
import { cars } from '@/data/cars'
import type { Booking } from '@/types/booking'

const car = cars[0]

function minimalBooking(overrides: Partial<Booking>): Booking {
  return {
    id: 'CR-2026-EXIST1',
    userId: 'user-1',
    carId: car.id,
    pickupLocationId: car.locationId,
    dropoffLocationId: car.locationId,
    pickupDate: '2026-06-10',
    pickupTime: '10:00',
    dropoffDate: '2026-06-15',
    dropoffTime: '10:00',
    extras: [],
    insuranceSelected: false,
    customer: {
      firstName: 'A',
      lastName: 'B',
      email: 'a@example.com',
      phone: '9876543210',
      dateOfBirth: '1995-01-01',
      address: 'x',
      city: 'Pune',
      state: 'MH',
      postalCode: '411001',
      drivingLicenseNumber: 'MH123',
    },
    pricing: {
      numberOfDays: 5,
      dailyRate: car.pricePerDay,
      basePrice: car.pricePerDay * 5,
      discountLabel: null,
      discountAmount: 0,
      locationFee: 0,
      insuranceFee: 0,
      extrasTotal: 0,
      serviceFee: 0,
      taxes: 0,
      subtotal: car.pricePerDay * 5,
      total: car.pricePerDay * 5,
      deposit: car.deposit,
    },
    paymentMethod: 'card',
    paymentStatus: 'success',
    transactionId: 'TXN-1',
    bookingStatus: 'confirmed',
    timeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

beforeEach(() => {
  storageService.clearAll()
})

describe('checkCarAvailability', () => {
  it('is available when there are no conflicting bookings', () => {
    const result = checkCarAvailability(car.id, '2026-07-01', '2026-07-05')
    expect(result.available).toBe(true)
  })

  it('is unavailable when the requested range overlaps an existing confirmed booking', () => {
    storageService.set(storageKeys.bookings, [minimalBooking({})])
    const result = checkCarAvailability(car.id, '2026-06-12', '2026-06-18')
    expect(result.available).toBe(false)
    expect(result.reason).toBeTruthy()
  })

  it('is available for a range that does not overlap an existing booking', () => {
    storageService.set(storageKeys.bookings, [minimalBooking({})])
    const result = checkCarAvailability(car.id, '2026-06-20', '2026-06-25')
    expect(result.available).toBe(true)
  })

  it('ignores cancelled bookings when checking for conflicts', () => {
    storageService.set(storageKeys.bookings, [minimalBooking({ bookingStatus: 'cancelled' })])
    const result = checkCarAvailability(car.id, '2026-06-12', '2026-06-18')
    expect(result.available).toBe(true)
  })

  it('excludes a given booking id from conflict checks (for re-checking its own dates)', () => {
    const existing = minimalBooking({ id: 'CR-2026-SELF01' })
    storageService.set(storageKeys.bookings, [existing])
    const result = checkCarAvailability(car.id, existing.pickupDate, existing.dropoffDate, existing.id)
    expect(result.available).toBe(true)
  })

  it('respects a debug-panel availability override', () => {
    setCarAvailabilityOverride(car.id, false)
    const result = checkCarAvailability(car.id, '2026-08-01', '2026-08-05')
    expect(result.available).toBe(false)
  })

  it('returns unavailable for an unknown car id', () => {
    const result = checkCarAvailability('not-a-real-car', '2026-08-01', '2026-08-05')
    expect(result.available).toBe(false)
  })
})
