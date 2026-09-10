import { CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react'
import type { PaymentMethod } from '@/types/payment'
import { cn } from '@/lib/cn'

const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
]

export function PaymentMethodTabs({ value, onChange }: { value: PaymentMethod; onChange: (method: PaymentMethod) => void }) {
  return (
    <div role="tablist" aria-label="Payment method" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {methods.map((method) => (
        <button
          key={method.id}
          role="tab"
          aria-selected={value === method.id}
          onClick={() => onChange(method.id)}
          className={cn(
            'flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5 text-sm font-medium transition-all',
            value === method.id
              ? 'border-ink-950 bg-ink-950 text-white shadow-card'
              : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
          )}
        >
          <method.icon className="h-5 w-5" />
          {method.label}
        </button>
      ))}
    </div>
  )
}
