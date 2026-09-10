import { cn } from '@/lib/cn'

const steps = [
  { path: '/booking', label: 'Rental details' },
  { path: '/booking/extras', label: 'Extras' },
  { path: '/booking/customer', label: 'Customer' },
  { path: '/booking/review', label: 'Review' },
  { path: '/booking/payment', label: 'Payment' },
]

export function BookingStepper({ currentPath }: { currentPath: string }) {
  const currentIndex = Math.max(steps.findIndex((step) => step.path === currentPath), 0)

  return (
    <div aria-label="Booking progress">
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={steps.length}>
        {steps.map((step, index) => (
          <div
            key={step.path}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              index <= currentIndex ? 'bg-brand-500' : 'bg-ink-100',
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="font-display text-base font-semibold text-ink-950">{steps[currentIndex].label}</p>
        <p className="text-xs font-medium text-ink-400">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}
