import { create } from 'zustand'
import { getFavoriteIds, toggleFavorite } from '@/services/favoritesService'

interface FavoritesState {
  ids: string[]
  load: (userId: string | null) => void
  toggle: (userId: string | null, carId: string) => void
  isFavorite: (carId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  load: (userId) => set({ ids: getFavoriteIds(userId) }),
  toggle: (userId, carId) => set({ ids: toggleFavorite(userId, carId) }),
  isFavorite: (carId) => get().ids.includes(carId),
}))
