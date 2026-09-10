import { useEffect, useState } from 'react'
import { carsApi } from '@/services/api'
import type { Car } from '@/types/car'
import type { SearchParams } from '@/types/filters'

interface UseSearchCarsResult {
  cars: Car[]
  isLoading: boolean
  error: string | null
}

export function useSearchCars(params: SearchParams): UseSearchCarsResult {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    carsApi.searchCars(params).then((result) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  return { cars, isLoading, error }
}
