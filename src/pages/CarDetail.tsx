import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useCar } from '@/hooks/useCar'
import { useLocations } from '@/hooks/useLocations'
import { CarGallery } from '@/components/cars/CarGallery'
import { CarSpecs } from '@/components/cars/CarSpecs'
import { CarFeatures } from '@/components/cars/CarFeatures'
import { RentalPolicy } from '@/components/cars/RentalPolicy'
import { CarBookingPanel } from '@/components/cars/CarBookingPanel'
import { StarRating } from '@/components/ui/StarRating'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { LinkButton } from '@/components/ui/LinkButton'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { setPageMeta } from '@/lib/seo'

export default function CarDetail() {
  const { carId } = useParams<{ carId: string }>()
  const { car, isLoading, error, notFound } = useCar(carId)
  const { locations } = useLocations()
  const [searchParams] = useSearchParams()
  const [isMobileBookingOpen, setIsMobileBookingOpen] = useState(searchParams.get('book') === 'true')

  useEffect(() => {
    if (car) {
      setPageMeta(
        `${car.brand} ${car.model} Self-Drive Rental | GK Solutions`,
        `Rent the ${car.year} ${car.brand} ${car.model} ${car.variant} self-drive in Hinjewadi, Pune. Contact us for pricing.`,
      )
    }
  }, [car])

  if (isLoading) {
    return (
      <div className="container-page py-8">
        <Skeleton className="h-6 w-64" />
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <Skeleton className="aspect-[16/10] w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorState message={error} />
      </div>
    )
  }

  if (notFound || !car) {
    return (
      <div className="container-page py-16">
        <ErrorState
          title="Vehicle no longer available"
          message="This vehicle may have been removed from our fleet. Browse similar cars instead."
        />
        <div className="mt-4 flex justify-center">
          <LinkButton to="/cars">Browse cars</LinkButton>
        </div>
      </div>
    )
  }

  const location = locations.find((l) => l.id === car.locationId)

  return (
    <div className="container-page py-6 pb-28 lg:pb-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-ink-500">
        <Link to="/" className="hover:text-ink-800">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/cars" className="hover:text-ink-800">Cars</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-800">{car.brand} {car.model}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <CarGallery images={car.images} carId={car.id} name={`${car.brand} ${car.model}`} />

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
                  {car.brand} {car.model}
                </h1>
                <p className="text-ink-500">{car.variant} · {car.year}</p>
              </div>
              <StarRating rating={car.rating} reviewCount={car.reviewCount} size={16} />
            </div>
            {location && <p className="mt-2 text-sm text-ink-500">Available in {location.city} — {location.name}</p>}
          </div>

          <Section title="Specifications">
            <CarSpecs car={car} />
          </Section>

          <Section title="Description">
            <p className="text-sm leading-relaxed text-ink-600">{car.description}</p>
          </Section>

          <Section title="Features">
            <CarFeatures features={car.features} />
          </Section>

          <Section title="Rental policy">
            <RentalPolicy car={car} />
          </Section>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <CarBookingPanel car={car} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-ink-100 bg-white px-4 py-3 shadow-panel lg:hidden">
        <div>
          <p className="font-display text-base font-bold text-ink-950">Contact us for price</p>
        </div>
        <Button size="md" onClick={() => setIsMobileBookingOpen(true)}>
          Reserve
        </Button>
      </div>

      <Drawer isOpen={isMobileBookingOpen} onClose={() => setIsMobileBookingOpen(false)} title="Reserve this car" side="bottom">
        <CarBookingPanel car={car} />
      </Drawer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8 border-t border-ink-100 pt-6">
      <h2 className="mb-4 text-lg font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  )
}
