import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  quantity: number
  onChange: (quantity: number) => void
  max?: number
  label: string
}

export function QuantityStepper({ quantity, onChange, max = 4, label }: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={`${label} quantity`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        disabled={quantity <= 0}
        aria-label={`Decrease ${label} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-5 text-center text-sm font-semibold text-ink-900" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label={`Increase ${label} quantity`}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-200 text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
