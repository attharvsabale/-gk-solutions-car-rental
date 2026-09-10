import { Briefcase, Fuel, Gauge, ShoppingBag, User, Users } from 'lucide-react'
import type { Car } from '@/types/car'

export function CarSpecs({ car }: { car: Car }) {
  const specs = [
    { icon: Users, label: `${car.seats} seats` },
    { icon: Gauge, label: car.transmission },
    { icon: Fuel, label: car.fuelType },
    { icon: User, label: `${car.doors} doors` },
    { icon: Briefcase, label: `${car.largeBags} large bags` },
    { icon: ShoppingBag, label: `${car.smallBags} small bags` },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-2 rounded-md border border-ink-100 px-3 py-2.5 text-sm text-ink-700">
          <spec.icon className="h-4 w-4 text-ink-400" />
          {spec.label}
        </div>
      ))}
    </div>
  )
}
