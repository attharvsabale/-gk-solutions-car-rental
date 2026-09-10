import { LinkButton } from '@/components/ui/LinkButton'

export function FinalCta() {
  return (
    <section className="ink-gradient relative overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="container-page relative flex flex-col items-center gap-7 text-center">
        <p className="kicker text-brand-400">Ready when you are</p>
        <h2 className="max-w-xl text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Your next journey starts here.
        </h2>
        <LinkButton to="/cars" variant="secondary" size="lg">
          Browse cars
        </LinkButton>
      </div>
    </section>
  )
}
