import { Baby, LifeBuoy, MapPin, ShieldCheck, UserPlus, Wifi } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { extras } from '@/data/extras'
import type { SelectedExtra } from '@/types/extras'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/cn'

const iconMap: Record<string, LucideIcon> = {
  Baby,
  UserPlus,
  MapPin,
  ShieldCheck,
  LifeBuoy,
  Wifi,
}

interface ExtrasSelectorProps {
  selectedExtras: SelectedExtra[]
  onQuantityChange: (extraId: string, quantity: number) => void
}

export function ExtrasSelector({ selectedExtras, onQuantityChange }: ExtrasSelectorProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {extras.map((extra) => {
        const Icon = iconMap[extra.icon] ?? ShieldCheck
        const quantity = selectedExtras.find((s) => s.extraId === extra.id)?.quantity ?? 0
        const isSelected = quantity > 0

        return (
          <div
            key={extra.id}
            className={cn(
              'flex items-center gap-4 rounded-xl border p-4 transition-colors',
              isSelected ? 'border-brand-200 bg-brand-50/40' : 'border-ink-100 bg-white',
            )}
          >
            <Icon className={cn('h-5 w-5 shrink-0', isSelected ? 'text-brand-600' : 'text-ink-400')} strokeWidth={1.75} />
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium text-ink-900">{extra.name}</p>
                <p className="whitespace-nowrap text-sm font-semibold text-ink-800">{formatCurrency(extra.pricePerDay)}<span className="font-normal text-ink-400">/day</span></p>
              </div>
              <p className="mt-0.5 text-sm text-ink-500">{extra.description}</p>
            </div>
            <QuantityStepper quantity={quantity} onChange={(q) => onQuantityChange(extra.id, q)} label={extra.name} />
          </div>
        )
      })}
    </div>
  )
}
