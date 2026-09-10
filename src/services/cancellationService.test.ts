import { addHours } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { calculateRefund, isCancellable } from './cancellationService'
import { toISODate } from '@/lib/date'
import type { Booking } from '@/types/booking'

function bookingWithPickupIn(hoursFromNow: number, overrides: Partial<Booking> = {}): Booking {
  const pickup = addHours(new Date(), hoursFromNow)
  return {
    id: 'CR-2026-TEST01',
    userId: 'user-1',
    carId: 'car-1',
    pickupLocationId: 'loc-a',
    dropoffLocationId: 'loc-a',
    pickupDate: toISODate(pickup),
    pickupTime: `${pickup.getHours().toString().padStart(2, '0')}:${pickup.getMinutes().toString().padStart(2, '0')}`,
    dropoffDate: toISODate(pickup),
    dropoffTime: '18:00',
    extras: [],
    insuranceSelected: false,
    customer: {
      firstName: 'Test',
      lastName: 'User',
      email: 't@example.com',
      phone: '9876543210',
      dateOfBirth: '1995-01-01',
      address: 'x',
      city: 'Pune',
      state: 'MH',
      postalCode: '411001',
      drivingLicenseNumber: 'MH123',
    },
    pricing: {
      numberOfDays: 3,
      dailyRate: 4000,
      basePrice: 12000,
      discountLabel: null,
      discountAmount: 0,
      locationFee: 0,
      insuranceFee: 0,
      extrasTotal: 0,
      serviceFee: 600,
      taxes: 2268,
      subtotal: 12600,
      total: 14868,
      deposit: 10000,
    },
    paymentMethod: 'card',
    paymentStatus: 'success',
    transactionId: 'TXN-TEST',
    bookingStatus: 'confirmed',
    timeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('calculateRefund', () => {
  it('gives a full refund when cancelling more than 48 hours before pickup', () => {
    const booking = bookingWithPickupIn(72)
    const refund = calculateRefund(booking)
    expect(refund.refundPercent).toBe(100)
    expect(refund.refundAmount).toBe(booking.pricing.total)
  })

  it('gives a 50% refund when cancelling between 24 and 48 hours before pickup', () => {
    const booking = bookingWithPickupIn(36)
    const refund = calculateRefund(booking)
    expect(refund.refundPercent).toBe(50)
    expect(refund.refundAmount).toBe(booking.pricing.total * 0.5)
  })

  it('gives no refund when cancelling less than 24 hours before pickup', () => {
    const booking = bookingWithPickupIn(5)
    const refund = calculateRefund(booking)
    expect(refund.refundPercent).toBe(0)
    expect(refund.refundAmount).toBe(0)
  })
})

describe('isCancellable', () => {
  it('allows cancelling confirmed and pending bookings', () => {
    expect(isCancellable(bookingWithPickupIn(72, { bookingStatus: 'confirmed' }))).toBe(true)
    expect(isCancellable(bookingWithPickupIn(72, { bookingStatus: 'pending' }))).toBe(true)
  })

  it('disallows cancelling completed, cancelled or failed bookings', () => {
    expect(isCancellable(bookingWithPickupIn(72, { bookingStatus: 'completed' }))).toBe(false)
    expect(isCancellable(bookingWithPickupIn(72, { bookingStatus: 'cancelled' }))).toBe(false)
    expect(isCancellable(bookingWithPickupIn(72, { bookingStatus: 'failed' }))).toBe(false)
  })
})
