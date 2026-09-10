import { Check } from 'lucide-react'
import type { CarFeature } from '@/types/car'

export function CarFeatures({ features }: { features: CarFeature[] }) {
  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2 text-sm text-ink-700">
          <Check className="h-4 w-4 text-success-500" />
          {feature}
        </li>
      ))}
    </ul>
  )
}
