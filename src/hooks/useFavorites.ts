import { useEffect } from 'react'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useToastStore } from '@/store/useToastStore'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { user } = useAuth()
  const { ids, load, toggle, isFavorite } = useFavoritesStore()
  const showToast = useToastStore((state) => state.show)

  useEffect(() => {
    load(user?.id ?? null)
  }, [user?.id, load])

  const toggleFavorite = (carId: string) => {
    const wasFavorite = isFavorite(carId)
    toggle(user?.id ?? null, carId)
    showToast(wasFavorite ? 'Removed from favorites' : 'Added to favorites', 'success')
  }

  return { favoriteIds: ids, isFavorite, toggleFavorite }
}
