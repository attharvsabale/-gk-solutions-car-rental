import { z } from 'zod'
import { businessRules } from '@/config/businessRules'

const indianPhoneRegex = /^[6-9]\d{9}$/

export const customerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.').max(50),
  lastName: z.string().trim().min(1, 'Last name is required.').max(50),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => indianPhoneRegex.test(value), {
      message: 'Enter a valid 10-digit Indian mobile number.',
    }),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine((value) => {
      const age = (Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      return age >= businessRules.minimumDriverAge
    }, `Driver must be at least ${businessRules.minimumDriverAge} years old.`),
  address: z.string().trim().min(1, 'Address is required.').max(200),
  city: z.string().trim().min(1, 'City is required.').max(80),
  state: z.string().trim().min(1, 'State is required.').max(80),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit postal code.'),
  drivingLicenseNumber: z
    .string()
    .trim()
    .min(6, 'Enter a valid driving license number.')
    .max(20),
})

export type CustomerFormValues = z.infer<typeof customerSchema>

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required.'),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/\D/g, ''))
      .refine((value) => indianPhoneRegex.test(value), {
        message: 'Enter a valid 10-digit Indian mobile number.',
      }),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export const cardPaymentSchema = z.object({
  cardNumber: z
    .string()
    .transform((value) => value.replace(/\s/g, ''))
    .refine((value) => /^\d{16}$/.test(value), 'Enter a valid 16-digit card number.'),
  cardHolderName: z.string().trim().min(1, 'Name on card is required.'),
  expiry: z
    .string()
    .refine((value) => /^\d{2}\/\d{2}$/.test(value), 'Use MM/YY format.')
    .refine((value) => {
      const [month, year] = value.split('/').map(Number)
      if (!month || month < 1 || month > 12) return false
      const expiryDate = new Date(2000 + (year ?? 0), month, 0)
      return expiryDate.getTime() > Date.now()
    }, 'Card has expired.'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter a valid CVV.'),
})

export type CardPaymentFormValues = z.infer<typeof cardPaymentSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length === 0 || indianPhoneRegex.test(value), {
      message: 'Enter a valid 10-digit Indian mobile number.',
    }),
  subject: z.string().trim().min(1, 'Subject is required.'),
  message: z.string().trim().min(10, 'Message should be at least 10 characters.'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
