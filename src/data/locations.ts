import type { RentalLocation } from '@/types/location'

/**
 * GK Solutions currently operates from a single pickup point in Hinjewadi,
 * Pune. Structured as a list (rather than a single object) so additional
 * pickup points can be added later without changing any consuming code.
 */
export const locations: RentalLocation[] = [
  {
    id: 'loc-hinjewadi',
    name: 'GK Solutions — Hinjewadi',
    city: 'Pune',
    address: 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057',
    latitude: 18.5913,
    longitude: 73.7389,
    openingHours: '7:00 AM – 9:00 PM',
    phone: '9657921567',
    type: 'city',
  },
]

export const cities = Array.from(new Set(locations.map((location) => location.city)))
