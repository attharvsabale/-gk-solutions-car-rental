import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-[-0.01em] whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-950 text-white shadow-[0_1px_0_0_rgb(255_255_255_/_0.06)_inset,0_6px_16px_-6px_rgb(10_13_18_/_0.45)] hover:bg-ink-800 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_rgb(10_13_18_/_0.5)] active:bg-ink-900',
  secondary:
    'bg-brand-500 text-ink-950 shadow-glow hover:bg-brand-400 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgb(202_138_4_/_0.5)] active:bg-brand-600',
  outline:
    'border border-ink-200 bg-white text-ink-900 hover:border-ink-400 hover:bg-ink-50 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0',
  ghost: 'text-ink-700 hover:bg-ink-100/70',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 hover:-translate-y-0.5 active:translate-y-0',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-8 text-base',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}
