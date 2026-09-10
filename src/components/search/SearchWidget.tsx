import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Search } from 'lucide-react'
import { LocationAutocomplete } from './LocationAutocomplete'
import { Button } from '@/components/ui/Button'
import { defaultDropoffDate, defaultPickupDate, validateDateRange } from '@/lib/date'
import { buildSearchQueryString } from '@/lib/searchParams'
import { cn } from '@/lib/cn'

interface SearchWidgetProps {
  variant?: 'hero' | 'compact'
}

const lightDateFieldClasses =
  'h-11 min-w-0 flex-1 rounded-lg border border-ink-200 bg-ink-50/60 pl-8 pr-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12'
const lightTimeFieldClasses =
  'h-11 w-[5.75rem] shrink-0 rounded-lg border border-ink-200 bg-ink-50/60 px-2 text-sm text-ink-900 transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12'

const darkDateFieldClasses =
  'h-11 min-w-0 flex-1 [color-scheme:dark] rounded-lg border border-transparent bg-white/10 pl-8 pr-2 text-sm text-white transition-[background-color,box-shadow] duration-150 hover:bg-white/15 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-brand-400/20'
const darkTimeFieldClasses =
  'h-11 w-[5.75rem] shrink-0 [color-scheme:dark] rounded-lg border border-transparent bg-white/10 px-2 text-sm text-white transition-[background-color,box-shadow] duration-150 hover:bg-white/15 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-brand-400/20'

