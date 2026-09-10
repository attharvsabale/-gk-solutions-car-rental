import { describe, expect, it } from 'vitest'
import { cardPaymentSchema, customerSchema, loginSchema, registerSchema } from './validation'

describe('customerSchema', () => {
  const validCustomer = {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    dateOfBirth: '1995-01-01',
    address: '123 MG Road',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    drivingLicenseNumber: 'MH1220210012345',
  }

  it('accepts a fully valid customer', () => {
    expect(customerSchema.safeParse(validCustomer).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = customerSchema.safeParse({ ...validCustomer, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a phone number that is not a valid 10-digit Indian mobile number', () => {
    expect(customerSchema.safeParse({ ...validCustomer, phone: '12345' }).success).toBe(false)
    expect(customerSchema.safeParse({ ...validCustomer, phone: '1234567890' }).success).toBe(false)
  })

  it('accepts a phone number with spaces/formatting, stripping non-digits', () => {
    const result = customerSchema.safeParse({ ...validCustomer, phone: '98765 43210' })
    expect(result.success).toBe(true)
  })

  it('rejects a driver under the minimum age', () => {
    const tooYoung = new Date()
    tooYoung.setFullYear(tooYoung.getFullYear() - 10)
    const result = customerSchema.safeParse({
      ...validCustomer,
      dateOfBirth: tooYoung.toISOString().slice(0, 10),
    })
    expect(result.success).toBe(false)
  })

  it('rejects a postal code that is not 6 digits', () => {
    expect(customerSchema.safeParse({ ...validCustomer, postalCode: '1234' }).success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('requires a valid email and a password of at least 6 characters', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true)
    expect(loginSchema.safeParse({ email: 'not-an-email', password: '123456' }).success).toBe(false)
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123' }).success).toBe(false)
  })
})

describe('registerSchema', () => {
  const base = {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    password: 'password123',
    confirmPassword: 'password123',
  }

  it('accepts matching passwords', () => {
    expect(registerSchema.safeParse(base).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ ...base, confirmPassword: 'different' })
    expect(result.success).toBe(false)
  })
})

describe('cardPaymentSchema', () => {
  it('accepts a well-formed test card', () => {
    const result = cardPaymentSchema.safeParse({
      cardNumber: '4242 4242 4242 4242',
      cardHolderName: 'Test User',
      expiry: '12/28',
      cvv: '123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a card number that is not 16 digits', () => {
    const result = cardPaymentSchema.safeParse({
      cardNumber: '4242 4242',
      cardHolderName: 'Test User',
      expiry: '12/28',
      cvv: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an expired card', () => {
    const result = cardPaymentSchema.safeParse({
      cardNumber: '4242424242424242',
      cardHolderName: 'Test User',
      expiry: '01/20',
      cvv: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed expiry', () => {
    const result = cardPaymentSchema.safeParse({
      cardNumber: '4242424242424242',
      cardHolderName: 'Test User',
      expiry: '2028',
      cvv: '123',
    })
    expect(result.success).toBe(false)
  })
})
