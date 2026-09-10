import { useEffect } from 'react'
import { Hero } from '@/components/home/Hero'
import { PromoBanner } from '@/components/home/PromoBanner'
import { PopularCars } from '@/components/home/PopularCars'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { HowItWorks } from '@/components/home/HowItWorks'
import { JourneyTypes } from '@/components/home/JourneyTypes'
import { Reviews } from '@/components/home/Reviews'
import { FinalCta } from '@/components/home/FinalCta'
import { setPageMeta } from '@/lib/seo'

export default function Home() {
  useEffect(() => {
    setPageMeta(
      'GK Solutions | Self Drive Car Rental in Hinjewadi, Pune',
      'Premium self-drive car rentals in Hinjewadi, Pune. No driver needed, affordable rates, flexible plans. Spark, Beat, Hyryder and BMW X3 available now.',
    )
  }, [])

  return (
    <div>
      <Hero />
      <PromoBanner />
      <PopularCars />
      <WhyChooseUs />
      <HowItWorks />
      <JourneyTypes />
      <Reviews />
      <FinalCta />
    </div>
  )
}
