import type { BookingStatus } from '@/types/booking'
import type { BadgeVariant } from '@/components/ui/Badge'

export const bookingStatusMeta: Record<BookingStatus, { label: string; variant: BadgeVariant }> = {
  draft: { label: 'Draft', variant: 'neutral' },
  pending: { label: 'Pending payment', variant: 'warn' },
  confirmed: { label: 'Confirmed', variant: 'success' },
  active: { label: 'Active', variant: 'brand' },
  completed: { label: 'Completed', variant: 'neutral' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  failed: { label: 'Failed', variant: 'danger' },
}
