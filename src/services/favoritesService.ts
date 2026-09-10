import { storageKeys, storageService } from '@/lib/storageService'

type FavoritesMap = Record<string, string[]>

const GUEST_KEY = 'guest'

function readMap(): FavoritesMap {
  return storageService.get<FavoritesMap>(storageKeys.favorites, {})
}

function writeMap(map: FavoritesMap): void {
  storageService.set(storageKeys.favorites, map)
}

export function getFavoriteIds(userId: string | null): string[] {
  const map = readMap()
  return map[userId ?? GUEST_KEY] ?? []
}

export function toggleFavorite(userId: string | null, carId: string): string[] {
  const map = readMap()
  const key = userId ?? GUEST_KEY
  const current = map[key] ?? []
  map[key] = current.includes(carId) ? current.filter((id) => id !== carId) : [...current, carId]
  writeMap(map)
  return map[key]
}

/** Merges guest favorites into a newly logged-in user's list, then clears the guest bucket. */
export function mergeGuestFavoritesIntoUser(userId: string): string[] {
  const map = readMap()
  const guest = map[GUEST_KEY] ?? []
  const user = map[userId] ?? []
  const merged = Array.from(new Set([...user, ...guest]))
  map[userId] = merged
  map[GUEST_KEY] = []
  writeMap(map)
  return merged
}
