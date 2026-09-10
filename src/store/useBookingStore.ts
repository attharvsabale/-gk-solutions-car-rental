import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { storageKeys } from '@/lib/storageService'
import { zustandLocalStorage } from '@/lib/zustandStorage'
import { defaultDropoffDate, defaultPickupDate } from '@/lib/date'
import type { SelectedExtra } from '@/types/extras'
import type { CustomerDetails } from '@/types/user'

export interface BookingDraft {
  carId: string | null
  pickupLocationId: string
  dropoffLocationId: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  extras: SelectedExtra[]
  insuranceSelected: boolean
  customer: Partial<CustomerDetails>
}

interface BookingState {
  draft: BookingDraft
  pendingBookingId: string | null
  setPendingBookingId: (id: string | null) => void
  setCar: (carId: string, locationId: string) => void
  setRentalDetails: (updates: Partial<Pick<BookingDraft, 'pickupLocationId' | 'dropoffLocationId' | 'pickupDate' | 'pickupTime' | 'dropoffDate' | 'dropoffTime'>>) => void
  setExtraQuantity: (extraId: string, quantity: number) => void
  setInsuranceSelected: (selected: boolean) => void
  setCustomer: (customer: CustomerDetails) => void
  reset: () => void
}

const initialDraft: BookingDraft = {
  carId: null,
  pickupLocationId: '',
  dropoffLocationId: '',
  pickupDate: defaultPickupDate(),
  pickupTime: '10:00',
  dropoffDate: defaultDropoffDate(),
  dropoffTime: '10:00',
  extras: [],
  insuranceSelected: false,
  customer: {},
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      pendingBookingId: null,
      setPendingBookingId: (id) => set({ pendingBookingId: id }),

      setCar: (carId, locationId) =>
        set((state) => ({
          draft: {
            ...state.draft,
            carId,
            pickupLocationId: state.draft.pickupLocationId || locationId,
            dropoffLocationId: state.draft.dropoffLocationId || locationId,
          },
        })),

      setRentalDetails: (updates) =>
        set((state) => ({ draft: { ...state.draft, ...updates } })),

      setExtraQuantity: (extraId, quantity) =>
        set((state) => {
          const withoutExtra = state.draft.extras.filter((e) => e.extraId !== extraId)
          const extras: SelectedExtra[] = quantity > 0 ? [...withoutExtra, { extraId, quantity }] : withoutExtra
          return { draft: { ...state.draft, extras } }
        }),

      setInsuranceSelected: (selected) =>
        set((state) => ({ draft: { ...state.draft, insuranceSelected: selected } })),

      setCustomer: (customer) => set((state) => ({ draft: { ...state.draft, customer } })),

      reset: () => set({ draft: initialDraft, pendingBookingId: null }),
    }),
    {
      name: storageKeys.bookingDraft,
      storage: createJSONStorage(() => zustandLocalStorage),
    },
  ),
)
