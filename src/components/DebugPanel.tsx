import { useState } from 'react'
import { Bug, X } from 'lucide-react'
import { isDebugEnabled, mockConfig } from '@/config/debugConfig'
import { storageKeys, storageService } from '@/lib/storageService'
import { setCarAvailabilityOverride } from '@/services/availabilityService'
import { cars } from '@/data/cars'
import { useToastStore } from '@/store/useToastStore'
import { generateBookingId } from '@/lib/id'
import type { Booking } from '@/types/booking'

/**
 * Dev-only debug panel for exercising loading/error/failure states without
 * a real backend. Hidden unless VITE_ENABLE_DEBUG=true.
 */
export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState({ ...mockConfig })
  const showToast = useToastStore((state) => state.show)

  if (!isDebugEnabled()) return null

  function updateConfig<K extends keyof typeof mockConfig>(key: K, value: (typeof mockConfig)[K]) {
    mockConfig[key] = value
    setConfig({ ...mockConfig })
  }

  function resetMockDatabase() {
    storageService.clearAll()
    showToast('Mock database reset', 'success')
  }

  function generateSampleBooking() {
    const sampleCar = cars[Math.floor(Math.random() * cars.length)]
    const bookings = storageService.get<Booking[]>(storageKeys.bookings, [])
    const now = new Date().toISOString()
    const sample: Booking = {
      id: generateBookingId(),
      userId: storageService.get<string | null>(storageKeys.session, null),
      carId: sampleCar.id,
      pickupLocationId: sampleCar.locationId,
      dropoffLocationId: sampleCar.locationId,
      pickupDate: now.slice(0, 10),
      pickupTime: '10:00',
      dropoffDate: now.slice(0, 10),
      dropoffTime: '10:00',
      extras: [],
      insuranceSelected: false,
      customer: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '9876543210',
        dateOfBirth: '1995-01-01',
        address: 'Sample Street',
        city: 'Pune',
        state: 'Maharashtra',
        postalCode: '411001',
        drivingLicenseNumber: 'MH1234567890',
      },
      pricing: {
        numberOfDays: 3,
        dailyRate: sampleCar.pricePerDay,
        basePrice: sampleCar.pricePerDay * 3,
        discountLabel: null,
        discountAmount: 0,
        locationFee: 0,
        insuranceFee: 0,
        extrasTotal: 0,
        serviceFee: 0,
        taxes: 0,
        subtotal: sampleCar.pricePerDay * 3,
        total: sampleCar.pricePerDay * 3,
        deposit: sampleCar.deposit,
      },
      paymentMethod: 'card',
      paymentStatus: 'success',
      transactionId: 'TXN-SAMPLE',
      bookingStatus: 'confirmed',
      timeline: [],
      createdAt: now,
      updatedAt: now,
    }
    bookings.push(sample)
    storageService.set(storageKeys.bookings, bookings)
    showToast('Sample booking generated', 'success')
  }

  function makeAllCarsUnavailable() {
    cars.forEach((car) => setCarAvailabilityOverride(car.id, false))
    showToast('All cars marked unavailable', 'info')
  }

  function resetAvailability() {
    storageService.remove(storageKeys.carAvailabilityOverrides)
    showToast('Availability overrides cleared', 'info')
  }

  return (
    <div className="fixed right-4 top-20 z-[90]">
      {isOpen ? (
        <div className="w-80 rounded-lg border border-ink-200 bg-white p-4 text-sm shadow-panel">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-ink-900">
              <Bug className="h-4 w-4" /> Debug panel
            </span>
            <button onClick={() => setIsOpen(false)} aria-label="Close debug panel" className="text-ink-400 hover:text-ink-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between gap-2">
              Simulate payment failure
              <input
                type="checkbox"
                checked={config.simulatePaymentFailure}
                onChange={(e) => updateConfig('simulatePaymentFailure', e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-2">
              Simulate API error
              <input
                type="checkbox"
                checked={config.simulateApiError}
                onChange={(e) => updateConfig('simulateApiError', e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-2">
              Simulate slow network
              <input
                type="checkbox"
                checked={config.simulateSlowNetwork}
                onChange={(e) => updateConfig('simulateSlowNetwork', e.target.checked)}
              />
            </label>

            <hr className="border-ink-100" />

            <button onClick={generateSampleBooking} className="rounded-md border border-ink-200 px-3 py-2 text-left hover:bg-ink-50">
              Generate sample booking
            </button>
            <button onClick={makeAllCarsUnavailable} className="rounded-md border border-ink-200 px-3 py-2 text-left hover:bg-ink-50">
              Mark all cars unavailable
            </button>
            <button onClick={resetAvailability} className="rounded-md border border-ink-200 px-3 py-2 text-left hover:bg-ink-50">
              Reset availability overrides
            </button>
            <button onClick={resetMockDatabase} className="rounded-md border border-danger-100 px-3 py-2 text-left text-danger-600 hover:bg-danger-100/40">
              Reset mock database
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open debug panel"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950 text-white shadow-panel hover:bg-ink-800"
        >
          <Bug className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
