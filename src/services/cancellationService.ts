import type { Booking, RefundResult } from '@/types/booking'
import { businessRules } from '@/config/businessRules'
import { hoursUntil } from '@/lib/date'

/**
 * Mock cancellation/refund rules. Centralized so the bookings list, booking
 * detail page, and the cancellation confirmation dialog all agree on the
 * amount a user will get back.
 */
export function calculateRefund(booking: Booking): RefundResult {
  const hoursRemaining = hoursUntil(booking.pickupDate, booking.pickupTime)
  const { fullRefundHoursBefore, partialRefundHoursBefore, partialRefundPercent } = businessRules.cancellation

  if (hoursRemaining >= fullRefundHoursBefore) {
    return {
      refundPercent: 100,
      refundAmount: booking.pricing.total,
      reason: `Cancelled more than ${fullRefundHoursBefore} hours before pickup — full refund.`,
    }
  }

  if (hoursRemaining >= partialRefundHoursBefore) {
    return {
      refundPercent: partialRefundPercent,
      refundAmount: booking.pricing.total * (partialRefundPercent / 100),
      reason: `Cancelled between ${partialRefundHoursBefore}–${fullRefundHoursBefore} hours before pickup — ${partialRefundPercent}% refund.`,
    }
  }

  return {
    refundPercent: 0,
    refundAmount: 0,
    reason: `Cancelled less than ${partialRefundHoursBefore} hours before pickup — non-refundable.`,
  }
}

export function isCancellable(booking: Booking): boolean {
  return booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending'
}
