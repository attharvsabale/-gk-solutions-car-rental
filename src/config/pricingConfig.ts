/**
 * Centralized pricing configuration. Never scatter tax/fee percentages
 * through components — read them from here so a future backend can
 * override these via a single config endpoint.
 */
export const pricingConfig = {
  taxRate: 0.18,
  serviceFeeRate: 0.05,
  insuranceFeePerDay: 700,
} as const
