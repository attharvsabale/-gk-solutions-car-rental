import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  onGoHome?: () => void
}

export function ErrorState({
  title = 'Something went wrong.',
  message = 'We ran into an unexpected issue. Please try again.',
  onRetry,
  onGoHome,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger-100 bg-gradient-to-b from-danger-100/40 to-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card ring-1 ring-inset ring-danger-100">
        <AlertTriangle className="h-6 w-6 text-danger-500" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">{message}</p>
      </div>
      <div className="mt-1 flex gap-3">
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" size="sm" onClick={onGoHome}>
            Go home
          </Button>
        )}
      </div>
    </div>
  )
}
