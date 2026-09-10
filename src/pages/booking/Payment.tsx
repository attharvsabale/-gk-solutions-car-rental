import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PaymentMethodTabs } from '@/components/booking/PaymentMethodTabs'
import { CardPaymentForm } from '@/components/booking/CardPaymentForm'
import { useBookingStore } from '@/store/useBookingStore'
import { bookingsApi, paymentsApi } from '@/services/api'
import { calculateRentalPrice } from '@/services/pricingService'
import { formatCurrency } from '@/lib/format'
import { useToastStore } from '@/store/useToastStore'
import type { PaymentMethod } from '@/types/payment'
import type { CardPaymentFormValues } from '@/lib/validation'
import { useBookingContext } from './useBookingContext'

const CARD_FORM_ID = 'card-payment-form'

export default function Payment() {
  const { car, draft } = useBookingContext()
  const { pendingBookingId, reset } = useBookingStore()
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)

  const [method, setMethod] = useState<PaymentMethod>('card')
  const [status, setStatus] = useState<'idle' | 'processing' | 'failed'>('idle')
  const [failureReason, setFailureReason] = useState<string | null>(null)
  const [upiId, setUpiId] = useState('')

  const pricing = useMemo(
    () =>
      calculateRentalPrice({
        car,
        pickupDate: draft.pickupDate,
        dropoffDate: draft.dropoffDate,
        extras: draft.extras,
        insuranceSelected: draft.insuranceSelected,
        pickupLocationId: draft.pickupLocationId,
        dropoffLocationId: draft.dropoffLocationId,
      }),
    [car, draft],
  )

  if (!pendingBookingId) {
    return <Navigate to="/booking/review" replace />
  }

  async function submitPayment(card?: CardPaymentFormValues) {
    setStatus('processing')
    setFailureReason(null)

    const result = await paymentsApi.processPayment({
      bookingId: pendingBookingId!,
      amount: pricing.total,
      method,
      card: card
        ? { cardNumber: card.cardNumber, cardHolderName: card.cardHolderName, expiry: card.expiry, cvv: card.cvv }
        : undefined,
      upiId: method === 'upi' ? upiId : undefined,
    })

    if (!result.success) {
      setStatus('failed')
      setFailureReason(result.error.message)
      return
    }

    const payment = result.data

    if (payment.status !== 'success') {
      setStatus('failed')
      setFailureReason(payment.failureReason ?? 'Payment could not be completed.')
      await bookingsApi.updateBooking(pendingBookingId!, { paymentStatus: 'failed', bookingStatus: 'failed' })
      return
    }

    await bookingsApi.updateBooking(pendingBookingId!, {
      paymentMethod: method,
      paymentStatus: 'success',
      transactionId: payment.transactionId,
      bookingStatus: 'confirmed',
    })

    showToast('Payment successful', 'success')
    navigate(`/booking/success/${pendingBookingId}`)
  }

  function handleNonCardSubmit() {
    if (method === 'upi' && !upiId.includes('@')) {
      showToast('Enter a valid UPI ID (e.g. name@bank).', 'error')
      return
    }
    submitPayment()
  }

  async function handleCancelBooking() {
    await bookingsApi.cancelBooking(pendingBookingId!)
    reset()
    navigate('/cars')
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7">
      <h1 className="font-display text-xl font-semibold text-ink-950">Payment</h1>
      <p className="mt-1 text-sm text-ink-500">Simulated payment — no real transaction will be made.</p>

      <div className="mt-6">
        <PaymentMethodTabs value={method} onChange={setMethod} />
      </div>

      <div className="mt-6">
        {method === 'card' && <CardPaymentForm formId={CARD_FORM_ID} onSubmit={(values) => submitPayment(values)} />}

        {method === 'upi' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="upi-id" className="text-[13px] font-medium text-ink-700">UPI ID</label>
            <input
              id="upi-id"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="name@bank"
              className="h-11 w-full rounded-lg border border-ink-200 bg-ink-50/60 px-3.5 text-sm transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12"
            />
          </div>
        )}

        {method === 'netbanking' && (
          <p className="rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-sm text-ink-600">
            You'll be redirected to your bank's net banking portal in a real integration. Click pay to simulate this.
          </p>
        )}

        {method === 'wallet' && (
          <p className="rounded-xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-sm text-ink-600">
            You'll be redirected to your wallet provider in a real integration. Click pay to simulate this.
          </p>
        )}
      </div>

      {status === 'failed' && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-danger-100 bg-danger-100/30 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-danger-600">
            <AlertCircle className="h-4 w-4" /> {failureReason ?? 'Payment could not be completed.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" onClick={() => setStatus('idle')}>Try again</Button>
            <Button size="sm" variant="outline" onClick={() => setMethod('upi')}>Change payment method</Button>
            <Button size="sm" variant="danger" onClick={handleCancelBooking}>Cancel booking</Button>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col-reverse items-center gap-4 border-t border-ink-100 pt-5 sm:flex-row sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-ink-400">
          <ShieldCheck className="h-4 w-4" /> Payments are simulated for this demo. No card data leaves your browser.
        </p>
        {method === 'card' ? (
          <Button type="submit" form={CARD_FORM_ID} variant="secondary" size="lg" className="w-full sm:w-auto" isLoading={status === 'processing'}>
            Pay {formatCurrency(pricing.total)}
          </Button>
        ) : (
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" isLoading={status === 'processing'} onClick={handleNonCardSubmit}>
            Pay {formatCurrency(pricing.total)}
          </Button>
        )}
      </div>
    </div>
  )
}
