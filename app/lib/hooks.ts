'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for persisting state in localStorage.
 * Returns [value, setValue] just like useState.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Load from localStorage on mount and when key changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      } else {
        setStoredValue(initialValue)
      }
    } catch {
      setStoredValue(initialValue)
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue))
        } catch {
          // Silently fail if localStorage is full or unavailable
        }
        return newValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
