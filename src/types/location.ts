export interface RentalLocation {
  id: string
  name: string
  city: string
  address: string
  latitude: number
  longitude: number
  openingHours: string
  phone: string
  type: 'airport' | 'city' | 'railway'
}
