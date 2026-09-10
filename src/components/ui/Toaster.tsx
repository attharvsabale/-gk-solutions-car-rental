import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'
import { cn } from '@/lib/cn'

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const styles = {
  success: 'border-success-100 bg-white text-ink-900',
  error: 'border-danger-100 bg-white text-ink-900',
  info: 'border-ink-100 bg-white text-ink-900',
}

const iconColors = {
  success: 'text-success-500',
  error: 'text-danger-500',
  info: 'text-ink-500',
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.variant]
        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'animate-slide-up flex items-start gap-3 rounded-lg border px-4 py-3 shadow-panel',
              styles[toast.variant],
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconColors[toast.variant])} aria-hidden="true" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
