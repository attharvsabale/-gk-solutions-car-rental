import { describe, expect, it } from 'vitest'
import { mockCarsApi } from './carsApi'
import { EMPTY_FILTERS } from '@/types/filters'
import type { SearchParams } from '@/types/filters'

function paramsWith(overrides: Partial<SearchParams> = {}): SearchParams {
  return {
    filters: { ...EMPTY_FILTERS },
    sort: 'recommended',
    ...overrides,
  }
}

describe('mockCarsApi.searchCars — filtering', () => {
  it('returns only cars matching the selected category', async () => {
    const result = await mockCarsApi.searchCars(
      paramsWith({ filters: { ...EMPTY_FILTERS, categories: ['Hatchback'] } }),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.data.every((car) => car.category === 'Hatchback')).toBe(true)
  })

  it('returns only cars within the given price range', async () => {
    const result = await mockCarsApi.searchCars(
      paramsWith({ filters: { ...EMPTY_FILTERS, minPrice: 3000, maxPrice: 5000 } }),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.every((car) => car.pricePerDay >= 3000 && car.pricePerDay <= 5000)).toBe(true)
  })

  it('returns only cars that seat at least the requested number of people', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ filters: { ...EMPTY_FILTERS, minSeats: 7 } }))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.every((car) => car.seats >= 7)).toBe(true)
  })

  it('returns only instant-booking cars when that filter is on', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ filters: { ...EMPTY_FILTERS, instantBookingOnly: true } }))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.every((car) => car.instantBooking)).toBe(true)
  })

  it('combines multiple filters with AND semantics', async () => {
    const result = await mockCarsApi.searchCars(
      paramsWith({ filters: { ...EMPTY_FILTERS, categories: ['SUV'], transmissions: ['Automatic'] } }),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.every((car) => car.category === 'SUV' && car.transmission === 'Automatic')).toBe(true)
  })
})

describe('mockCarsApi.searchCars — sorting', () => {
  it('sorts by price ascending', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ sort: 'price-asc' }))
    expect(result.success).toBe(true)
    if (!result.success) return
    const prices = result.data.map((car) => car.pricePerDay)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by price descending', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ sort: 'price-desc' }))
    expect(result.success).toBe(true)
    if (!result.success) return
    const prices = result.data.map((car) => car.pricePerDay)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('sorts by rating descending', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ sort: 'rating' }))
    expect(result.success).toBe(true)
    if (!result.success) return
    const ratings = result.data.map((car) => car.rating)
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a))
  })

  it('sorts by newest year first', async () => {
    const result = await mockCarsApi.searchCars(paramsWith({ sort: 'newest' }))
    expect(result.success).toBe(true)
    if (!result.success) return
    const years = result.data.map((car) => car.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })
})

describe('mockCarsApi.getCarById', () => {
  it('returns null for an unknown id instead of throwing', async () => {
    const result = await mockCarsApi.getCarById('does-not-exist')
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toBeNull()
  })
})
