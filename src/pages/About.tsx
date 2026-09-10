import { useEffect } from 'react'
import { Car, Key, MapPin, ShieldCheck } from 'lucide-react'
import { setPageMeta } from '@/lib/seo'

const stats = [
  { icon: Car, label: 'Vehicles in fleet', value: '4' },
  { icon: MapPin, label: 'Pickup location', value: 'Hinjewadi, Pune' },
  { icon: Key, label: 'Driver required', value: 'None — self-drive' },
  { icon: ShieldCheck, label: 'Fleet range', value: 'Hatchback → Luxury' },
]

export default function About() {
  useEffect(() => {
    setPageMeta('About Us | GK Solutions', 'GK Solutions is a self-drive car rental business run out of Hinjewadi, Pune by proprietor Girish Kadam.')
  }, [])

  return (
    <div>
      <section className="bg-ink-950 py-16 text-white">
        <div className="container-page">
          <p className="kicker text-brand-400">Drive Your Way</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">A small fleet, personally looked after.</h1>
          <p className="mt-4 max-w-2xl text-ink-300">
            GK Solutions is a self-drive car rental business based in Hinjewadi, Pune, run by proprietor
            Girish Kadam. No driver, no chauffeur, no middlemen — just a well-maintained car handed to you
            directly, on terms that work for your trip.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-brand-700" />
              <p className="mt-3 font-display text-xl font-semibold text-ink-950">{stat.value}</p>
              <p className="text-sm text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">Our approach</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Renting a car shouldn't mean hidden charges or a vehicle that looks nothing like the photos.
              Every rate you see here is the rate you pay, and every car in our small fleet is one we've
              personally inspected — not sourced from a marketplace of strangers.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink-900">Quality promise</h2>
            <p className="mt-3 leading-relaxed text-ink-600">
              Every vehicle is inspected and cleaned before it's handed to you, and returned to the same
              standard for the next renter. Flexible daily, weekly, and monthly plans mean you only pay
              for the time you actually need the car.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
