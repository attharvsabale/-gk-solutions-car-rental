import type { SortOption } from '@/types/filters'
import { Select } from '@/components/ui/Select'

const options: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
]

export function CarSort({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) {
  return (
    <Select
      aria-label="Sort cars"
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="h-10 w-auto min-w-[190px]"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
