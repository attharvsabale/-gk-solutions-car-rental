import { Link } from 'react-router-dom'
import type { Booking } from '@/types/booking'
import type { Car } from '@/types/car'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/format'
import { formatDisplayDate } from '@/lib/date'
import { bookingStatusMeta } from '@/config/bookingStatus'
import { isCancellable } from '@/services/cancellationService'

interface BookingListCardProps {
  booking: Booking
  car: Car | undefined
  onCancel: (booking: Booking) => void
}

export function BookingListCard({ booking, car, onCancel }: BookingListCardProps) {
  const statusMeta = bookingStatusMeta[booking.bookingStatus]

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-ink-100 p-4 sm:flex-row sm:items-center">
      <img
        src={car?.images[0]}
        alt={car ? `${car.brand} ${car.model}` : 'Vehicle'}
        className="h-20 w-28 shrink-0 rounded-md object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-ink-900">{car ? `${car.brand} ${car.model}` : 'Vehicle'}</p>
          <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
        </div>
        <p className="text-sm text-ink-500">{booking.id}</p>
        <p className="mt-1 text-sm text-ink-600">
          {formatDisplayDate(booking.pickupDate)} → {formatDisplayDate(booking.dropoffDate)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-semibold text-ink-950">{formatCurrency(booking.pricing.total)}</p>
        <div className="flex gap-2">
          <Link to={`/account/bookings/${booking.id}`}>
            <Button variant="outline" size="sm">View details</Button>
          </Link>
          {isCancellable(booking) && (
            <Button variant="danger" size="sm" onClick={() => onCancel(booking)}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
