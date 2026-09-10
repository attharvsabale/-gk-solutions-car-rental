import { useEffect, useState } from 'react'
import { locationsApi } from '@/services/api'
import type { RentalLocation } from '@/types/location'

export function useLocations() {
  const [locations, setLocations] = useState<RentalLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    locationsApi.getLocations().then((result) => {
      if (result.success) setLocations(result.data)
      setIsLoading(false)
    })
  }, [])

  return { locations, isLoading }
}
