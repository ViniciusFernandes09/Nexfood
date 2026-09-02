import { useEffect, useState } from 'react'
import { readFromStorage, writeToStorage } from '@/services/storage'

/**
 * Hook genérico para sincronizar um pedaço de estado com o localStorage.
 * Usado para preferências simples, como o tema (claro/escuro).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readFromStorage(key, initialValue))

  useEffect(() => {
    writeToStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
