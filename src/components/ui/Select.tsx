import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-[13px] font-medium text-ink-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            className={cn(
              'h-11 w-full cursor-pointer appearance-none rounded-lg border border-ink-200 bg-white px-3.5 pr-9 text-sm font-medium text-ink-900',
              'transition-[border-color,box-shadow] duration-150 hover:border-ink-300',
              'focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/12',
              error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/12',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
        </div>
        {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
