import { X } from 'lucide-react'
import type { CarFilters } from '@/types/filters'
import { EMPTY_FILTERS } from '@/types/filters'

interface Chip {
  label: string
  onRemove: () => void
}

function buildChips(filters: CarFilters, onChange: (filters: CarFilters) => void): Chip[] {
  const chips: Chip[] = []

  filters.categories.forEach((category) =>
    chips.push({ label: category, onRemove: () => onChange({ ...filters, categories: filters.categories.filter((c) => c !== category) }) }),
  )
  filters.brands.forEach((brand) =>
    chips.push({ label: brand, onRemove: () => onChange({ ...filters, brands: filters.brands.filter((b) => b !== brand) }) }),
  )
  filters.fuelTypes.forEach((fuel) =>
    chips.push({ label: fuel, onRemove: () => onChange({ ...filters, fuelTypes: filters.fuelTypes.filter((f) => f !== fuel) }) }),
  )
  filters.transmissions.forEach((transmission) =>
    chips.push({ label: transmission, onRemove: () => onChange({ ...filters, transmissions: filters.transmissions.filter((t) => t !== transmission) }) }),
  )
  filters.features.forEach((feature) =>
    chips.push({ label: feature, onRemove: () => onChange({ ...filters, features: filters.features.filter((f) => f !== feature) }) }),
  )
  if (filters.minSeats) chips.push({ label: `${filters.minSeats}+ seats`, onRemove: () => onChange({ ...filters, minSeats: undefined }) })
  if (filters.minRating) chips.push({ label: `${filters.minRating}+ rating`, onRemove: () => onChange({ ...filters, minRating: undefined }) })
  if (filters.instantBookingOnly) chips.push({ label: 'Instant booking', onRemove: () => onChange({ ...filters, instantBookingOnly: false }) })

  return chips
}

export function ActiveFilterChips({ filters, onChange }: { filters: CarFilters; onChange: (filters: CarFilters) => void }) {
  const chips = buildChips(filters, onChange)
  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-50"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button
        onClick={() => onChange(EMPTY_FILTERS)}
        className="text-xs font-medium text-ink-500 underline hover:text-ink-800"
      >
        Clear all
      </button>
    </div>
  )
}
