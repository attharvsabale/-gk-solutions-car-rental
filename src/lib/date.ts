import { addDays, differenceInCalendarDays, format, isBefore, isValid, parseISO, startOfDay } from 'date-fns'

export const DATE_FORMAT = 'yyyy-MM-dd'

export function todayISO(): string {
  return format(startOfDay(new Date()), DATE_FORMAT)
}

export function toISODate(date: Date): string {
  return format(date, DATE_FORMAT)
}

export function fromISODate(value: string): Date {
  return parseISO(value)
}

export function formatDisplayDate(value: string): string {
  const date = parseISO(value)
  if (!isValid(date)) return value
  return format(date, 'EEE, d MMM yyyy')
}

export function formatDisplayDateShort(value: string): string {
  const date = parseISO(value)
  if (!isValid(date)) return value
  return format(date, 'd MMM yyyy')
}

export function calculateDays(pickupDate: string, dropoffDate: string): number {
  const pickup = parseISO(pickupDate)
  const dropoff = parseISO(dropoffDate)
  const days = differenceInCalendarDays(dropoff, pickup)
  return Math.max(days, 1)
}

export interface DateRangeValidation {
  valid: boolean
  error?: string
}

export function validateDateRange(
  pickupDate: string,
  dropoffDate: string,
): DateRangeValidation {
  const pickup = parseISO(pickupDate)
  const dropoff = parseISO(dropoffDate)

  if (!isValid(pickup) || !pickupDate) {
    return { valid: false, error: 'Pickup date is required.' }
  }
  if (!isValid(dropoff) || !dropoffDate) {
    return { valid: false, error: 'Drop-off date is required.' }
  }
  if (isBefore(pickup, startOfDay(new Date()))) {
    return { valid: false, error: 'Pickup date cannot be in the past.' }
  }
  if (isBefore(dropoff, pickup)) {
    return { valid: false, error: 'Drop-off date cannot be before pickup date.' }
  }
  return { valid: true }
}

export function minDropoffDate(pickupDate: string): string {
  if (!pickupDate) return todayISO()
  return pickupDate
}

export function defaultPickupDate(): string {
  return toISODate(addDays(new Date(), 1))
}

export function defaultDropoffDate(): string {
  return toISODate(addDays(new Date(), 4))
}

export function combineDateAndTime(date: string, time: string): Date {
  return parseISO(`${date}T${time}`)
}

export function hoursUntil(date: string, time: string): number {
  const target = combineDateAndTime(date, time)
  return (target.getTime() - Date.now()) / (1000 * 60 * 60)
}
