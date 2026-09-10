import { Skeleton } from '@/components/ui/Skeleton'

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-3.5">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}