export function SearchWidget({ variant = 'hero' }: SearchWidgetProps) {
  const navigate = useNavigate()
  const [pickupLocationId, setPickupLocationId] = useState('')
  const [dropoffLocationId, setDropoffLocationId] = useState('')
  const [differentDropoff, setDifferentDropoff] = useState(false)
  const [pickupDate, setPickupDate] = useState(defaultPickupDate())
  const [pickupTime, setPickupTime] = useState('10:00')
  const [dropoffDate, setDropoffDate] = useState(defaultDropoffDate())
  const [dropoffTime, setDropoffTime] = useState('10:00')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!pickupLocationId) nextErrors.pickupLocation = 'Pickup location is required.'
    if (differentDropoff && !dropoffLocationId) nextErrors.dropoffLocation = 'Drop-off location is required.'

    const dateValidation = validateDateRange(pickupDate, dropoffDate)
    if (!dateValidation.valid) nextErrors.dates = dateValidation.error ?? 'Invalid dates.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const query = buildSearchQueryString({
      location: pickupLocationId,
      dropoffLocation: differentDropoff ? dropoffLocationId : pickupLocationId,
      pickup: pickupDate,
      pickupTime,
      dropoff: dropoffDate,
      dropoffTime,
    })

    navigate(`/cars?${query}`)
  }

  const pickupDateInputId = variant === 'hero' ? 'pickup-date-hero' : 'pickup-date-compact'
  const dropoffDateInputId = variant === 'hero' ? 'dropoff-date-hero' : 'dropoff-date-compact'

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} aria-label="Search rental cars" className="w-full">
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-ink-950/70 shadow-panel backdrop-blur-md">
          <div className="grid grid-cols-1 divide-y divide-white/10 lg:grid-cols-[1fr_1fr_1.3fr_1.3fr_auto] lg:divide-x lg:divide-y-0">
            <div className="p-4">
              <LocationAutocomplete
                theme="dark"
                label="Pickup location"
                value={pickupLocationId}
                onChange={setPickupLocationId}
                placeholder="City, airport, or address"
                error={errors.pickupLocation}
              />
            </div>

            <div className="p-4">
              {differentDropoff ? (
                <LocationAutocomplete
                  theme="dark"
                  label="Drop-off location"
                  value={dropoffLocationId}
                  onChange={setDropoffLocationId}
                  placeholder="City, airport, or address"
                  error={errors.dropoffLocation}
                />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-white/60">Drop-off location</span>
                  <label className="flex h-11 items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-3 text-sm text-white/50 transition-colors hover:bg-white/10">
                    <input
                      type="checkbox"
                      checked={differentDropoff}
                      onChange={(e) => setDifferentDropoff(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 accent-brand-500"
                    />
                    Return to a different location
                  </label>
                </div>
              )}
            </div>

            <div className="p-4">
              <label htmlFor={pickupDateInputId} className="text-[13px] font-medium text-white/60">
                Pickup date &amp; time
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    id={pickupDateInputId}
                    type="date"
                    value={pickupDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={darkDateFieldClasses}
                  />
                </div>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  aria-label="Pickup time"
                  className={darkTimeFieldClasses}
                />
              </div>
            </div>

            <div className="p-4">
              <label htmlFor={dropoffDateInputId} className="text-[13px] font-medium text-white/60">
                Drop-off date &amp; time
              </label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    id={dropoffDateInputId}
                    type="date"
                    value={dropoffDate}
                    min={pickupDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className={darkDateFieldClasses}
                  />
                </div>
                <input
                  type="time"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  aria-label="Drop-off time"
                  className={darkTimeFieldClasses}
                />
              </div>
            </div>

            <div className="flex items-center p-3 lg:p-2">
              <Button type="submit" variant="secondary" size="lg" className="h-full w-full lg:w-auto">
                <Search className="h-4 w-4" />
                Search Cars
              </Button>
            </div>
          </div>
        </div>

        {differentDropoff && (
          <button
            type="button"
            onClick={() => setDifferentDropoff(false)}
            className="mt-3 text-xs font-medium text-white/60 underline hover:text-white"
          >
            Return to pickup location instead
          </button>
        )}

        {errors.dates && <p className="mt-3 text-center text-sm font-medium text-danger-300">{errors.dates}</p>}
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-ink-100 bg-white p-4 shadow-card"
      aria-label="Search rental cars"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.3fr_1.3fr_auto]">
        <LocationAutocomplete
          label="Pickup location"
          value={pickupLocationId}
          onChange={setPickupLocationId}
          placeholder="City, airport, or address"
          error={errors.pickupLocation}
        />

        {differentDropoff ? (
          <LocationAutocomplete
            label="Drop-off location"
            value={dropoffLocationId}
            onChange={setDropoffLocationId}
            placeholder="City, airport, or address"
            error={errors.dropoffLocation}
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-700">Drop-off location</span>
            <label className="flex h-11 items-center gap-2 rounded-lg border border-dashed border-ink-200 bg-ink-50/40 px-3 text-sm text-ink-500 transition-colors hover:border-ink-300">
              <input
                type="checkbox"
                checked={differentDropoff}
                onChange={(e) => setDifferentDropoff(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 accent-brand-500"
              />
              Return to a different location
            </label>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor={pickupDateInputId} className="text-[13px] font-medium text-ink-700">
            Pickup date &amp; time
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id={pickupDateInputId}
                type="date"
                value={pickupDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setPickupDate(e.target.value)}
                className={lightDateFieldClasses}
              />
            </div>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              aria-label="Pickup time"
              className={lightTimeFieldClasses}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={dropoffDateInputId} className="text-[13px] font-medium text-ink-700">
            Drop-off date &amp; time
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                id={dropoffDateInputId}
                type="date"
                value={dropoffDate}
                min={pickupDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className={lightDateFieldClasses}
              />
            </div>
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              aria-label="Drop-off time"
              className={lightTimeFieldClasses}
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button type="submit" variant="secondary" size="lg" className="w-full lg:w-auto">
            <Search className="h-4 w-4" />
            Search Cars
          </Button>
        </div>
      </div>

      {differentDropoff && (
        <button
          type="button"
          onClick={() => setDifferentDropoff(false)}
          className={cn('mt-3 text-xs font-medium text-ink-500 underline hover:text-ink-800')}
        >
          Return to pickup location instead
        </button>
      )}

      {errors.dates && <p className="mt-3 text-sm font-medium text-danger-600">{errors.dates}</p>}
    </form>
  )
}
