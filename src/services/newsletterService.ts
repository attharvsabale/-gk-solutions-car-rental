import { storageKeys, storageService } from '@/lib/storageService'

export function subscribeToNewsletter(email: string): void {
  const subscribers = storageService.get<string[]>(storageKeys.newsletter, [])
  if (!subscribers.includes(email)) {
    storageService.set(storageKeys.newsletter, [...subscribers, email])
  }
}

export function isSubscribed(email: string): boolean {
  return storageService.get<string[]>(storageKeys.newsletter, []).includes(email)
}
