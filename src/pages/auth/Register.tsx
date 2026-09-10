import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema, type RegisterFormValues } from '@/lib/validation'
import { setPageMeta } from '@/lib/seo'
import { useToastStore } from '@/store/useToastStore'

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.show)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPageMeta('Sign Up | GK Solutions', 'Create a free account to book and manage car rentals.')
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterFormValues) {
    setIsSubmitting(true)
    setServerError(null)
    const result = await registerUser(values)
    setIsSubmitting(false)

    if (!result.ok) {
      setServerError(result.error ?? 'Unable to create account.')
      return
    }

    showToast('Account created', 'success')
    navigate('/account', { replace: true })
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-lg border border-ink-100 bg-white p-8 shadow-panel">
        <h1 className="font-display text-2xl font-semibold text-ink-950">Create your account</h1>
        <p className="mt-1 text-sm text-ink-500">It only takes a minute.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} />
          </div>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
          <Input label="Phone" type="tel" placeholder="98765 43210" {...register('phone')} error={errors.phone?.message} />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} autoComplete="new-password" />
          <Input label="Confirm password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} autoComplete="new-password" />
          {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-ink-900 underline">
            Log in
          </Link>
        </p>
        <p className="mt-3 rounded-md bg-ink-50 px-3 py-2 text-center text-xs text-ink-400">
          Mock authentication — data is stored only in this browser, never on a server.
        </p>
      </div>
    </div>
  )
}
