import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-[13px] font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          className={cn(
            'min-h-28 w-full rounded-lg border border-ink-200 bg-ink-50/60 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400',
            'transition-[border-color,box-shadow,background-color] duration-150 hover:border-ink-300',
            'focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12',
            error && 'border-danger-500 bg-white focus:border-danger-500 focus:ring-danger-500/12',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-danger-600">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
