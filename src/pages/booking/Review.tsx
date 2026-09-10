import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useBookingStore } from '@/store/useBookingStore'
import { useAuth } from '@/hooks/useAuth'
import { useLocations } from '@/hooks/useLocations'
import { bookingsApi } from '@/services/api'
import { calculateRentalPrice } from '@/services/pricingService'
import { formatDisplayDate } from '@/lib/date'
import { formatPhoneNumber } from '@/lib/format'
import { useToastStore } from '@/store/useToastStore'
import { useBookingContext } from './useBookingContext'
import type { CustomerDetails } from '@/types/user'

export default function Review() {
  const { car, draft } = useBookingContext()
  const { setPendingBookingId } = useBookingStore()
  const { user } = useAuth()
  const { locations } = useLocations()
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const customer = draft.customer as CustomerDetails
  const pickupLocation = locations.find((l) => l.id === draft.pickupLocationId)
  const dropoffLocation = locations.find((l) => l.id === draft.dropoffLocationId)

  async function handleConfirm() {
    setIsSubmitting(true)
    setError(null)

    const pricing = calculateRentalPrice({
      car,
      pickupDate: draft.pickupDate,
      dropoffDate: draft.dropoffDate,
      extras: draft.extras,
      insuranceSelected: draft.insuranceSelected,
      pickupLocationId: draft.pickupLocationId,
      dropoffLocationId: draft.dropoffLocationId,
    })

    const result = await bookingsApi.createBooking(
      {
        carId: car.id,
        pickupLocationId: draft.pickupLocationId,
        dropoffLocationId: draft.dropoffLocationId,
        pickupDate: draft.pickupDate,
        pickupTime: draft.pickupTime,
        dropoffDate: draft.dropoffDate,
        dropoffTime: draft.dropoffTime,
        extras: draft.extras,
        insuranceSelected: draft.insuranceSelected,
        customer,
        pricing,
      },
      user?.id ?? null,
    )

    setIsSubmitting(false)

    if (!result.success) {
      setError(result.error.message)
      showToast(result.error.message, 'error')
      return
    }

    setPendingBookingId(result.data.id)
    navigate('/booking/payment')
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7">
      <h1 className="font-display text-xl font-semibold text-ink-950">Review your booking</h1>
      <p className="mt-1 text-sm text-ink-500">Check every detail before proceeding to payment.</p>

      <ReviewSection title="Rental details" onEdit={() => navigate('/booking')}>
        <p>{car.brand} {car.model} {car.variant}</p>
        <p>Pickup: {formatDisplayDate(draft.pickupDate)} at {draft.pickupTime} · {pickupLocation?.name}</p>
        <p>Drop-off: {formatDisplayDate(draft.dropoffDate)} at {draft.dropoffTime} · {dropoffLocation?.name}</p>
      </ReviewSection>

      <ReviewSection title="Extras" onEdit={() => navigate('/booking/extras')}>
        {draft.extras.length === 0 && !draft.insuranceSelected ? (
          <p className="text-ink-400">No extras selected.</p>
        ) : (
          <p>{draft.extras.length} extra{draft.extras.length === 1 ? '' : 's'} selected{draft.insuranceSelected ? ', plus premium insurance' : ''}.</p>
        )}
      </ReviewSection>

      <ReviewSection title="Customer" onEdit={() => navigate('/booking/customer')}>
        <p>{customer?.firstName} {customer?.lastName}</p>
        <p>{customer?.email} · {formatPhoneNumber(customer?.phone ?? '')}</p>
        <p>License: {customer?.drivingLicenseNumber}</p>
      </ReviewSection>

      {error && <p className="mt-4 text-sm font-medium text-danger-600">{error}</p>}

      <div className="mt-7 flex justify-between border-t border-ink-100 pt-5">
        <Button variant="outline" size="lg" onClick={() => navigate('/booking/customer')}>
          Back
        </Button>
        <Button size="lg" onClick={handleConfirm} isLoading={isSubmitting}>
          Continue to payment
        </Button>
      </div>
    </div>
  )
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="mt-5 rounded-xl border border-ink-100 bg-ink-50/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-ink-900">
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      <div className="mt-2 space-y-1 text-sm text-ink-600">{children}</div>
    </div>
  )
}
