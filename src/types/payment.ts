export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet'

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'cancelled'

export interface CardDetails {
  cardNumber: string
  cardHolderName: string
  expiry: string
  cvv: string
}

export interface PaymentRequest {
  bookingId: string
  amount: number
  method: PaymentMethod
  card?: CardDetails
  upiId?: string
}

export interface PaymentResult {
  success: boolean
  transactionId: string
  status: PaymentStatus
  failureReason?: string
  paidAt: string
}
