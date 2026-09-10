import type { ApiResult } from '@/types/common'
import type { Car } from '@/types/car'
import type { SearchParams } from '@/types/filters'
import type { RentalLocation } from '@/types/location'
import type { User } from '@/types/user'
import type { Booking, CreateBookingInput } from '@/types/booking'
import type { PaymentRequest, PaymentResult } from '@/types/payment'

/**
 * These interfaces describe the contract the UI depends on. Swapping
 * `mockCarsApi` for an `httpCarsApi` that hits real REST endpoints
 * (GET /api/cars, POST /api/cars/search, ...) requires no component changes.
 */

export interface CarsApi {
  getCars(): Promise<ApiResult<Car[]>>
  getCarById(id: string): Promise<ApiResult<Car | null>>
  searchCars(params: SearchParams): Promise<ApiResult<Car[]>>
}

export interface LocationsApi {
  getLocations(): Promise<ApiResult<RentalLocation[]>>
  getLocationById(id: string): Promise<ApiResult<RentalLocation | null>>
  searchLocations(query: string): Promise<ApiResult<RentalLocation[]>>
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterInput extends AuthCredentials {
  firstName: string
  lastName: string
  phone: string
}

export interface AuthApi {
  login(credentials: AuthCredentials): Promise<ApiResult<User>>
  register(data: RegisterInput): Promise<ApiResult<User>>
  getCurrentUser(): Promise<ApiResult<User | null>>
  logout(): Promise<ApiResult<null>>
  updateProfile(userId: string, updates: Partial<User>): Promise<ApiResult<User>>
}

export interface AvailabilityResult {
  available: boolean
  reason?: string
}

export interface BookingsApi {
  createBooking(input: CreateBookingInput, userId: string | null): Promise<ApiResult<Booking>>
  getBooking(id: string): Promise<ApiResult<Booking | null>>
  getUserBookings(userId: string | null): Promise<ApiResult<Booking[]>>
  cancelBooking(id: string): Promise<ApiResult<Booking>>
  updateBooking(id: string, updates: Partial<Booking>): Promise<ApiResult<Booking>>
  checkAvailability(carId: string, pickupDate: string, dropoffDate: string): Promise<ApiResult<AvailabilityResult>>
}

export interface PaymentsApi {
  processPayment(request: PaymentRequest): Promise<ApiResult<PaymentResult>>
}
