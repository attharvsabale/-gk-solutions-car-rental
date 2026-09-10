import { useNavigate } from 'react-router-dom'
import { ExtrasSelector } from '@/components/booking/ExtrasSelector'
import { Button } from '@/components/ui/Button'
import { useBookingStore } from '@/store/useBookingStore'
import { formatCurrency } from '@/lib/format'
import { pricingConfig } from '@/config/pricingConfig'
import { cn } from '@/lib/cn'
import { useBookingContext } from './useBookingContext'

export default function Extras() {
  const { car, draft } = useBookingContext()
  const { setExtraQuantity, setInsuranceSelected } = useBookingStore()
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7">
      <h1 className="font-display text-xl font-semibold text-ink-950">Add extras</h1>
      <p className="mt-1 text-sm text-ink-500">Personalize your rental with optional add-ons. Prices are per day.</p>

      {!car.insuranceIncluded && (
        <label
          className={cn(
            'mt-5 flex items-start gap-3 rounded-xl border p-4 transition-colors',
            draft.insuranceSelected ? 'border-brand-200 bg-brand-50/40' : 'border-ink-100 bg-white',
          )}
        >
          <input
            type="checkbox"
            checked={draft.insuranceSelected}
            onChange={(e) => setInsuranceSelected(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-ink-300 accent-brand-500"
          />
          <span>
            <span className="block font-medium text-ink-900">Premium insurance — {formatCurrency(pricingConfig.insuranceFeePerDay)}/day</span>
            <span className="block text-sm text-ink-500">Reduces your security deposit liability to zero on accidental damage.</span>
          </span>
        </label>
      )}

      <div className="mt-5">
        <ExtrasSelector selectedExtras={draft.extras} onQuantityChange={setExtraQuantity} />
      </div>

      <div className="mt-7 flex justify-between border-t border-ink-100 pt-5">
        <Button variant="outline" size="lg" onClick={() => navigate('/booking')}>
          Back
        </Button>
        <Button size="lg" onClick={() => navigate('/booking/customer')}>
          Continue to customer details
        </Button>
      </div>
    </div>
  )
}
