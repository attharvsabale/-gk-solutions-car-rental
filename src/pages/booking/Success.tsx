import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Download } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { useCar } from '@/hooks/useCar'
import { useLocations } from '@/hooks/useLocations'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { Button } from '@/components/ui/Button'
import { LinkButton } from '@/components/ui/LinkButton'
import { setPageMeta } from '@/lib/seo'
import { BookingReceipt } from '@/components/booking/BookingReceipt'
import { useBookingStore } from '@/store/useBookingStore'

export default function Success() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const { booking, isLoading, error } = useBooking(bookingId)
  const { car } = useCar(booking?.carId)
  const { locations } = useLocations()
  const receiptRef = useRef<HTMLDivElement>(null)
  const reset = useBookingStore((state) => state.reset)

  useEffect(() => {
    setPageMeta('Booking Confirmed | GK Solutions', 'Your car rental booking has been confirmed.')
    // Clear the booking draft now that the flow that depended on it has finished —
    // clearing it earlier (e.g. in the payment step before navigating here) raced
    // with BookingLayout's "no active draft" redirect guard.
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDownload() {
    const content = receiptRef.current
    if (!content) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(`
      <html>
        <head><title>Booking Receipt ${bookingId}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 32px; color: #12161d; }
          h1 { font-size: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          td { padding: 6px 0; font-size: 14px; }
          .label { color: #5c6779; }
          .total { font-weight: 700; font-size: 16px; border-top: 1px solid #ccd1d9; padding-top: 10px; }
        </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (isLoading) {
    return (
      <div className="container-page py-16">
        <Skeleton className="mx-auto h-96 w-full max-w-lg" />
      </div>
    )
  }

  if (error || !booking || !car) {
    return (
      <div className="container-page py-16">
        <ErrorState title="Booking not found" message="We couldn't find this booking. It may have expired or the link is incorrect." />
      </div>
    )
  }

  const pickupLocation = locations.find((l) => l.id === booking.pickupLocationId)
  const dropoffLocation = locations.find((l) => l.id === booking.dropoffLocationId)

  return (
    <div className="container-page flex flex-col items-center py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
        <CheckCircle2 className="h-8 w-8 text-success-500" />
      </div>
      <h1 className="mt-4 text-center font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
        Booking confirmed!
      </h1>
      <p className="mt-2 max-w-md text-center text-ink-500">
        A confirmation has been recorded for your rental. Present your booking ID and license at pickup.
      </p>

      <div className="mt-8 w-full max-w-lg rounded-lg border border-ink-100 bg-white p-6 shadow-panel">
        <div ref={receiptRef}>
          <BookingReceipt booking={booking} car={car} pickupLocationName={pickupLocation?.name} dropoffLocationName={dropoffLocation?.name} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4" /> Download receipt
        </Button>
        <LinkButton to={`/account/bookings/${booking.id}`}>View booking</LinkButton>
        <LinkButton to="/" variant="ghost">Back to home</LinkButton>
      </div>
    </div>
  )
}
