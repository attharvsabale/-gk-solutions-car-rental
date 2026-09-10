import { delay } from '@/lib/delay'
import { generateBookingId } from '@/lib/id'
import { storageKeys, storageService } from '@/lib/storageService'
import { checkCarAvailability } from '@/services/availabilityService'
import type { Booking, BookingTimelineEntry } from '@/types/booking'
import type { ApiResult } from '@/types/common'
import type { BookingsApi } from './types'

function getBookings(): Booking[] {
  return storageService.get<Booking[]>(storageKeys.bookings, [])
}

function saveBookings(bookings: Booking[]): void {
  storageService.set(storageKeys.bookings, bookings)
}

function error(code: string, message: string): ApiResult<never> {
  return { success: false, error: { code, message } }
}

function buildTimeline(status: Booking['bookingStatus']): BookingTimelineEntry[] {
  const now = new Date().toISOString()
  return [
    { label: 'Booking created', timestamp: now, done: true },
    { label: 'Payment completed', timestamp: now, done: status === 'confirmed' || status === 'active' || status === 'completed' },
    { label: 'Pickup scheduled', timestamp: now, done: status === 'active' || status === 'completed' },
    { label: 'Vehicle returned', timestamp: now, done: status === 'completed' },
  ]
}

export const mockBookingsApi: BookingsApi = {
  async createBooking(input, userId) {
    await delay()

    const availability = checkCarAvailability(input.carId, input.pickupDate, input.dropoffDate)
    if (!availability.available) {
      return error('CAR_UNAVAILABLE', availability.reason ?? 'This vehicle is no longer available for these dates.')
    }

    const now = new Date().toISOString()
    const booking: Booking = {
      id: generateBookingId(),
      userId,
      carId: input.carId,
      pickupLocationId: input.pickupLocationId,
      dropoffLocationId: input.dropoffLocationId,
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      dropoffDate: input.dropoffDate,
      dropoffTime: input.dropoffTime,
      extras: input.extras,
      insuranceSelected: input.insuranceSelected,
      customer: input.customer,
      pricing: input.pricing,
      paymentMethod: null,
      paymentStatus: 'idle',
      transactionId: null,
      bookingStatus: 'pending',
      timeline: buildTimeline('pending'),
      createdAt: now,
      updatedAt: now,
    }

    const bookings = getBookings()
    bookings.push(booking)
    saveBookings(bookings)

    return { success: true, data: booking }
  },

  async getBooking(id) {
    await delay(200)
    return { success: true, data: getBookings().find((b) => b.id === id) ?? null }
  },

  async getUserBookings(userId) {
    await delay()
    const bookings = getBookings()
    if (!userId) return { success: true, data: [] }
    return { success: true, data: bookings.filter((b) => b.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) }
  },

  async cancelBooking(id) {
    await delay()
    const bookings = getBookings()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return error('BOOKING_NOT_FOUND', 'Booking not found.')

    const updated: Booking = {
      ...bookings[index],
      bookingStatus: 'cancelled',
      updatedAt: new Date().toISOString(),
    }
    bookings[index] = updated
    saveBookings(bookings)
    return { success: true, data: updated }
  },

  async updateBooking(id, updates) {
    await delay(200)
    const bookings = getBookings()
    const index = bookings.findIndex((b) => b.id === id)
    if (index === -1) return error('BOOKING_NOT_FOUND', 'Booking not found.')

    const updated: Booking = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    updated.timeline = buildTimeline(updated.bookingStatus)
    bookings[index] = updated
    saveBookings(bookings)
    return { success: true, data: updated }
  },

  async checkAvailability(carId, pickupDate, dropoffDate) {
    await delay(200)
    return { success: true, data: checkCarAvailability(carId, pickupDate, dropoffDate) }
  },
}
