import type { Booking } from '@/types/booking'
import type { Car } from '@/types/car'
import { formatCurrency } from '@/lib/format'
import { formatDisplayDate } from '@/lib/date'
import { Badge } from '@/components/ui/Badge'
import { bookingStatusMeta } from '@/config/bookingStatus'

interface BookingReceiptProps {
  booking: Booking
  car: Car
  pickupLocationName?: string
  dropoffLocationName?: string
}

export function BookingReceipt({ booking, car, pickupLocationName, dropoffLocationName }: BookingReceiptProps) {
  const statusMeta = bookingStatusMeta[booking.bookingStatus]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-400">Booking ID</p>
          <p className="font-display text-lg font-semibold text-ink-950">{booking.id}</p>
        </div>
        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
      </div>

      <div className="border-t border-ink-100 pt-4">
        <p className="font-medium text-ink-900">{car.brand} {car.model} {car.variant}</p>
        <p className="text-sm text-ink-500">{car.year} · {car.transmission} · {car.fuelType}</p>
      </div>

      <table className="w-full text-sm">
        <tbody>
          <tr><td className="py-1 text-ink-500">Pickup</td><td className="py-1 text-right text-ink-800">{formatDisplayDate(booking.pickupDate)} · {booking.pickupTime}</td></tr>
          <tr><td className="py-1 text-ink-500">Pickup location</td><td className="py-1 text-right text-ink-800">{pickupLocationName ?? '—'}</td></tr>
          <tr><td className="py-1 text-ink-500">Drop-off</td><td className="py-1 text-right text-ink-800">{formatDisplayDate(booking.dropoffDate)} · {booking.dropoffTime}</td></tr>
          <tr><td className="py-1 text-ink-500">Drop-off location</td><td className="py-1 text-right text-ink-800">{dropoffLocationName ?? '—'}</td></tr>
          <tr><td className="py-1 text-ink-500">Payment method</td><td className="py-1 text-right capitalize text-ink-800">{booking.paymentMethod ?? '—'}</td></tr>
          <tr><td className="py-1 text-ink-500">Transaction ID</td><td className="py-1 text-right text-ink-800">{booking.transactionId ?? '—'}</td></tr>
        </tbody>
      </table>

      <div className="border-t border-ink-100 pt-3 text-sm">
        <div className="flex justify-between font-semibold text-ink-950">
          <span>Total paid</span>
          <span>{formatCurrency(booking.pricing.total)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-400">
          Security deposit of {formatCurrency(booking.pricing.deposit)} authorized separately.
        </p>
      </div>
    </div>
  )
}
