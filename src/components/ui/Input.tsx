import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'h-11 w-full rounded-lg border border-ink-200 bg-ink-50/60 px-3.5 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-[border-color,box-shadow,background-color] duration-150',
            'hover:border-ink-300',
            'focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12',
            error && 'border-danger-500 bg-white focus:border-danger-500 focus:ring-danger-500/12',
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs font-medium text-danger-600">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-ink-500">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
