import { businessRules } from '@/config/businessRules'

function randomSegment(length: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function generateBookingId(): string {
  const year = new Date().getFullYear()
  return `${businessRules.bookingIdPrefix}-${year}-${randomSegment(6)}`
}

export function generateTransactionId(): string {
  return `${businessRules.transactionIdPrefix}-${randomSegment(8)}`
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomSegment(10).toLowerCase()}`
}
