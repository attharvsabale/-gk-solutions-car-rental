import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { deals } from '@/data/deals'
import { Badge } from '@/components/ui/Badge'
import { setPageMeta } from '@/lib/seo'

export default function Deals() {
  useEffect(() => {
    setPageMeta('Deals & Offers | GK Solutions', 'Weekend getaway pricing, weekly and monthly discounts on self-drive rentals in Hinjewadi, Pune.')
  }, [])

  return (
    <div className="container-page py-10">
      <p className="kicker">Limited-time offers</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">Deals &amp; offers</h1>
      <p className="mt-2 max-w-xl text-ink-500">Save more on your next rental with these current promotions.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            to={`/cars${deal.filterQuery}`}
            className="hover-lift group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-ink-100 bg-white p-6 shadow-card"
          >
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 to-brand-300" />
            <Badge variant="brand" className="self-start">{deal.badge}</Badge>
            <h2 className="font-display text-lg font-semibold text-ink-900">{deal.title}</h2>
            <p className="text-sm text-ink-500">{deal.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
              Browse cars
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
