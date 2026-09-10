import type { PriceBreakdown } from './pricing'
import type { SelectedExtra } from './extras'
import type { CustomerDetails } from './user'
import type { PaymentMethod, PaymentStatus } from './payment'

export type BookingStatus =
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'failed'

export interface BookingTimelineEntry {
  label: string
  timestamp: string
  done: boolean
}

export interface Booking {
  id: string
  userId: string | null
  carId: string
  pickupLocationId: string
  dropoffLocationId: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  extras: SelectedExtra[]
  insuranceSelected: boolean
  customer: CustomerDetails
  pricing: PriceBreakdown
  paymentMethod: PaymentMethod | null
  paymentStatus: PaymentStatus
  transactionId: string | null
  bookingStatus: BookingStatus
  timeline: BookingTimelineEntry[]
  createdAt: string
  updatedAt: string
}

export interface CreateBookingInput {
  carId: string
  pickupLocationId: string
  dropoffLocationId: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  extras: SelectedExtra[]
  insuranceSelected: boolean
  customer: CustomerDetails
  pricing: PriceBreakdown
}

export interface RefundResult {
  refundPercent: number
  refundAmount: number
  reason: string
}
