import { useMemo } from 'react'
import { cars } from '@/data/cars'
import { CarCard } from '@/components/cars/CarCard'
import { LinkButton } from '@/components/ui/LinkButton'

export function PopularCars() {
  const popular = useMemo(
    () => [...cars].sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0) || b.rating - a.rating).slice(0, 8),
    [],
  )

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink-950">Popular cars</h2>
          <p className="mt-2 max-w-lg text-ink-500">Handpicked vehicles our customers book again and again.</p>
        </div>
        <LinkButton to="/cars" variant="outline">
          Browse all cars
        </LinkButton>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  )
}
