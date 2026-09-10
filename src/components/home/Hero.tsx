import { useMemo } from 'react'
import { SearchWidget } from '@/components/search/SearchWidget'
import { heroImage } from '@/config/images'
import { cars } from '@/data/cars'

export function Hero() {
  const fleetSize = useMemo(() => cars.length, [])

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div className="pointer-events-none absolute inset-0">
        <img src={heroImage} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-transparent" />
      </div>

      <div className="container-page relative flex flex-col items-center pt-20 pb-10 text-center sm:pt-28 sm:pb-14">
        <p className="kicker text-brand-400">Self Drive Car Rental · Hinjewadi, Pune</p>
        <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Premium cars. Your terms.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-200 sm:text-lg">
          No driver needed, affordable rates, and a well-maintained fleet — ready whenever your
          journey is.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-ink-300">
          <span>{fleetSize} vehicles in fleet</span>
          <span className="text-white/20">·</span>
          <span>Hinjewadi, Pune</span>
          <span className="text-white/20">·</span>
          <span>Book via Call / WhatsApp</span>
        </div>

        <div className="mt-10 w-full">
          <SearchWidget variant="hero" />
        </div>
      </div>
    </section>
  )
}
