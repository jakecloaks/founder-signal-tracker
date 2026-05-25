import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Radar,
  Bookmark,
  Plus,
  Trash2,
  MessageCircle,
  ChevronRight,
  FolderOpen,
  StickyNote,
} from 'lucide-react'
import { useSavedLeads, type SavedLead } from '../hooks/useSavedLeads'
import { useCredits } from '../hooks/useCredits'
import { Sidebar } from '../components/Sidebar'
import { OpportunityScoreRing } from '../components/OpportunityScoreRing'
import { OpportunityBadge } from '../components/OpportunityBadge'
import { BusinessDetailModal } from '../components/BusinessDetailModal'
import type { LocalBusiness } from '../types'

const STATUS_STYLES = {
  new: 'bg-stone-100 text-stone-600 border-stone-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-stone-100 text-stone-400 border-stone-200',
}

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  replied: 'Replied',
  closed: 'Closed',
}

const COLLECTION_EMOJIS = ['📁', '🎯', '🔥', '⭐', '🏆', '📍', '🗂️', '💡']

function LeadCard({
  lead,
  onSelect,
  savedLeadsHook,
}: {
  lead: SavedLead
  onSelect: (b: LocalBusiness) => void
  savedLeadsHook: ReturnType<typeof useSavedLeads>
}) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(lead.note)
  const hot = lead.business.fitScore >= 80

  return (
    <div className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${hot ? 'border-orange-200' : 'border-stone-200'}`}>
      {hot && <div className="h-0.5 bg-gradient-to-r from-orange-400 to-orange-500" />}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onSelect(lead.business)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left group"
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
              lead.business.fitScore >= 80 ? 'bg-orange-50 text-orange-700 border-orange-200' :
              lead.business.fitScore >= 65 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
              'bg-stone-100 text-stone-600 border-stone-200'
            }`}>
              {lead.business.logo}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-stone-900 group-hover:text-indigo-700 transition-colors">
                {lead.business.name}
              </p>
              <p className="text-xs text-stone-500">{lead.business.industry} · {lead.business.location}</p>
            </div>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <OpportunityScoreRing score={lead.business.fitScore} />
            <button
              type="button"
              onClick={() => savedLeadsHook.removeLead(lead.business.id)}
              className="rounded-md p-1.5 text-stone-300 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <OpportunityBadge category={lead.business.opportunityCategory} />
          <span className="text-[10px] text-stone-400 capitalize flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {lead.business.bestContactMethod.replace('_', ' ')}
          </span>
          {lead.business.serviceType && (
            <span className="rounded border border-indigo-100 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600">
              {lead.business.serviceType}
            </span>
          )}
        </div>

        {/* Status + actions */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <select
            value={lead.outreachStatus}
            onChange={(e) => savedLeadsHook.updateStatus(lead.business.id, e.target.value as SavedLead['outreachStatus'])}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors focus:outline-none ${STATUS_STYLES[lead.outreachStatus]}`}
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setEditingNote(!editingNote)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
              lead.note
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-stone-200 bg-stone-50 text-stone-500 hover:bg-stone-100'
            }`}
          >
            <StickyNote className="h-3 w-3" />
            {lead.note ? 'View note' : 'Add note'}
          </button>
          <button
            type="button"
            onClick={() => onSelect(lead.business)}
            className="flex items-center gap-1 rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-500 hover:bg-stone-100 transition-colors"
          >
            Analysis
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Note editor */}
        {editingNote && (
          <div className="mt-3">
            <textarea
              rows={2}
              placeholder="Add a note — 'Responded on IG', 'Follow up Tuesday'…"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onBlur={() => {
                savedLeadsHook.updateNote(lead.business.id, noteValue)
                setEditingNote(false)
              }}
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700 placeholder:text-stone-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 resize-none"
              autoFocus
            />
          </div>
        )}

        {lead.note && !editingNote && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setEditingNote(true)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingNote(true)}
            className="mt-2 cursor-pointer rounded-md border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-100 transition-colors"
          >
            {lead.note}
          </div>
        )}

        <p className="mt-2 text-[10px] text-stone-400">
          Saved {new Date(lead.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

export function SavedLeadsPage() {
  const savedLeadsHook = useSavedLeads()
  const credits = useCredits()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [showNewCollection, setShowNewCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionEmoji, setNewCollectionEmoji] = useState('📁')
  const [selectedBusiness, setSelectedBusiness] = useState<LocalBusiness | null>(null)

  const visibleLeads = selectedCollection
    ? savedLeadsHook.savedLeads.filter((l) => l.collectionId === selectedCollection)
    : savedLeadsHook.savedLeads

  function createCollection() {
    if (!newCollectionName.trim()) return
    savedLeadsHook.createCollection(newCollectionName.trim(), newCollectionEmoji)
    setNewCollectionName('')
    setShowNewCollection(false)
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar credits={credits.credits} savedCount={savedLeadsHook.savedLeads.length} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <Radar className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-stone-900">SignalScope</span>
        </div>

        {/* Header */}
        <div className="border-b border-stone-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4.5 w-4.5 text-indigo-600" />
              <h1 className="text-base font-bold text-stone-900">Saved Leads</h1>
              {savedLeadsHook.savedLeads.length > 0 && (
                <span className="rounded-full border border-stone-200 bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-600">
                  {savedLeadsHook.savedLeads.length}
                </span>
              )}
            </div>
            <Link
              to="/dashboard"
              className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 shadow-sm transition-colors hover:bg-stone-50"
            >
              + Find more leads
            </Link>
          </div>
        </div>

        <div className="flex flex-1 overflow-auto">
          {/* Collections sidebar */}
          <div className="hidden w-48 shrink-0 border-r border-stone-200 bg-white p-3 lg:block">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Collections</p>

            <button
              type="button"
              onClick={() => setSelectedCollection(null)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                selectedCollection === null
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <FolderOpen className="h-3.5 w-3.5 text-stone-400" />
              <span className="flex-1">All leads</span>
              <span className="text-[10px] font-bold text-stone-400">
                {savedLeadsHook.savedLeads.length}
              </span>
            </button>

            {savedLeadsHook.collections.map((col) => {
              const count = savedLeadsHook.savedLeads.filter((l) => l.collectionId === col.id).length
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollection(col.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    selectedCollection === col.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{col.emoji}</span>
                  <span className="flex-1 truncate">{col.name}</span>
                  <span className="text-[10px] font-bold text-stone-400">{count}</span>
                </button>
              )
            })}

            <div className="mt-2 border-t border-stone-100 pt-2">
              {showNewCollection ? (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    {COLLECTION_EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setNewCollectionEmoji(e)}
                        className={`text-base rounded p-1 transition-colors ${newCollectionEmoji === e ? 'bg-indigo-100' : 'hover:bg-stone-100'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Collection name…"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createCollection()}
                    className="w-full rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:border-indigo-300 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={createCollection}
                      className="flex-1 rounded-md bg-indigo-600 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCollection(false)}
                      className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewCollection(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New collection
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-4 sm:p-5">
            {visibleLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-200 bg-white shadow-sm">
                  <Bookmark className="h-7 w-7 text-stone-300" />
                </div>
                <h2 className="mt-4 text-base font-bold text-stone-700">No saved leads yet</h2>
                <p className="mt-2 max-w-xs text-sm text-stone-500">
                  Search for businesses and click the bookmark icon to save high-potential leads here.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Find leads now
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelect={setSelectedBusiness}
                    savedLeadsHook={savedLeadsHook}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BusinessDetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        savedLeadsHook={savedLeadsHook}
      />
    </div>
  )
}
