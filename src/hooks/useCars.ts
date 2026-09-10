import { useEffect, useState } from 'react'
import { carsApi } from '@/services/api'
import type { Car } from '@/types/car'

interface UseCarsResult {
  cars: Car[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    carsApi.getCars().then((result) => {
      if (cancelled) return
      if (result.success) {
        setCars(result.data)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  return { cars, isLoading, error, reload: () => setReloadToken((t) => t + 1) }
}
