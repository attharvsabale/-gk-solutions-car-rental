import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, Car as CarIcon, IndianRupee, PlusCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUserBookings } from '@/hooks/useBooking'
import { useFavorites } from '@/hooks/useFavorites'
import { cars } from '@/data/cars'
import { CarGrid } from '@/components/cars/CarGrid'
import { LinkButton } from '@/components/ui/LinkButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/format'
import { formatDisplayDate } from '@/lib/date'
import { setPageMeta } from '@/lib/seo'

export default function AccountDashboard() {
  const { user } = useAuth()
  const { bookings, isLoading } = useUserBookings(user?.id ?? null)
  const { favoriteIds } = useFavorites()
  const [searchParams] = useSearchParams()
  const showFavorites = searchParams.get('tab') === 'favorites'

  useEffect(() => {
    setPageMeta('My Account | GK Solutions', 'View your bookings, favorites and profile.')
  }, [])

  const upcoming = useMemo(
    () => bookings.filter((b) => b.bookingStatus === 'confirmed' || b.bookingStatus === 'pending').sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))[0],
    [bookings],
  )
  const totalSpent = useMemo(
    () => bookings.filter((b) => b.paymentStatus === 'success').reduce((sum, b) => sum + b.pricing.total, 0),
    [bookings],
  )
  const favoriteCars = cars.filter((car) => favoriteIds.includes(car.id))

  if (showFavorites) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Favorites</h1>
        <p className="mt-1 text-sm text-ink-500">Cars you've saved for later.</p>
        <div className="mt-6">
          {favoriteCars.length === 0 ? (
            <EmptyState
              icon={CarIcon}
              title="No favorite cars"
              description="Tap the heart icon on any car to save it here."
              action={<LinkButton to="/cars">Browse cars</LinkButton>}
            />
          ) : (
            <CarGrid cars={favoriteCars} isLoading={false} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-950">Welcome back, {user?.firstName}</h1>
      <p className="mt-1 text-sm text-ink-500">Here's what's happening with your rentals.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarDays} label="Total trips" value={bookings.length.toString()} />
        <StatCard icon={IndianRupee} label="Total spent" value={formatCurrency(totalSpent)} />
        <StatCard icon={CarIcon} label="Favorite cars" value={favoriteCars.length.toString()} />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-ink-900">Upcoming booking</h2>
        {isLoading ? (
          <Skeleton className="mt-3 h-24 w-full rounded-xl" />
        ) : upcoming ? (
          <Link
            to={`/account/bookings/${upcoming.id}`}
            className="mt-3 flex items-center justify-between rounded-xl border border-ink-100 bg-white p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/30"
          >
            <div>
              <p className="font-medium text-ink-900">{upcoming.id}</p>
              <p className="text-sm text-ink-500">
                {formatDisplayDate(upcoming.pickupDate)} → {formatDisplayDate(upcoming.dropoffDate)}
              </p>
            </div>
            <p className="font-display font-semibold text-ink-950">{formatCurrency(upcoming.pricing.total)}</p>
          </Link>
        ) : (
          <div className="mt-3">
            <EmptyState
              icon={CalendarDays}
              title="No upcoming trips"
              description="Ready for your next journey?"
              action={<LinkButton to="/cars">Browse cars</LinkButton>}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton to="/cars" variant="secondary"><PlusCircle className="h-4 w-4" /> Book a car</LinkButton>
        <LinkButton to="/account/bookings" variant="outline">View bookings</LinkButton>
        <LinkButton to="/account/profile" variant="outline">Edit profile</LinkButton>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <Icon className="h-4 w-4 text-brand-700" strokeWidth={1.75} />
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-ink-950">{value}</p>
    </div>
  )
}
