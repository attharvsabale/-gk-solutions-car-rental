import { SearchX } from 'lucide-react'
import type { Car } from '@/types/car'
import { CarCard } from './CarCard'
import { CarCardSkeleton } from './CarCardSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'

interface CarGridProps {
  cars: Car[]
  isLoading: boolean
  error?: string | null
  onRetry?: () => void
  onClearFilters?: () => void
}

export function CarGrid({ cars, isLoading, error, onRetry, onClearFilters }: CarGridProps) {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CarCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No cars found"
        description="Try adjusting your filters or search a different location and date range."
        action={onClearFilters && <Button variant="outline" onClick={onClearFilters}>Clear all filters</Button>}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  )
}
