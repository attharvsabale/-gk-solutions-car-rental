/**
 * Deterministic failure/latency simulation toggles for the mock API layer.
 * Flip these from the debug panel (dev-only, gated by VITE_ENABLE_DEBUG) to
 * exercise error/loading states without random flakiness.
 */
export const mockConfig = {
  networkDelayMs: 350,
  simulatePaymentFailure: false,
  simulateApiError: false,
  simulateSlowNetwork: false,
}

export const isDebugEnabled = (): boolean => import.meta.env.VITE_ENABLE_DEBUG === 'true'
