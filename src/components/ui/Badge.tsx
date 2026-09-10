import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeVariant = 'brand' | 'success' | 'warn' | 'danger' | 'neutral' | 'dark'

const variants: Record<BadgeVariant, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-100',
  success: 'bg-success-100 text-success-600 border-success-100',
  warn: 'bg-warn-100 text-warn-600 border-warn-100',
  danger: 'bg-danger-100 text-danger-600 border-danger-100',
  neutral: 'bg-ink-100 text-ink-700 border-ink-100',
  dark: 'bg-ink-950 text-white border-ink-950',
}

export function Badge({ variant = 'neutral', className, children }: { variant?: BadgeVariant; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
