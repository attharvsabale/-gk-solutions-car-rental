import { delay } from '@/lib/delay'
import { generateTransactionId } from '@/lib/id'
import { mockConfig } from '@/config/debugConfig'
import type { PaymentsApi } from './types'

const DECLINED_TEST_CARD = '4000000000000002'

/**
 * Simulated payment gateway. No card data ever leaves the browser — this
 * exists purely to give the UI a realistic processing → success/failure
 * flow. A real integration would swap this for Stripe/Razorpay server calls.
 */
export const mockPaymentsApi: PaymentsApi = {
  async processPayment(request) {
    await delay(1400)

    const cardDeclined = request.method === 'card' && request.card?.cardNumber.replace(/\s/g, '') === DECLINED_TEST_CARD
    const shouldFail = mockConfig.simulatePaymentFailure || cardDeclined

    if (shouldFail) {
      return {
        success: true,
        data: {
          success: false,
          transactionId: generateTransactionId(),
          status: 'failed',
          failureReason: cardDeclined
            ? 'Your card was declined by the issuing bank.'
            : 'Payment could not be completed. Please try again.',
          paidAt: new Date().toISOString(),
        },
      }
    }

    return {
      success: true,
      data: {
        success: true,
        transactionId: generateTransactionId(),
        status: 'success',
        paidAt: new Date().toISOString(),
      },
    }
  },
}
