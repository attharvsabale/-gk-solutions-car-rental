import { useCallback, useEffect, useState } from 'react'
import { bookingsApi } from '@/services/api'
import { calculateRefund, isCancellable } from '@/services/cancellationService'
import type { Booking } from '@/types/booking'

export function useBooking(id: string | undefined) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    bookingsApi.getBooking(id).then((result) => {
      if (result.success) {
        setBooking(result.data)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  return { booking, isLoading, error, reload: load }
}

export function useUserBookings(userId: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(() => {
    setIsLoading(true)
    bookingsApi.getUserBookings(userId).then((result) => {
      if (result.success) setBookings(result.data)
      setIsLoading(false)
    })
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  return { bookings, isLoading, reload: load }
}

export { calculateRefund, isCancellable }
