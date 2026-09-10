import { CalendarClock, IndianRupee, Key, ShieldCheck } from 'lucide-react'

const items = [
  { icon: Key, title: 'No driver needed', description: 'Full control of the wheel — just you, the car, and the road.' },
  { icon: IndianRupee, title: 'Affordable rates', description: 'Self-drive pricing that keeps every trip within budget.' },
  { icon: CalendarClock, title: 'Flexible rental plans', description: 'Rent by the day, the week, or the month — your call.' },
  { icon: ShieldCheck, title: 'Well-maintained & clean cars', description: 'Every vehicle is inspected and cleaned before it reaches you.' },
]

export function WhyChooseUs() {
  return (
    <section className="bg-ink-50/60 py-16 sm:py-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="kicker">Why GK Solutions</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-ink-950 sm:text-4xl">
            Drive your way. No compromises.
          </h2>
          <p className="mt-4 max-w-sm text-ink-500">
            We keep self-drive rental simple — no chauffeur, no surprise charges, and a fleet that's
            genuinely looked after between every trip.
          </p>
          <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50/60 p-5">
            <p className="font-display text-lg font-semibold text-ink-950">"Plans change. Your booking should too."</p>
            <p className="mt-1.5 text-sm text-ink-500">Free cancellation up to 48 hours before pickup, no questions asked.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 border-t border-ink-200/70 py-6 pr-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
            >
              <item.icon className="h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.75} />
              <div>
                <h3 className="text-base font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
