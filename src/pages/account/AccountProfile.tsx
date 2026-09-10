import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useToastStore } from '@/store/useToastStore'
import { setPageMeta } from '@/lib/seo'
import type { User } from '@/types/user'

type ProfileFormValues = Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'postalCode' | 'drivingLicenseNumber'>

export default function AccountProfile() {
  const { user, updateProfile } = useAuth()
  const showToast = useToastStore((state) => state.show)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPageMeta('Profile Settings | GK Solutions', 'Manage your personal details and preferences.')
  }, [])

  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      city: user?.city ?? '',
      state: user?.state ?? '',
      postalCode: user?.postalCode ?? '',
      drivingLicenseNumber: user?.drivingLicenseNumber ?? '',
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true)
    const result = await updateProfile(values)
    setIsSubmitting(false)
    if (result.ok) {
      showToast('Profile updated', 'success')
    } else {
      showToast(result.error ?? 'Unable to update profile.', 'error')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink-900">Profile settings</h1>
      <p className="mt-1 text-sm text-ink-500">Keep your details up to date for faster checkout.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-ink-100 p-6 sm:grid-cols-2">
        <Input label="First name" {...register('firstName')} />
        <Input label="Last name" {...register('lastName')} />
        <Input label="Email" type="email" {...register('email')} disabled />
        <Input label="Phone" type="tel" {...register('phone')} />
        <Input label="Driving license number" {...register('drivingLicenseNumber')} />
        <div className="sm:col-span-2">
          <Input label="Address" {...register('address')} />
        </div>
        <Input label="City" {...register('city')} />
        <Input label="State" {...register('state')} />
        <Input label="Postal code" {...register('postalCode')} />

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" isLoading={isSubmitting}>Save changes</Button>
        </div>
      </form>
    </div>
  )
}
