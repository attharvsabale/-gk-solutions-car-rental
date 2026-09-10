import { Quote } from 'lucide-react'
import { reviews } from '@/data/reviews'
import { StarRating } from '@/components/ui/StarRating'
import { formatDisplayDateShort } from '@/lib/date'

export function Reviews() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="text-center">
        <p className="kicker">Real trips, real feedback</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">What renters are saying</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.id} className="hover-lift relative flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
            <Quote className="absolute right-5 top-5 h-8 w-8 text-ink-100" fill="currentColor" strokeWidth={0} />
            <div className="flex items-center gap-3">
              <img src={review.avatar} alt={review.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white ring-offset-2 ring-offset-ink-50" />
              <div>
                <p className="text-sm font-semibold text-ink-900">{review.name}</p>
                <p className="text-xs text-ink-400">{formatDisplayDateShort(review.date)}</p>
              </div>
            </div>
            <StarRating rating={review.rating} />
            <blockquote className="relative text-sm leading-relaxed text-ink-600">{review.review}</blockquote>
            <p className="mt-auto inline-flex w-fit items-center rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-500">
              Rented {review.carRented}
            </p>
          </figure>
        ))}
      </div>
    </section>
  )
}
