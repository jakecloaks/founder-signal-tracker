import { useState, useEffect } from 'react'

const STORAGE_KEY = 'signalscope_credits'
const INITIAL_CREDITS = 5

export function useCredits() {
  const [credits, setCredits] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored !== null ? Number(stored) : INITIAL_CREDITS
    } catch {
      return INITIAL_CREDITS
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(credits))
    } catch {
      // ignore
    }
  }, [credits])

  const useCredit = (): boolean => {
    if (credits <= 0) return false
    setCredits((prev) => prev - 1)
    return true
  }

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount)
  }

  const resetCredits = () => {
    setCredits(INITIAL_CREDITS)
  }

  return { credits, useCredit, addCredits, resetCredits, hasCredits: credits > 0 }
}
