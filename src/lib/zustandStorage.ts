import type { StateStorage } from 'zustand/middleware'

/**
 * Storage adapter for zustand's `persist` middleware. This is the one place
 * (alongside storageService.ts) allowed to touch window.localStorage
 * directly — UI code should always go through a store or storageService.
 */
export const zustandLocalStorage: StateStorage = {
  getItem: (name) => window.localStorage.getItem(name),
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: (name) => window.localStorage.removeItem(name),
}
