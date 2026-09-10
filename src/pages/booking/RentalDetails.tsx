import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocationAutocomplete } from '@/components/search/LocationAutocomplete'
import { Button } from '@/components/ui/Button'
import { useBookingStore } from '@/store/useBookingStore'
import { validateDateRange } from '@/lib/date'
import { checkCarAvailability } from '@/services/availabilityService'
import { useBookingContext } from './useBookingContext'

export default function RentalDetails() {
  const { car, draft } = useBookingContext()
  const { setRentalDetails } = useBookingStore()
  const navigate = useNavigate()

  const [pickupLocationId, setPickupLocationId] = useState(draft.pickupLocationId)
  const [dropoffLocationId, setDropoffLocationId] = useState(draft.dropoffLocationId)
  const [pickupDate, setPickupDate] = useState(draft.pickupDate)
  const [pickupTime, setPickupTime] = useState(draft.pickupTime)
  const [dropoffDate, setDropoffDate] = useState(draft.dropoffDate)
  const [dropoffTime, setDropoffTime] = useState(draft.dropoffTime)
  const [error, setError] = useState<string | null>(null)

  function handleContinue() {
    const validation = validateDateRange(pickupDate, dropoffDate)
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid dates.')
      return
    }
    if (!pickupLocationId || !dropoffLocationId) {
      setError('Pickup and drop-off locations are required.')
      return
    }

    const availability = checkCarAvailability(car.id, pickupDate, dropoffDate)
    if (!availability.available) {
      setError(availability.reason ?? 'This vehicle is no longer available for these dates.')
      return
    }

    setError(null)
    setRentalDetails({ pickupLocationId, dropoffLocationId, pickupDate, pickupTime, dropoffDate, dropoffTime })
    navigate('/booking/extras')
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7">
      <h1 className="font-display text-xl font-semibold text-ink-950">Rental details</h1>
      <p className="mt-1 text-sm text-ink-500">Confirm the pickup and drop-off details for your {car.brand} {car.model}.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LocationAutocomplete label="Pickup location" value={pickupLocationId} onChange={setPickupLocationId} />
        <LocationAutocomplete label="Drop-off location" value={dropoffLocationId} onChange={setDropoffLocationId} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rd-pickup-date" className="text-[13px] font-medium text-ink-700">Pickup date &amp; time</label>
          <div className="flex gap-2">
            <input
              id="rd-pickup-date"
              type="date"
              value={pickupDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setPickupDate(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border border-ink-200 bg-ink-50/60 px-3 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              aria-label="Pickup time"
              className="h-11 w-[5.75rem] shrink-0 rounded-lg border border-ink-200 bg-ink-50/60 px-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rd-dropoff-date" className="text-[13px] font-medium text-ink-700">Drop-off date &amp; time</label>
          <div className="flex gap-2">
            <input
              id="rd-dropoff-date"
              type="date"
              value={dropoffDate}
              min={pickupDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border border-ink-200 bg-ink-50/60 px-3 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12"
            />
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              aria-label="Drop-off time"
              className="h-11 w-[5.75rem] shrink-0 rounded-lg border border-ink-200 bg-ink-50/60 px-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-danger-600">{error}</p>}

      <div className="mt-7 flex justify-end border-t border-ink-100 pt-5">
        <Button size="lg" onClick={handleContinue}>Continue to extras</Button>
      </div>
    </div>
  )
}
