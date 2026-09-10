import { Briefcase, Building2, Plane, Tent } from 'lucide-react'

const journeys = [
  { icon: Building2, label: 'City drives' },
  { icon: Tent, label: 'Weekend getaways' },
  { icon: Plane, label: 'Outstation trips' },
  { icon: Briefcase, label: 'Business travel' },
]

export function JourneyTypes() {
  return (
    <section className="bg-ink-50/60 py-14 sm:py-16">
      <div className="container-page">
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="kicker">Same roads, different stories</p>
          <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">Ready for every journey</h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {journeys.map((journey) => (
            <div
              key={journey.label}
              className="flex flex-col items-center gap-3 rounded-xl border border-ink-200 bg-white py-6 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink-950">
                <journey.icon className="h-5 w-5 text-ink-950" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-semibold text-ink-800">{journey.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
