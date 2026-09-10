export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  drivingLicenseNumber?: string
  createdAt: string
}

/**
 * Mock-only credential record. NEVER a model for real authentication —
 * passwords are stored in plain text in localStorage for prototype purposes.
 * A real backend must use hashed credentials + server-side sessions/JWT.
 */
export interface MockCredential {
  userId: string
  email: string
  password: string
}

export interface CustomerDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  postalCode: string
  drivingLicenseNumber: string
}
