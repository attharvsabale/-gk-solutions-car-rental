import { useOutletContext } from 'react-router-dom'
import type { Car } from '@/types/car'
import type { BookingDraft } from '@/store/useBookingStore'

export interface BookingOutletContext {
  car: Car
  draft: BookingDraft
}

export function useBookingContext() {
  return useOutletContext<BookingOutletContext>()
}
