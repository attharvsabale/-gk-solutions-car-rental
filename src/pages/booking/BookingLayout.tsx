import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useBookingStore } from '@/store/useBookingStore'
import { useCar } from '@/hooks/useCar'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { Skeleton } from '@/components/ui/Skeleton'

export default function BookingLayout() {
  const { draft } = useBookingStore()
  const { car, isLoading } = useCar(draft.carId ?? undefined)
  const location = useLocation()

  if (!draft.carId) {
    return <Navigate to="/cars" replace />
  }

  if (isLoading) {
    return (
      <div className="container-page py-8">
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!car) {
    return <Navigate to="/cars" replace />
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <BookingStepper currentPath={location.pathname} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <Outlet context={{ car, draft }} />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <BookingSummary car={car} draft={draft} />
          </div>
        </div>
      </div>
    </div>
  )
}
