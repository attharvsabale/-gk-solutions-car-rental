import { Star } from 'lucide-react'

export function StarRating({ rating, reviewCount, size = 14 }: { rating: number; reviewCount?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-800">
      <Star size={size} className="fill-brand-700 text-brand-700" aria-hidden="true" />
      <span>{rating.toFixed(1)}</span>
      {typeof reviewCount === 'number' && <span className="text-ink-400">({reviewCount})</span>}
    </span>
  )
}
