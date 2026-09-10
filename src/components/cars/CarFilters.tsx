import type { ReactNode } from 'react'
import type { CarFilters as CarFiltersType } from '@/types/filters'
import type { CarCategory, CarFeature, FuelType, TransmissionType } from '@/types/car'
import { carBrands, carCategories } from '@/data/cars'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
const transmissions: TransmissionType[] = ['Automatic', 'Manual']
const featureOptions: CarFeature[] = [
  'Apple CarPlay',
  'Android Auto',
  'GPS Navigation',
  'Sunroof',
  'Bluetooth',
  'Cruise Control',
  'Child Seat Ready',
]
const seatOptions = [2, 4, 5, 7]
const ratingOptions = [4, 4.5]

interface CarFiltersProps {
  filters: CarFiltersType
  onChange: (filters: CarFiltersType) => void
  onClear: () => void
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function CarFilters({ filters, onChange, onClear }: CarFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink-950">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <FilterSection title="Car type">
        <PillGroup
          options={carCategories}
          selected={filters.categories}
          onToggle={(value) => onChange({ ...filters, categories: toggleValue(filters.categories, value as CarCategory) })}
        />
      </FilterSection>

      <FilterSection title="Brand">
        <PillGroup
          options={carBrands}
          selected={filters.brands}
          onToggle={(value) => onChange({ ...filters, brands: toggleValue(filters.brands, value) })}
        />
      </FilterSection>

      <FilterSection title="Fuel type">
        <PillGroup
          options={fuelTypes}
          selected={filters.fuelTypes}
          onToggle={(value) => onChange({ ...filters, fuelTypes: toggleValue(filters.fuelTypes, value as FuelType) })}
        />
      </FilterSection>

      <FilterSection title="Transmission">
        <PillGroup
          options={transmissions}
          selected={filters.transmissions}
          onToggle={(value) => onChange({ ...filters, transmissions: toggleValue(filters.transmissions, value as TransmissionType) })}
        />
      </FilterSection>

      <FilterSection title="Seats">
        <PillGroup
          options={seatOptions.map((s) => `${s}+`)}
          selected={filters.minSeats ? [`${filters.minSeats}+`] : []}
          onToggle={(value) => {
            const seats = Number(value.replace('+', ''))
            onChange({ ...filters, minSeats: filters.minSeats === seats ? undefined : seats })
          }}
        />
      </FilterSection>

      <FilterSection title="Features">
        <PillGroup
          options={featureOptions}
          selected={filters.features}
          onToggle={(value) => onChange({ ...filters, features: toggleValue(filters.features, value as CarFeature) })}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <PillGroup
          options={ratingOptions.map((r) => `${r}+ ★`)}
          selected={filters.minRating ? [`${filters.minRating}+ ★`] : []}
          onToggle={(value) => {
            const rating = Number(value.replace('+ ★', ''))
            onChange({ ...filters, minRating: filters.minRating === rating ? undefined : rating })
          }}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <button
          type="button"
          role="switch"
          aria-checked={filters.instantBookingOnly}
          onClick={() => onChange({ ...filters, instantBookingOnly: !filters.instantBookingOnly })}
          className="flex w-full items-center justify-between rounded-lg border border-ink-200 bg-ink-50/60 px-3.5 py-2.5 text-left transition-colors hover:border-ink-300"
        >
          <span className="text-sm font-medium text-ink-800">Instant booking only</span>
          <span
            className={cn(
              'relative h-5 w-9 shrink-0 rounded-full transition-colors',
              filters.instantBookingOnly ? 'bg-brand-500' : 'bg-ink-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                filters.instantBookingOnly && 'translate-x-4',
              )}
            />
          </span>
        </button>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-ink-100 pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-[13px] font-semibold text-ink-800">{title}</h3>
      {children}
    </div>
  )
}

function PillGroup({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={isActive}
            className={cn(
              'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
