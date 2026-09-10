import { locations } from '@/data/locations'
import { delay } from '@/lib/delay'
import type { LocationsApi } from './types'

export const mockLocationsApi: LocationsApi = {
  async getLocations() {
    await delay()
    return { success: true, data: locations }
  },

  async getLocationById(id) {
    await delay()
    return { success: true, data: locations.find((location) => location.id === id) ?? null }
  },

  async searchLocations(query) {
    await delay(150)
    const normalized = query.trim().toLowerCase()
    if (!normalized) return { success: true, data: locations }
    const matches = locations.filter(
      (location) =>
        location.name.toLowerCase().includes(normalized) || location.city.toLowerCase().includes(normalized),
    )
    return { success: true, data: matches }
  },
}
