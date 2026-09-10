import { mockConfig } from '@/config/debugConfig'

export function delay(ms?: number): Promise<void> {
  const base = ms ?? mockConfig.networkDelayMs
  const duration = mockConfig.simulateSlowNetwork ? base * 6 : base
  return new Promise((resolve) => setTimeout(resolve, duration))
}
