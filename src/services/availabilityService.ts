import { parseISO } from 'date-fns'
import { getCarById } from '@/data/cars'
import { storageKeys, storageService } from '@/lib/storageService'
import type { Booking } from '@/types/booking'
import type { AvailabilityResult } from '@/services/api/types'

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return parseISO(aStart) < parseISO(bEnd) && parseISO(bStart) < parseISO(aEnd)
}

export function getAvailabilityOverrides(): Record<string, boolean> {
  return storageService.get(storageKeys.carAvailabilityOverrides, {})
}

export function setCarAvailabilityOverride(carId: string, available: boolean): void {
  const overrides = getAvailabilityOverrides()
  overrides[carId] = available
  storageService.set(storageKeys.carAvailabilityOverrides, overrides)
}

/**
 * Checks a car's availability against its base flag, any debug-panel
 * override, and every locally stored booking that overlaps the requested
 * dates — giving basic double-booking protection without a real backend.
 */
export function checkCarAvailability(
  carId: string,
  pickupDate: string,
  dropoffDate: string,
  excludeBookingId?: string,
): AvailabilityResult {
  const car = getCarById(carId)
  if (!car) {
    return { available: false, reason: 'Vehicle not found.' }
  }

  const overrides = getAvailabilityOverrides()
  const override = overrides[carId]
  if (override === false) {
    return { available: false, reason: 'This vehicle is no longer available for these dates.' }
  }
  if (!car.available && override === undefined) {
    return { available: false, reason: 'This vehicle is currently out of service.' }
  }

  const bookings = storageService.get<Booking[]>(storageKeys.bookings, [])
  const conflicting = bookings.some((booking) => {
    if (booking.id === excludeBookingId) return false
    if (booking.carId !== carId) return false
    if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'failed') return false
    return rangesOverlap(pickupDate, dropoffDate, booking.pickupDate, booking.dropoffDate)
  })

  if (conflicting) {
    return { available: false, reason: 'This vehicle is already booked for part of these dates.' }
  }

  return { available: true }
}
