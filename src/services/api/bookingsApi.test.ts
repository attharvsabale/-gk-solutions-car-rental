import { beforeEach, describe, expect, it } from 'vitest'
import { mockBookingsApi } from './bookingsApi'
import { storageService } from '@/lib/storageService'
import { cars } from '@/data/cars'
import type { CreateBookingInput } from '@/types/booking'

const car = cars[0]

function baseInput(overrides: Partial<CreateBookingInput> = {}): CreateBookingInput {
  return {
    carId: car.id,
    pickupLocationId: car.locationId,
    dropoffLocationId: car.locationId,
    pickupDate: '2026-09-01',
    pickupTime: '10:00',
    dropoffDate: '2026-09-04',
    dropoffTime: '10:00',
    extras: [],
    insuranceSelected: false,
    customer: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      dateOfBirth: '1995-01-01',
      address: 'Some street',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411001',
      drivingLicenseNumber: 'MH1234567890',
    },
    pricing: {
      numberOfDays: 3,
      dailyRate: car.pricePerDay,
      basePrice: car.pricePerDay * 3,
      discountLabel: null,
      discountAmount: 0,
      locationFee: 0,
      insuranceFee: 0,
      extrasTotal: 0,
      serviceFee: 0,
      taxes: 0,
      subtotal: car.pricePerDay * 3,
      total: car.pricePerDay * 3,
      deposit: car.deposit,
    },
    ...overrides,
  }
}

beforeEach(() => {
  storageService.clearAll()
})

describe('mockBookingsApi.createBooking', () => {
  it('creates a booking with a generated CR-prefixed id and pending status', async () => {
    const result = await mockBookingsApi.createBooking(baseInput(), 'user-1')
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.id).toMatch(/^CR-\d{4}-[A-Z0-9]{6}$/)
    expect(result.data.bookingStatus).toBe('pending')
    expect(result.data.paymentStatus).toBe('idle')
  })

  it('rejects a booking for a car that is already booked over the same dates', async () => {
    const first = await mockBookingsApi.createBooking(baseInput(), 'user-1')
    expect(first.success).toBe(true)
    if (!first.success) return

    // Force the first booking into a non-cancelled state (it's already 'pending', which counts).
    const second = await mockBookingsApi.createBooking(
      baseInput({ pickupDate: '2026-09-02', dropoffDate: '2026-09-05' }),
      'user-2',
    )
    expect(second.success).toBe(false)
    if (second.success) return
    expect(second.error.code).toBe('CAR_UNAVAILABLE')
  })
})

describe('mockBookingsApi.getBooking / getUserBookings', () => {
  it('retrieves a created booking by id', async () => {
    const created = await mockBookingsApi.createBooking(baseInput(), 'user-1')
    expect(created.success).toBe(true)
    if (!created.success) return

    const fetched = await mockBookingsApi.getBooking(created.data.id)
    expect(fetched.success).toBe(true)
    if (!fetched.success) return
    expect(fetched.data?.id).toBe(created.data.id)
  })

  it('returns only bookings belonging to the given user', async () => {
    await mockBookingsApi.createBooking(baseInput(), 'user-1')
    await mockBookingsApi.createBooking(
      baseInput({ pickupDate: '2026-10-01', dropoffDate: '2026-10-04' }),
      'user-2',
    )

    const user1Bookings = await mockBookingsApi.getUserBookings('user-1')
    expect(user1Bookings.success).toBe(true)
    if (!user1Bookings.success) return
    expect(user1Bookings.data).toHaveLength(1)
    expect(user1Bookings.data[0].userId).toBe('user-1')
  })

  it('returns an empty list for a guest (no user id)', async () => {
    const result = await mockBookingsApi.getUserBookings(null)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toEqual([])
  })
})

describe('mockBookingsApi.cancelBooking', () => {
  it('marks a booking as cancelled', async () => {
    const created = await mockBookingsApi.createBooking(baseInput(), 'user-1')
    expect(created.success).toBe(true)
    if (!created.success) return

    const cancelled = await mockBookingsApi.cancelBooking(created.data.id)
    expect(cancelled.success).toBe(true)
    if (!cancelled.success) return
    expect(cancelled.data.bookingStatus).toBe('cancelled')
  })

  it('freeing up the car after cancellation allows a new overlapping booking', async () => {
    const created = await mockBookingsApi.createBooking(baseInput(), 'user-1')
    expect(created.success).toBe(true)
    if (!created.success) return

    await mockBookingsApi.cancelBooking(created.data.id)

    const rebooked = await mockBookingsApi.createBooking(baseInput(), 'user-2')
    expect(rebooked.success).toBe(true)
  })

  it('errors when cancelling a booking that does not exist', async () => {
    const result = await mockBookingsApi.cancelBooking('CR-2026-NOPE99')
    expect(result.success).toBe(false)
  })
})
