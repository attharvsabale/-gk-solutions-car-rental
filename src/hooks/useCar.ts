import { useEffect, useState } from 'react'
import { carsApi } from '@/services/api'
import type { Car } from '@/types/car'

interface UseCarResult {
  car: Car | null
  isLoading: boolean
  error: string | null
  notFound: boolean
}

export function useCar(id: string | undefined): UseCarResult {
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setNotFound(true)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)
    setNotFound(false)

    carsApi.getCarById(id).then((result) => {
      if (cancelled) return
      if (result.success) {
        setCar(result.data)
        setNotFound(result.data === null)
      } else {
        setError(result.error.message)
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [id])

  return { car, isLoading, error, notFound }
}
