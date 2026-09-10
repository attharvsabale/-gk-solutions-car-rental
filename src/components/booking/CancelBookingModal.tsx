import { useState } from 'react'
import type { Booking } from '@/types/booking'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { calculateRefund } from '@/services/cancellationService'
import { formatCurrency } from '@/lib/format'

interface CancelBookingModalProps {
  booking: Booking | null
  onClose: () => void
  onConfirm: (bookingId: string) => Promise<void>
}

export function CancelBookingModal({ booking, onClose, onConfirm }: CancelBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!booking) return null

  const refund = calculateRefund(booking)

  async function handleConfirm() {
    setIsSubmitting(true)
    await onConfirm(booking!.id)
    setIsSubmitting(false)
  }

  return (
    <Modal
      isOpen={Boolean(booking)}
      onClose={onClose}
      title="Cancel booking"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Keep booking</Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isSubmitting}>
            Confirm cancellation
          </Button>
        </>
      }
    >
      <p className="text-sm text-ink-600">
        You're about to cancel booking <strong>{booking.id}</strong>.
      </p>
      <div className="mt-4 rounded-md bg-ink-50 p-4 text-sm">
        <p className="text-ink-700">{refund.reason}</p>
        <div className="mt-2 flex justify-between font-semibold text-ink-950">
          <span>Refund amount</span>
          <span>{formatCurrency(refund.refundAmount)}</span>
        </div>
      </div>
    </Modal>
  )
}
