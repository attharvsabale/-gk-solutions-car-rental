import { Link } from 'react-router-dom'
import { ArrowRight, Fuel, Gauge, Heart, Users } from 'lucide-react'
import type { Car } from '@/types/car'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/LinkButton'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/cn'

export function CarCard({ car }: { car: Car }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(car.id)

  return (
    <div className="hover-lift group flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
        <Link to={`/cars/${car.id}`} aria-label={`View ${car.brand} ${car.model} details`}>
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model} ${car.variant}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-950/55 to-transparent" />
        </Link>

        {car.badge && (
          <Badge variant={car.badge === 'Electric' ? 'success' : 'dark'} className="absolute left-3 top-3 shadow-sm">
            {car.badge}
          </Badge>
        )}

        <button
          onClick={() => toggleFavorite(car.id)}
          aria-pressed={favorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink-600 shadow-card transition-transform hover:scale-110 hover:text-danger-500"
        >
          <Heart className={cn('h-4 w-4', favorite && 'fill-danger-500 text-danger-500')} />
        </button>

        <div className="absolute bottom-2.5 left-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-ink-900 shadow-sm">
          <span className="text-brand-700">★</span>
          {car.rating.toFixed(1)}
          <span className="font-normal text-ink-400">({car.reviewCount})</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{car.category}</p>
          <Link
            to={`/cars/${car.id}`}
            className="mt-0.5 block font-display text-lg font-semibold leading-tight text-ink-950 group-hover:text-brand-700"
          >
            {car.brand} {car.model}
          </Link>
          <p className="text-sm text-ink-500">{car.variant} · {car.year}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-ink-500">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-ink-400" /> {car.seats} seats</span>
          <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5 text-ink-400" /> {car.transmission}</span>
          <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5 text-ink-400" /> {car.fuelType}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink-100 pt-3.5">
          <div>
            <p className="font-display text-base font-bold leading-none text-ink-950">Contact us for price</p>
            <p className="mt-1 text-xs text-ink-400">free cancellation</p>
          </div>
          <LinkButton to={`/cars/${car.id}`} variant="primary" size="sm" className="shrink-0">
            View details
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </div>
    </div>
  )
}
