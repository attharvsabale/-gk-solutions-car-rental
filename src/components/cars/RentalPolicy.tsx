import type { Car } from '@/types/car'
import { formatCurrency } from '@/lib/format'

export function RentalPolicy({ car }: { car: Car }) {
  const rows = [
    { label: 'Minimum driver age', value: `${car.minimumDriverAge} years` },
    { label: 'Driving license', value: 'Valid license held for 1+ year' },
    { label: 'Security deposit', value: formatCurrency(car.deposit) },
    { label: 'Fuel policy', value: 'Full-to-full — return with a full tank' },
    { label: 'Mileage policy', value: `${car.mileageLimitPerDay} km/day included` },
    {
      label: 'Cancellation policy',
      value: `Full refund up to ${car.cancellationPolicy.fullRefundHours}h before pickup, ${car.cancellationPolicy.partialRefundPercent}% refund up to ${car.cancellationPolicy.partialRefundHours}h before.`,
    },
  ]

  return (
    <dl className="divide-y divide-ink-100 rounded-lg border border-ink-100">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <dt className="text-sm font-medium text-ink-500">{row.label}</dt>
          <dd className="text-sm text-ink-800 sm:text-right">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
