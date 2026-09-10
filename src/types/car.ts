export type CarCategory = 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Electric' | 'MUV'

export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'

export type TransmissionType = 'Automatic' | 'Manual'

export type CarFeature =
  | 'Apple CarPlay'
  | 'Android Auto'
  | 'GPS Navigation'
  | 'Sunroof'
  | 'Bluetooth'
  | 'Cruise Control'
  | 'Child Seat Ready'
  | 'Parking Sensors'
  | 'Reverse Camera'
  | 'Wireless Charging'
  | 'Heated Seats'
  | 'Air Conditioning'
  | 'Alloy Wheels'
  | 'Keyless Entry'

export interface CancellationPolicy {
  fullRefundHours: number
  partialRefundHours: number
  partialRefundPercent: number
}

export interface Car {
  id: string
  brand: string
  model: string
  variant: string
  year: number
  category: CarCategory
  pricePerDay: number
  pricePerWeek: number
  pricePerMonth: number
  locationId: string
  fuelType: FuelType
  transmission: TransmissionType
  seats: number
  doors: number
  largeBags: number
  smallBags: number
  mileageLimitPerDay: number
  rating: number
  reviewCount: number
  images: string[]
  features: CarFeature[]
  description: string
  available: boolean
  insuranceIncluded: boolean
  deposit: number
  instantBooking: boolean
  cancellationPolicy: CancellationPolicy
  badge?: 'Popular' | 'Best value' | 'Electric' | 'New'
  minimumDriverAge: number
}
