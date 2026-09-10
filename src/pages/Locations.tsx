import { useEffect } from 'react'
import { AtSign, Clock, MapPin, MessageCircle, Phone, ThumbsUp } from 'lucide-react'
import { locations } from '@/data/locations'
import { cars } from '@/data/cars'
import { LinkButton } from '@/components/ui/LinkButton'
import { Button } from '@/components/ui/Button'
import { setPageMeta } from '@/lib/seo'

export default function Locations() {
  useEffect(() => {
    setPageMeta('Pickup Location | GK Solutions', 'Self-drive car rental pickup in Hinjewadi, Pune — Chevrolet Spark, Beat, Toyota Hyryder and BMW X3 available.')
  }, [])

  const location = locations[0]
  const phoneDigits = location.phone.replace(/\D/g, '')

  return (
    <div className="container-page py-10">
      <p className="kicker">Where we operate</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950 sm:text-4xl">Our pickup location</h1>
      <p className="mt-2 max-w-xl text-ink-500">
        GK Solutions operates out of a single, convenient pickup point in Hinjewadi, Pune — every rental
        starts and ends here.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-ink-100 shadow-card lg:grid-cols-[1.1fr_1fr]">
        <div
          className="relative flex min-h-[280px] items-center justify-center bg-ink-50"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-ink-200) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ink-50" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-ink-950 shadow-[0_8px_20px_-4px_rgb(202_138_4_/_0.5)]">
            <MapPin className="h-7 w-7" fill="currentColor" strokeWidth={0} />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <p className="font-display text-xl font-semibold text-ink-950">{location.name}</p>
            <p className="mt-1 text-sm text-ink-500">{location.address}</p>
          </div>

          <div className="flex flex-col gap-2.5 text-sm text-ink-600">
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-ink-400" /> {location.openingHours}</span>
            <a href={`tel:+91${phoneDigits}`} className="flex items-center gap-2 hover:text-brand-700">
              <Phone className="h-4 w-4 text-ink-400" /> {location.phone}
            </a>
            <div className="flex items-center gap-4 pt-1">
              <a href="https://instagram.com/gksolutions_pune" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-ink-500 hover:text-brand-700">
                <AtSign className="h-4 w-4" /> @gksolutions_pune
              </a>
              <a href="#" className="flex items-center gap-1.5 text-ink-500 hover:text-brand-700">
                <ThumbsUp className="h-4 w-4" /> GK Solutions
              </a>
            </div>
          </div>

          <p className="rounded-lg bg-ink-50/70 px-3.5 py-2.5 text-xs text-ink-400">
            {cars.length} vehicles available for pickup here — Chevrolet Spark, Chevrolet Beat, Toyota
            Hyryder and BMW X3.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href={`https://wa.me/91${phoneDigits}`} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </Button>
            </a>
            <LinkButton to="/cars" variant="outline">
              View our fleet
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  )
}
