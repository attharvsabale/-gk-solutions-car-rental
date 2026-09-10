/**
 * Single gateway for browser storage. UI components and services must never
 * call localStorage directly — go through this module so persistence can be
 * swapped (e.g. for a real backend + cookies) without touching call sites.
 */

export const storageKeys = {
  users: 'car-rental:users',
  credentials: 'car-rental:credentials',
  session: 'car-rental:session',
  bookings: 'car-rental:bookings',
  favorites: 'car-rental:favorites',
  searchPrefs: 'car-rental:search-prefs',
  bookingDraft: 'car-rental:booking-draft',
  newsletter: 'car-rental:newsletter',
  carAvailabilityOverrides: 'car-rental:availability-overrides',
} as const

function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

const available = typeof window !== 'undefined' && isStorageAvailable()

export const storageService = {
  get<T>(key: string, fallback: T): T {
    if (!available) return fallback
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  set<T>(key: string, value: T): void {
    if (!available) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable (e.g. private browsing) — fail silently.
    }
  },
  remove(key: string): void {
    if (!available) return
    window.localStorage.removeItem(key)
  },
  clearAll(): void {
    if (!available) return
    Object.values(storageKeys).forEach((key) => window.localStorage.removeItem(key))
  },
}
