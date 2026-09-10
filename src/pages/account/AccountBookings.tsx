import { useEffect, useMemo, useState } from 'react'
import { CalendarX } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUserBookings } from '@/hooks/useBooking'
import { getCarById } from '@/data/cars'
import { BookingListCard } from '@/components/booking/BookingListCard'
import { CancelBookingModal } from '@/components/booking/CancelBookingModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { LinkButton } from '@/components/ui/LinkButton'
import { bookingsApi } from '@/services/api'
import { useToastStore } from '@/store/useToastStore'
import { setPageMeta } from '@/lib/seo'
import { cn } from '@/lib/cn'
import type { Booking } from '@/types/booking'

type Tab = 'upcoming' | 'completed' | 'cancelled'

export default function AccountBookings() {
  const { user } = useAuth()
  const { bookings, isLoading, reload } = useUserBookings(user?.id ?? null)
  const [tab, setTab] = useState<Tab>('upcoming')
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const showToast = useToastStore((state) => state.show)

  useEffect(() => {
    setPageMeta('My Bookings | GK Solutions', 'View your upcoming, completed and cancelled car rental bookings.')
  }, [])

  const filtered = useMemo(() => {
    if (tab === 'upcoming') return bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending' || b.bookingStatus === 'active')
    if (tab === 'completed') return bookings.filter((b) => b.bookingStatus === 'completed')
    return bookings.filter((b) => b.bookingStatus === 'cancelled' || b.bookingStatus === 'failed')
  }, [bookings, tab])

  async function handleConfirmCancel(bookingId: string) {
    const result = await bookingsApi.cancelBooking(bookingId)
    if (result.success) {
      showToast('Booking cancelled', 'success')
      reload()
    } else {
      showToast(result.error.message, 'error')
    }
    setCancelTarget(null)
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink-900">My bookings</h1>

      <div className="mt-4 flex gap-1 border-b border-ink-100">
        {(['upcoming', 'completed', 'cancelled'] as Tab[]).map((value) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-sm font-medium capitalize',
              tab === value ? 'border-ink-950 text-ink-950' : 'border-transparent text-ink-500 hover:text-ink-800',
            )}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28 w-full" />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={`No ${tab} bookings`}
            description={tab === 'upcoming' ? 'Ready for your next journey?' : `You don't have any ${tab} bookings yet.`}
            action={tab === 'upcoming' ? <LinkButton to="/cars">Browse cars</LinkButton> : undefined}
          />
        ) : (
          filtered.map((booking) => (
            <BookingListCard
              key={booking.id}
              booking={booking}
              car={getCarById(booking.carId)}
              onCancel={setCancelTarget}
            />
          ))
        )}
      </div>

      <CancelBookingModal booking={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleConfirmCancel} />
    </div>
  )
}
