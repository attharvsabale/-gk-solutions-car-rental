import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { promoBanners } from '@/config/images'

const AUTO_ADVANCE_MS = 5000

export function PromoBanner() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % promoBanners.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [])

  const goTo = (next: number) => {
    setIndex((next + promoBanners.length) % promoBanners.length)
  }

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="group relative overflow-hidden rounded-2xl bg-ink-950 shadow-card">
        <div className="relative aspect-[4/3] sm:aspect-[16/7]">
          {promoBanners.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="GK Solutions self-drive car rental promotion"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-900 opacity-0 shadow-card transition-opacity group-hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-ink-900 opacity-0 shadow-card transition-opacity group-hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {promoBanners.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to banner ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-400' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
