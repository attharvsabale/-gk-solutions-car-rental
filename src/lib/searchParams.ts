import type { CarFilters, SearchParams, SortOption } from '@/types/filters'
import { EMPTY_FILTERS } from '@/types/filters'
import type { CarCategory, CarFeature, FuelType, TransmissionType } from '@/types/car'

export interface SearchQuery {
  location?: string
  dropoffLocation?: string
  pickup?: string
  pickupTime?: string
  dropoff?: string
  dropoffTime?: string
}

export function buildSearchQueryString(query: SearchQuery): string {
  const params = new URLSearchParams()
  if (query.location) params.set('location', query.location)
  if (query.dropoffLocation && query.dropoffLocation !== query.location) params.set('dropoffLocation', query.dropoffLocation)
  if (query.pickup) params.set('pickup', query.pickup)
  if (query.pickupTime) params.set('pickupTime', query.pickupTime)
  if (query.dropoff) params.set('dropoff', query.dropoff)
  if (query.dropoffTime) params.set('dropoffTime', query.dropoffTime)
  return params.toString()
}

function splitParam(value: string | null): string[] {
  return value ? value.split(',').filter(Boolean) : []
}

export function parseSearchParams(urlParams: URLSearchParams): SearchParams {
  const filters: CarFilters = {
    ...EMPTY_FILTERS,
    categories: splitParam(urlParams.get('type')) as CarCategory[],
    brands: splitParam(urlParams.get('brand')),
    fuelTypes: splitParam(urlParams.get('fuel')) as FuelType[],
    transmissions: splitParam(urlParams.get('transmission')) as TransmissionType[],
    features: splitParam(urlParams.get('features')) as CarFeature[],
    minSeats: urlParams.get('seats') ? Number(urlParams.get('seats')) : undefined,
    minPrice: urlParams.get('minPrice') ? Number(urlParams.get('minPrice')) : undefined,
    maxPrice: urlParams.get('maxPrice') ? Number(urlParams.get('maxPrice')) : undefined,
    minRating: urlParams.get('minRating') ? Number(urlParams.get('minRating')) : undefined,
    instantBookingOnly: urlParams.get('instant') === 'true',
  }

  return {
    locationId: urlParams.get('location') ?? undefined,
    dropoffLocationId: urlParams.get('dropoffLocation') ?? urlParams.get('location') ?? undefined,
    pickupDate: urlParams.get('pickup') ?? undefined,
    pickupTime: urlParams.get('pickupTime') ?? undefined,
    dropoffDate: urlParams.get('dropoff') ?? undefined,
    dropoffTime: urlParams.get('dropoffTime') ?? undefined,
    filters,
    sort: (urlParams.get('sort') as SortOption) ?? 'recommended',
  }
}

export function filtersToUrlParams(current: URLSearchParams, filters: CarFilters, sort: SortOption): URLSearchParams {
  const params = new URLSearchParams(current)

  const setOrDelete = (key: string, value: string | undefined) => {
    if (value) params.set(key, value)
    else params.delete(key)
  }

  setOrDelete('type', filters.categories.join(',') || undefined)
  setOrDelete('brand', filters.brands.join(',') || undefined)
  setOrDelete('fuel', filters.fuelTypes.join(',') || undefined)
  setOrDelete('transmission', filters.transmissions.join(',') || undefined)
  setOrDelete('features', filters.features.join(',') || undefined)
  setOrDelete('seats', filters.minSeats?.toString())
  setOrDelete('minPrice', filters.minPrice?.toString())
  setOrDelete('maxPrice', filters.maxPrice?.toString())
  setOrDelete('minRating', filters.minRating?.toString())
  setOrDelete('sort', sort === 'recommended' ? undefined : sort)
  if (filters.instantBookingOnly) params.set('instant', 'true')
  else params.delete('instant')

  return params
}
