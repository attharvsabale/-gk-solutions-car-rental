import type { CarCategory, CarFeature, FuelType, TransmissionType } from './car'

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export interface CarFilters {
  locationId?: string
  categories: CarCategory[]
  brands: string[]
  fuelTypes: FuelType[]
  transmissions: TransmissionType[]
  minSeats?: number
  minPrice?: number
  maxPrice?: number
  features: CarFeature[]
  minRating?: number
  instantBookingOnly: boolean
}

export interface SearchParams {
  locationId?: string
  pickupDate?: string
  pickupTime?: string
  dropoffDate?: string
  dropoffTime?: string
  dropoffLocationId?: string
  filters: CarFilters
  sort: SortOption
}

export const EMPTY_FILTERS: CarFilters = {
  categories: [],
  brands: [],
  fuelTypes: [],
  transmissions: [],
  features: [],
  instantBookingOnly: false,
}
