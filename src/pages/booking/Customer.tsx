import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useBookingStore } from '@/store/useBookingStore'
import { useAuth } from '@/hooks/useAuth'
import { customerSchema, type CustomerFormValues } from '@/lib/validation'
import { useBookingContext } from './useBookingContext'

export default function Customer() {
  const { draft } = useBookingContext()
  const { setCustomer } = useBookingStore()
  const { user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: draft.customer.firstName ?? user?.firstName ?? '',
      lastName: draft.customer.lastName ?? user?.lastName ?? '',
      email: draft.customer.email ?? user?.email ?? '',
      phone: draft.customer.phone ?? user?.phone ?? '',
      dateOfBirth: draft.customer.dateOfBirth ?? '',
      address: draft.customer.address ?? '',
      city: draft.customer.city ?? '',
      state: draft.customer.state ?? '',
      postalCode: draft.customer.postalCode ?? '',
      drivingLicenseNumber: draft.customer.drivingLicenseNumber ?? '',
    },
  })

  function onSubmit(values: CustomerFormValues) {
    setCustomer(values)
    navigate('/booking/review')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-7">
      <h1 className="font-display text-xl font-semibold text-ink-950">Customer details</h1>
      <p className="mt-1 text-sm text-ink-500">We'll use these details for your rental agreement and receipt.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" {...register('firstName')} error={errors.firstName?.message} />
        <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Phone" type="tel" placeholder="98765 43210" {...register('phone')} error={errors.phone?.message} />
        <Input label="Date of birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
        <Input label="Driving license number" {...register('drivingLicenseNumber')} error={errors.drivingLicenseNumber?.message} />
        <div className="sm:col-span-2">
          <Input label="Address" {...register('address')} error={errors.address?.message} />
        </div>
        <Input label="City" {...register('city')} error={errors.city?.message} />
        <Input label="State" {...register('state')} error={errors.state?.message} />
        <Input label="Postal code" {...register('postalCode')} error={errors.postalCode?.message} />
      </div>

      <div className="mt-7 flex justify-between border-t border-ink-100 pt-5">
        <Button type="button" variant="outline" size="lg" onClick={() => navigate('/booking/extras')}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Continue to review
        </Button>
      </div>
    </form>
  )
}
