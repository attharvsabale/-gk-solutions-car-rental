const steps = [
  { number: '01', title: 'Choose your car', description: 'Browse our fleet and filter by type, budget, and location.' },
  { number: '02', title: 'Select dates', description: 'Pick your pickup and drop-off dates, times, and locations.' },
  { number: '03', title: 'Customize your rental', description: 'Add extras like child seats, GPS, or premium insurance.' },
  { number: '04', title: 'Confirm & drive', description: 'Pay securely and receive instant confirmation. Enjoy the ride.' },
]

export function HowItWorks() {
  return (
    <section className="container-page py-16 sm:py-20">
      <h2 className="text-center font-display text-3xl font-semibold text-ink-950">How it works</h2>
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div key={step.number} className="relative">
            <span className="font-display text-4xl font-semibold text-ink-100">{step.number}</span>
            <h3 className="mt-2 text-base font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
