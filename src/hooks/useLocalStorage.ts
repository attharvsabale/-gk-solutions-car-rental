import { useCallback, useState } from 'react'
import { storageService } from '@/lib/storageService'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => storageService.get(key, initialValue))

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        storageService.set(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update] as const
}
