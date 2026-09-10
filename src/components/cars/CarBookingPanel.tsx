import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, ShieldCheck } from 'lucide-react'
import type { Car } from '@/types/car'
import { LocationAutocomplete } from '@/components/search/LocationAutocomplete'
import { Button } from '@/components/ui/Button'
import { calculateRentalPrice } from '@/services/pricingService'
import { formatCurrency } from '@/lib/format'
import { validateDateRange } from '@/lib/date'
import { useBookingStore } from '@/store/useBookingStore'
import { useToastStore } from '@/store/useToastStore'

const dateFieldClasses =
  'h-11 min-w-0 flex-1 rounded-lg border border-ink-200 bg-ink-50/60 pl-8 pr-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12'
const timeFieldClasses =
  'h-11 w-[5.75rem] shrink-0 rounded-lg border border-ink-200 bg-ink-50/60 px-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12'

export function CarBookingPanel({ car }: { car: Car }) {
  const navigate = useNavigate()
  const { draft, setCar, setRentalDetails } = useBookingStore()
  const showToast = useToastStore((state) => state.show)

  const [pickupLocationId, setPickupLocationId] = useState(draft.carId === car.id ? draft.pickupLocationId : car.locationId)
  const [dropoffLocationId, setDropoffLocationId] = useState(draft.carId === car.id ? draft.dropoffLocationId : car.locationId)
  const [pickupDate, setPickupDate] = useState(draft.pickupDate)
  const [pickupTime, setPickupTime] = useState(draft.pickupTime)
  const [dropoffDate, setDropoffDate] = useState(draft.dropoffDate)
  const [dropoffTime, setDropoffTime] = useState(draft.dropoffTime)
  const [dateError, setDateError] = useState<string | null>(null)

  const pricing = useMemo(() => {
    const validation = validateDateRange(pickupDate, dropoffDate)
    if (!validation.valid) return null
    return calculateRentalPrice({
      car,
      pickupDate,
      dropoffDate,
      extras: [],
      insuranceSelected: false,
      pickupLocationId,
      dropoffLocationId,
    })
  }, [car, pickupDate, dropoffDate, pickupLocationId, dropoffLocationId])

  function handleReserve() {
    const validation = validateDateRange(pickupDate, dropoffDate)
    if (!validation.valid) {
      setDateError(validation.error ?? 'Invalid dates.')
      return
    }
    setDateError(null)
    setCar(car.id, car.locationId)
    setRentalDetails({ pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime })
    showToast('Vehicle reserved — continue your booking', 'success')
    navigate('/booking')
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-panel">
      <div className="border-b border-ink-100 p-5">
        <p className="font-display text-3xl font-bold leading-none text-ink-950">
          {formatCurrency(car.pricePerDay)}
          <span className="text-base font-normal text-ink-500">/day</span>
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-success-600">
          <ShieldCheck className="h-3.5 w-3.5" /> Free cancellation up to 48 hours before pickup
        </p>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <LocationAutocomplete label="Pickup location" value={pickupLocationId} onChange={setPickupLocationId} />
        <LocationAutocomplete label="Drop-off location" value={dropoffLocationId} onChange={setDropoffLocationId} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="panel-pickup-date" className="text-[13px] font-medium text-ink-700">
            Pickup
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id="panel-pickup-date"
                type="date"
                value={pickupDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setPickupDate(e.target.value)}
                className={dateFieldClasses}
              />
            </div>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              aria-label="Pickup time"
              className={timeFieldClasses}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="panel-dropoff-date" className="text-[13px] font-medium text-ink-700">
            Drop-off
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id="panel-dropoff-date"
                type="date"
                value={dropoffDate}
                min={pickupDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className={dateFieldClasses}
              />
            </div>
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              aria-label="Drop-off time"
              className={timeFieldClasses}
            />
          </div>
        </div>

        {dateError && <p className="text-sm font-medium text-danger-600">{dateError}</p>}

        {pricing && (
          <div className="mt-1 flex flex-col gap-2 border-t border-ink-100 pt-4 text-sm">
            <Row label={`${formatCurrency(car.pricePerDay)} × ${pricing.numberOfDays} day${pricing.numberOfDays > 1 ? 's' : ''}`} value={formatCurrency(pricing.basePrice + pricing.discountAmount)} />
            {pricing.discountAmount > 0 && <Row label={pricing.discountLabel ?? 'Discount'} value={`− ${formatCurrency(pricing.discountAmount)}`} muted />}
            {pricing.locationFee > 0 && <Row label="One-way drop-off fee" value={formatCurrency(pricing.locationFee)} />}
            <Row label="Service fee" value={formatCurrency(pricing.serviceFee)} />
            <Row label="GST (18%)" value={formatCurrency(pricing.taxes)} />
            <div className="divider-dashed my-1" />
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-ink-950">Total</span>
              <span className="font-display text-xl font-bold tabular-nums text-ink-950">{formatCurrency(pricing.total)}</span>
            </div>
            <p className="text-xs text-ink-400">
              Security deposit of {formatCurrency(pricing.deposit)} is authorized separately and not included above.
            </p>
          </div>
        )}

        <Button variant="secondary" className="mt-2 w-full" size="lg" onClick={handleReserve} disabled={!car.available}>
          {car.available ? 'Reserve this car' : 'Currently unavailable'}
        </Button>
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
