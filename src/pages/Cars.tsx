import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchCars } from '@/hooks/useSearchCars'
import { CarFilters } from '@/components/cars/CarFilters'
import { CarSort } from '@/components/cars/CarSort'
import { CarGrid } from '@/components/cars/CarGrid'
import { ActiveFilterChips } from '@/components/cars/ActiveFilterChips'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { SearchWidget } from '@/components/search/SearchWidget'
import { parseSearchParams, filtersToUrlParams } from '@/lib/searchParams'
import { EMPTY_FILTERS, type CarFilters as CarFiltersType, type SortOption } from '@/types/filters'
import { setPageMeta } from '@/lib/seo'

export default function Cars() {
  const [urlParams, setUrlParams] = useSearchParams()
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const searchParams = useMemo(() => parseSearchParams(urlParams), [urlParams])
  const { cars, isLoading, error } = useSearchCars(searchParams)

  useEffect(() => {
    setPageMeta('Browse Self-Drive Cars | GK Solutions', 'Compare the Chevrolet Spark, Beat, Toyota Hyryder and BMW X3 — self-drive rentals in Hinjewadi, Pune.')
  }, [])

  function updateFilters(filters: CarFiltersType) {
    setUrlParams(filtersToUrlParams(urlParams, filters, searchParams.sort))
  }

  function updateSort(sort: SortOption) {
    setUrlParams(filtersToUrlParams(urlParams, searchParams.filters, sort))
  }

  function clearFilters() {
    setUrlParams(filtersToUrlParams(urlParams, EMPTY_FILTERS, searchParams.sort))
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <SearchWidget variant="compact" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900">
            {isLoading ? 'Searching…' : `${cars.length} car${cars.length === 1 ? '' : 's'} available`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setIsFilterDrawerOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <CarSort value={searchParams.sort} onChange={updateSort} />
        </div>
      </div>

      <div className="mb-6">
        <ActiveFilterChips filters={searchParams.filters} onChange={updateFilters} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CarFilters filters={searchParams.filters} onChange={updateFilters} onClear={clearFilters} />
          </div>
        </aside>

        <div>
          <CarGrid cars={cars} isLoading={isLoading} error={error} onClearFilters={clearFilters} />
        </div>
      </div>

      <Drawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title="Filters" side="bottom">
        <CarFilters filters={searchParams.filters} onChange={updateFilters} onClear={clearFilters} />
      </Drawer>
    </div>
  )
}
