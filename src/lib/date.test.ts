import { addDays } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { calculateDays, toISODate, validateDateRange } from './date'

describe('calculateDays', () => {
  it('counts calendar days between pickup and drop-off', () => {
    expect(calculateDays('2026-01-01', '2026-01-04')).toBe(3)
  })

  it('never returns less than 1 day, even for a same-day booking', () => {
    expect(calculateDays('2026-01-01', '2026-01-01')).toBe(1)
  })
})

describe('validateDateRange', () => {
  const tomorrow = toISODate(addDays(new Date(), 1))
  const dayAfter = toISODate(addDays(new Date(), 2))
  const yesterday = toISODate(addDays(new Date(), -1))

  it('accepts a valid future range', () => {
    expect(validateDateRange(tomorrow, dayAfter)).toEqual({ valid: true })
  })

  it('rejects a pickup date in the past', () => {
    const result = validateDateRange(yesterday, tomorrow)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/past/i)
  })

  it('rejects a drop-off date before the pickup date', () => {
    const result = validateDateRange(dayAfter, tomorrow)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/before pickup/i)
  })

  it('rejects a missing pickup date', () => {
    const result = validateDateRange('', tomorrow)
    expect(result.valid).toBe(false)
  })

  it('rejects a missing drop-off date', () => {
    const result = validateDateRange(tomorrow, '')
    expect(result.valid).toBe(false)
  })
})
