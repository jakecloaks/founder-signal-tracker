import { useState, useEffect, useCallback } from 'react'
import type { LocalBusiness } from '../types'

export interface SavedLead {
  id: string
  business: LocalBusiness
  collectionId: string | null
  note: string
  outreachStatus: 'new' | 'contacted' | 'replied' | 'closed'
  savedAt: string
}

export interface LeadCollection {
  id: string
  name: string
  emoji: string
  createdAt: string
}

const LEADS_KEY = 'signalscope_saved_leads'
const COLLECTIONS_KEY = 'signalscope_collections'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export function useSavedLeads() {
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>(() =>
    readStorage<SavedLead[]>(LEADS_KEY, [])
  )
  const [collections, setCollections] = useState<LeadCollection[]>(() =>
    readStorage<LeadCollection[]>(COLLECTIONS_KEY, [])
  )

  useEffect(() => {
    try {
      localStorage.setItem(LEADS_KEY, JSON.stringify(savedLeads))
    } catch {}
  }, [savedLeads])

  useEffect(() => {
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections))
    } catch {}
  }, [collections])

  const isSaved = useCallback(
    (businessId: string) => savedLeads.some((l) => l.business.id === businessId),
    [savedLeads]
  )

  const getSaved = useCallback(
    (businessId: string) => savedLeads.find((l) => l.business.id === businessId) ?? null,
    [savedLeads]
  )

  const saveLead = useCallback((business: LocalBusiness, collectionId?: string) => {
    const lead: SavedLead = {
      id: crypto.randomUUID(),
      business,
      collectionId: collectionId ?? null,
      note: '',
      outreachStatus: 'new',
      savedAt: new Date().toISOString(),
    }
    setSavedLeads((prev) => [lead, ...prev.filter((l) => l.business.id !== business.id)])
  }, [])

  const removeLead = useCallback((businessId: string) => {
    setSavedLeads((prev) => prev.filter((l) => l.business.id !== businessId))
  }, [])

  const updateNote = useCallback((businessId: string, note: string) => {
    setSavedLeads((prev) =>
      prev.map((l) => (l.business.id === businessId ? { ...l, note } : l))
    )
  }, [])

  const updateStatus = useCallback(
    (businessId: string, outreachStatus: SavedLead['outreachStatus']) => {
      setSavedLeads((prev) =>
        prev.map((l) => (l.business.id === businessId ? { ...l, outreachStatus } : l))
      )
    },
    []
  )

  const createCollection = useCallback((name: string, emoji: string): string => {
    const id = crypto.randomUUID()
    setCollections((prev) => [
      ...prev,
      { id, name, emoji, createdAt: new Date().toISOString() },
    ])
    return id
  }, [])

  const removeCollection = useCallback((collectionId: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId))
    setSavedLeads((prev) =>
      prev.map((l) => (l.collectionId === collectionId ? { ...l, collectionId: null } : l))
    )
  }, [])

  const moveToCollection = useCallback((businessId: string, collectionId: string | null) => {
    setSavedLeads((prev) =>
      prev.map((l) => (l.business.id === businessId ? { ...l, collectionId } : l))
    )
  }, [])

  return {
    savedLeads,
    collections,
    isSaved,
    getSaved,
    saveLead,
    removeLead,
    updateNote,
    updateStatus,
    createCollection,
    removeCollection,
    moveToCollection,
  }
}
