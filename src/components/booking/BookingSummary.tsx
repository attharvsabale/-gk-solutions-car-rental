import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
import type { Car } from '@/types/car'
import type { BookingDraft } from '@/store/useBookingStore'
import { calculateRentalPrice } from '@/services/pricingService'
import { formatCurrency } from '@/lib/format'
import { formatDisplayDate } from '@/lib/date'
import { useLocations } from '@/hooks/useLocations'
import { getExtraById } from '@/data/extras'

export function BookingSummary({ car, draft }: { car: Car; draft: BookingDraft }) {
  const { locations } = useLocations()

  const pricing = useMemo(
    () =>
      calculateRentalPrice({
        car,
        pickupDate: draft.pickupDate,
        dropoffDate: draft.dropoffDate,
        extras: draft.extras,
        insuranceSelected: draft.insuranceSelected,
        pickupLocationId: draft.pickupLocationId,
        dropoffLocationId: draft.dropoffLocationId,
      }),
    [car, draft],
  )

  const pickupLocation = locations.find((l) => l.id === draft.pickupLocationId)
  const dropoffLocation = locations.find((l) => l.id === draft.dropoffLocationId)

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="flex gap-3 bg-ink-950 p-5">
        <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="h-16 w-20 rounded-lg object-cover" />
        <div>
          <p className="kicker text-brand-400">Booking summary</p>
          <p className="font-display font-semibold text-white">{car.brand} {car.model}</p>
          <p className="text-xs text-ink-300">{car.variant} · {car.transmission} · {car.fuelType}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-2 text-xs text-ink-500">
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
            <span><span className="font-medium text-ink-700">Pickup</span> · {formatDisplayDate(draft.pickupDate)}, {draft.pickupTime}{pickupLocation ? ` · ${pickupLocation.name}` : ''}</span>
          </p>
          <p className="flex items-start gap-1.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
            <span><span className="font-medium text-ink-700">Drop-off</span> · {formatDisplayDate(draft.dropoffDate)}, {draft.dropoffTime}{dropoffLocation ? ` · ${dropoffLocation.name}` : ''}</span>
          </p>
        </div>

        <div className="divider-dashed my-4" />

        <div className="flex flex-col gap-2 text-sm">
          <Row label={`Rental (${pricing.numberOfDays} day${pricing.numberOfDays > 1 ? 's' : ''})`} value={formatCurrency(pricing.basePrice)} />
          {pricing.discountAmount > 0 && <Row label={pricing.discountLabel ?? 'Discount'} value={`− ${formatCurrency(pricing.discountAmount)}`} muted />}
          {pricing.locationFee > 0 && <Row label="One-way drop-off fee" value={formatCurrency(pricing.locationFee)} />}
          {pricing.insuranceFee > 0 && <Row label="Premium insurance" value={formatCurrency(pricing.insuranceFee)} />}
          {pricing.extrasTotal > 0 && (
            <div>
              <Row label="Extras" value={formatCurrency(pricing.extrasTotal)} />
              <ul className="mt-1 space-y-0.5 pl-3 text-xs text-ink-400">
                {draft.extras.map((selected) => {
                  const extra = getExtraById(selected.extraId)
                  if (!extra) return null
                  return (
                    <li key={selected.extraId}>
                      {extra.name} × {selected.quantity}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <Row label="Service fee" value={formatCurrency(pricing.serviceFee)} />
          <Row label="GST (18%)" value={formatCurrency(pricing.taxes)} />
        </div>

        <div className="divider-dashed my-4" />

        <div className="flex items-center justify-between">
          <span className="font-display text-base font-semibold text-ink-950">Total</span>
          <span className="font-display text-xl font-bold tabular-nums text-ink-950">{formatCurrency(pricing.total)}</span>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Security deposit of {formatCurrency(pricing.deposit)} is authorized separately and refunded after return.
        </p>
      </div>
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between tabular-nums ${muted ? 'font-medium text-success-600' : 'text-ink-500'}`}>
      <span>{label}</span>
      <span className={muted ? '' : 'font-medium text-ink-800'}>{value}</span>
    </div>
  )
}
