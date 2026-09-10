import { cars, getCarById } from '@/data/cars'
import { locations } from '@/data/locations'
import { delay } from '@/lib/delay'
import { mockConfig } from '@/config/debugConfig'
import { getAvailabilityOverrides } from '@/services/availabilityService'
import type { ApiResult } from '@/types/common'
import type { Car } from '@/types/car'
import type { SearchParams } from '@/types/filters'
import type { CarsApi } from './types'

const locationsById = new Map(locations.map((location) => [location.id, location]))

/** Accepts either a location id or a bare city name (used by destination cards). */
function resolveCityFilter(locationIdOrCity: string): string {
  return locationsById.get(locationIdOrCity)?.city ?? locationIdOrCity
}

function withOverrides(list: Car[]): Car[] {
  const overrides = getAvailabilityOverrides()
  return list.map((car) => (car.id in overrides ? { ...car, available: overrides[car.id] } : car))
}

function apiError(message: string): ApiResult<never> {
  return { success: false, error: { code: 'API_ERROR', message } }
}

function matchesFilters(car: Car, params: SearchParams): boolean {
  const { filters, locationId } = params

  if (locationId) {
    const carCity = locationsById.get(car.locationId)?.city
    if (carCity !== resolveCityFilter(locationId)) return false
  }
  if (filters.categories.length && !filters.categories.includes(car.category)) return false
  if (filters.brands.length && !filters.brands.includes(car.brand)) return false
  if (filters.fuelTypes.length && !filters.fuelTypes.includes(car.fuelType)) return false
  if (filters.transmissions.length && !filters.transmissions.includes(car.transmission)) return false
  if (filters.minSeats && car.seats < filters.minSeats) return false
  if (filters.minPrice && car.pricePerDay < filters.minPrice) return false
  if (filters.maxPrice && car.pricePerDay > filters.maxPrice) return false
  if (filters.minRating && car.rating < filters.minRating) return false
  if (filters.instantBookingOnly && !car.instantBooking) return false
  if (filters.features.length && !filters.features.every((feature) => car.features.includes(feature))) return false

  return true
}

function sortCars(list: Car[], sort: SearchParams['sort']): Car[] {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay)
    case 'price-desc':
      return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => b.year - a.year)
    case 'recommended':
    default:
      return sorted.sort((a, b) => {
        const scoreA = (a.badge ? 1 : 0) * 2 + a.rating
        const scoreB = (b.badge ? 1 : 0) * 2 + b.rating
        return scoreB - scoreA
      })
  }
}

export const mockCarsApi: CarsApi = {
  async getCars() {
    await delay()
    if (mockConfig.simulateApiError) return apiError('Unable to load cars. Please try again.')
    return { success: true, data: withOverrides(cars) }
  },

  async getCarById(id) {
    await delay()
    if (mockConfig.simulateApiError) return apiError('Unable to load this vehicle. Please try again.')
    const car = getCarById(id)
    return { success: true, data: car ? withOverrides([car])[0] : null }
  },

  async searchCars(params) {
    await delay()
    if (mockConfig.simulateApiError) return apiError('Search failed. Please try again.')
    const available = withOverrides(cars).filter((car) => car.available)
    const filtered = available.filter((car) => matchesFilters(car, params))
    return { success: true, data: sortCars(filtered, params.sort) }
  },
}
