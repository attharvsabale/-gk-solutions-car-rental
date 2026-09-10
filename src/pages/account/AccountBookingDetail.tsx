import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Check, Circle } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { useCar } from '@/hooks/useCar'
import { useLocations } from '@/hooks/useLocations'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CancelBookingModal } from '@/components/booking/CancelBookingModal'
import { bookingsApi } from '@/services/api'
import { bookingStatusMeta } from '@/config/bookingStatus'
import { isCancellable } from '@/services/cancellationService'
import { getExtraById } from '@/data/extras'
import { formatCurrency } from '@/lib/format'
import { formatDisplayDate } from '@/lib/date'
import { setPageMeta } from '@/lib/seo'
import { useToastStore } from '@/store/useToastStore'
import type { Booking } from '@/types/booking'

export default function AccountBookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { booking, isLoading, error, reload } = useBooking(bookingId)
  const { car } = useCar(booking?.carId)
  const { locations } = useLocations()
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const showToast = useToastStore((state) => state.show)

  useEffect(() => {
    setPageMeta(`Booking ${bookingId} | GK Solutions`, 'View your booking details, price breakdown and cancellation policy.')
  }, [bookingId])

  async function handleConfirmCancel(id: string) {
    const result = await bookingsApi.cancelBooking(id)
    if (result.success) {
      showToast('Booking cancelled', 'success')
      reload()
    } else {
      showToast(result.error.message, 'error')
    }
    setCancelTarget(null)
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (error || !booking) {
    return <ErrorState title="Booking not found" message="We couldn't find this booking." />
  }

  const statusMeta = bookingStatusMeta[booking.bookingStatus]
  const pickupLocation = locations.find((l) => l.id === booking.pickupLocationId)
  const dropoffLocation = locations.find((l) => l.id === booking.dropoffLocationId)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Booking {booking.id}</h1>
          <p className="text-sm text-ink-500">Placed on {formatDisplayDate(booking.createdAt.slice(0, 10))}</p>
        </div>
        <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
      </div>

      {car && (
        <div className="mt-6 flex gap-4 rounded-lg border border-ink-100 p-4">
          <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="h-24 w-32 rounded-md object-cover" />
          <div>
            <p className="font-medium text-ink-900">{car.brand} {car.model} {car.variant}</p>
            <p className="text-sm text-ink-500">{car.year} · {car.transmission} · {car.fuelType}</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InfoBlock title="Pickup">
          <p>{formatDisplayDate(booking.pickupDate)} at {booking.pickupTime}</p>
          <p className="text-ink-500">{pickupLocation?.name}</p>
        </InfoBlock>
        <InfoBlock title="Drop-off">
          <p>{formatDisplayDate(booking.dropoffDate)} at {booking.dropoffTime}</p>
          <p className="text-ink-500">{dropoffLocation?.name}</p>
        </InfoBlock>
        <InfoBlock title="Customer">
          <p>{booking.customer.firstName} {booking.customer.lastName}</p>
          <p className="text-ink-500">{booking.customer.email}</p>
        </InfoBlock>
        <InfoBlock title="Payment">
          <p className="capitalize">{booking.paymentMethod ?? '—'} · {booking.paymentStatus}</p>
          <p className="text-ink-500">{booking.transactionId ?? '—'}</p>
        </InfoBlock>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Timeline</h2>
        <ol className="mt-3 flex flex-col gap-3">
          {booking.timeline.map((entry) => (
            <li key={entry.label} className="flex items-center gap-3 text-sm">
              {entry.done ? (
                <Check className="h-4 w-4 text-success-500" />
              ) : (
                <Circle className="h-4 w-4 text-ink-300" />
              )}
              <span className={entry.done ? 'text-ink-800' : 'text-ink-400'}>{entry.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Extras</h2>
        {booking.extras.length === 0 ? (
          <p className="mt-2 text-sm text-ink-400">No extras selected.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm text-ink-600">
            {booking.extras.map((selected) => {
              const extra = getExtraById(selected.extraId)
              if (!extra) return null
              return <li key={selected.extraId}>{extra.name} × {selected.quantity}</li>
            })}
          </ul>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-ink-100 p-4">
        <h2 className="text-sm font-semibold text-ink-900">Price breakdown</h2>
        <div className="mt-3 flex flex-col gap-1.5 text-sm">
          <PriceRow label="Base rental" value={booking.pricing.basePrice} />
          {booking.pricing.discountAmount > 0 && <PriceRow label={booking.pricing.discountLabel ?? 'Discount'} value={-booking.pricing.discountAmount} />}
          {booking.pricing.locationFee > 0 && <PriceRow label="One-way drop-off fee" value={booking.pricing.locationFee} />}
          {booking.pricing.insuranceFee > 0 && <PriceRow label="Insurance" value={booking.pricing.insuranceFee} />}
          {booking.pricing.extrasTotal > 0 && <PriceRow label="Extras" value={booking.pricing.extrasTotal} />}
          <PriceRow label="Service fee" value={booking.pricing.serviceFee} />
          <PriceRow label="GST (18%)" value={booking.pricing.taxes} />
          <div className="mt-1 flex justify-between border-t border-ink-100 pt-2 font-semibold text-ink-950">
            <span>Total</span>
            <span>{formatCurrency(booking.pricing.total)}</span>
          </div>
          <p className="text-xs text-ink-400">Security deposit: {formatCurrency(booking.pricing.deposit)} (authorized separately)</p>
        </div>
      </div>

      {isCancellable(booking) && (
        <div className="mt-6">
          <Button variant="danger" onClick={() => setCancelTarget(booking)}>Cancel booking</Button>
        </div>
      )}

      <CancelBookingModal booking={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={handleConfirmCancel} />
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-100 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{title}</p>
      <div className="mt-1.5 text-sm text-ink-800">{children}</div>
    </div>
  )
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-ink-600">
      <span>{label}</span>
      <span>{value < 0 ? '− ' : ''}{formatCurrency(Math.abs(value))}</span>
    </div>
  )
}
