import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-ink-100 bg-gradient-to-b from-ink-50/80 to-white px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-inset ring-brand-100">
        <Icon className="h-6 w-6 text-brand-600" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
        {description && <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
