import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginFormValues } from '@/lib/validation'
import { setPageMeta } from '@/lib/seo'
import { useToastStore } from '@/store/useToastStore'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const showToast = useToastStore((state) => state.show)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPageMeta('Log In | GK Solutions', 'Log in to manage your car rental bookings.')
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true)
    setServerError(null)
    const result = await login(values.email, values.password)
    setIsSubmitting(false)

    if (!result.ok) {
      setServerError(result.error ?? 'Unable to log in.')
      return
    }

    showToast('Welcome back!', 'success')
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-ink-100 bg-white p-8 shadow-panel">
        <h1 className="font-display text-2xl font-semibold text-ink-950">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-500">Log in to manage your bookings.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} autoComplete="email" />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} autoComplete="current-password" />
          {serverError && <p className="text-sm font-medium text-danger-600">{serverError}</p>}
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-ink-900 underline">
            Sign up
          </Link>
        </p>
        <p className="mt-3 rounded-md bg-ink-50 px-3 py-2 text-center text-xs text-ink-400">
          Mock authentication — data is stored only in this browser, never on a server.
        </p>
      </div>
    </div>
  )
}
