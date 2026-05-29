import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Plus, Trash2, MessageCircle, ChevronRight, FolderOpen, StickyNote } from 'lucide-react'
import { useSavedLeads, type SavedLead } from '../hooks/useSavedLeads'
import { useCredits } from '../hooks/useCredits'
import { Sidebar } from '../components/Sidebar'
import { OpportunityScoreRing } from '../components/OpportunityScoreRing'
import { OpportunityBadge } from '../components/OpportunityBadge'
import { BusinessDetailModal } from '../components/BusinessDetailModal'
import { SignalScopeLogo } from '../components/SignalScopeLogo'
import type { LocalBusiness } from '../types'

const STATUS_STYLES = {
  new:       'bg-white/5 text-[#888] border-[#2A2A2A]',
  contacted: 'bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/25',
  replied:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  closed:    'bg-white/5 text-[#555] border-[#2A2A2A]',
}

const STATUS_LABELS = { new: 'New', contacted: 'Contacted', replied: 'Replied', closed: 'Closed' }

const COLLECTION_EMOJIS = ['📁', '🎯', '🔥', '⭐', '🏆', '📍', '🗂️', '💡']

function LeadCard({
  lead, onSelect, savedLeadsHook,
}: { lead: SavedLead; onSelect: (b: LocalBusiness) => void; savedLeadsHook: ReturnType<typeof useSavedLeads> }) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(lead.note)

  return (
    <div className={`overflow-hidden rounded-xl border bg-[#1A1A1A] transition-colors ${
      lead.business.fitScore >= 80 ? 'border-orange-500/25' : 'border-[#2A2A2A]'
    }`}>
      {lead.business.fitScore >= 80 && <div className="h-px bg-orange-500/40" />}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={() => onSelect(lead.business)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left group">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
              lead.business.fitScore >= 80 ? 'bg-orange-500/15 text-orange-400 border-orange-500/25' :
              lead.business.fitScore >= 65 ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25' :
              'bg-white/5 text-[#888] border-[#2A2A2A]'
            }`}>
              {lead.business.logo}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#FAFAF9] group-hover:text-[#4A90E2] transition-colors">{lead.business.name}</p>
              <p className="text-xs text-[#888]">{lead.business.industry} · {lead.business.location}</p>
            </div>
          </button>
          <div className="flex shrink-0 items-center gap-2">
            <OpportunityScoreRing score={lead.business.fitScore} />
            <button type="button" onClick={() => savedLeadsHook.removeLead(lead.business.id)}
              className="rounded-md p-1.5 text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <OpportunityBadge category={lead.business.opportunityCategory} />
          <span className="text-[10px] text-[#555] capitalize flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />{lead.business.bestContactMethod.replace('_', ' ')}
          </span>
          {lead.business.serviceType && (
            <span className="rounded border border-[#4A90E2]/25 bg-[#4A90E2]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#4A90E2]">
              {lead.business.serviceType}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <select value={lead.outreachStatus}
            onChange={(e) => savedLeadsHook.updateStatus(lead.business.id, e.target.value as SavedLead['outreachStatus'])}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold bg-transparent focus:outline-none cursor-pointer ${STATUS_STYLES[lead.outreachStatus]}`}>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button type="button" onClick={() => setEditingNote(!editingNote)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
              lead.note ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : 'border-[#2A2A2A] bg-transparent text-[#555] hover:bg-[#1E1E1E] hover:text-[#888]'
            }`}>
            <StickyNote className="h-3 w-3" />
            {lead.note ? 'View note' : 'Add note'}
          </button>
          <button type="button" onClick={() => onSelect(lead.business)}
            className="flex items-center gap-1 rounded-md border border-[#2A2A2A] bg-transparent px-2 py-1 text-[11px] font-medium text-[#555] hover:bg-[#1E1E1E] hover:text-[#888] transition-colors">
            Analysis <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {editingNote && (
          <div className="mt-3">
            <textarea rows={2} placeholder="Add a note — 'Responded on IG', 'Follow up Tuesday'…"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onBlur={() => { savedLeadsHook.updateNote(lead.business.id, noteValue); setEditingNote(false) }}
              className="w-full rounded-lg border border-[#2A2A2A] bg-[#111] px-3 py-2 text-xs text-[#FAFAF9] placeholder:text-[#555] focus:border-[#4A90E2]/50 focus:outline-none resize-none"
              autoFocus />
          </div>
        )}

        {lead.note && !editingNote && (
          <div role="button" tabIndex={0} onClick={() => setEditingNote(true)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingNote(true)}
            className="mt-2 cursor-pointer rounded-md border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-500/12 transition-colors">
            {lead.note}
          </div>
        )}

        <p className="mt-2 text-[10px] text-[#555]">
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
    <div className="flex min-h-screen bg-[#0D0D0D] text-[#FAFAF9]">
      <Sidebar credits={credits.credits} savedCount={savedLeadsHook.savedLeads.length} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-[#1E1E1E] bg-[#111] px-4 py-3 md:hidden">
          <SignalScopeLogo size="sm" />
        </div>

        <div className="border-b border-[#1E1E1E] bg-[#111] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-[#4A90E2]" />
              <h1 className="text-base font-bold text-[#FAFAF9] tracking-tight">Saved Leads</h1>
              {savedLeadsHook.savedLeads.length > 0 && (
                <span className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2 py-0.5 text-xs font-bold text-[#888]">
                  {savedLeadsHook.savedLeads.length}
                </span>
              )}
            </div>
            <Link to="/dashboard"
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1.5 text-xs font-semibold text-[#888] transition-colors hover:bg-[#1E1E1E] hover:text-[#FAFAF9]">
              + Find more leads
            </Link>
          </div>
        </div>

        <div className="flex flex-1 overflow-auto">
          {/* Collections sidebar */}
          <div className="hidden w-48 shrink-0 border-r border-[#1E1E1E] bg-[#111] p-3 lg:block">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#555]">Collections</p>

            <button type="button" onClick={() => setSelectedCollection(null)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                selectedCollection === null ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-[#888] hover:bg-[#1A1A1A] hover:text-[#FAFAF9]'
              }`}>
              <FolderOpen className="h-3.5 w-3.5 text-[#555]" />
              <span className="flex-1">All leads</span>
              <span className="text-[10px] font-bold text-[#555]">{savedLeadsHook.savedLeads.length}</span>
            </button>

            {savedLeadsHook.collections.map((col) => {
              const count = savedLeadsHook.savedLeads.filter((l) => l.collectionId === col.id).length
              return (
                <button key={col.id} type="button" onClick={() => setSelectedCollection(col.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    selectedCollection === col.id ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : 'text-[#888] hover:bg-[#1A1A1A] hover:text-[#FAFAF9]'
                  }`}>
                  <span>{col.emoji}</span>
                  <span className="flex-1 truncate">{col.name}</span>
                  <span className="text-[10px] font-bold text-[#555]">{count}</span>
                </button>
              )
            })}

            <div className="mt-2 border-t border-[#1E1E1E] pt-2">
              {showNewCollection ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {COLLECTION_EMOJIS.map((e) => (
                      <button key={e} type="button" onClick={() => setNewCollectionEmoji(e)}
                        className={`text-base rounded p-1 transition-colors ${newCollectionEmoji === e ? 'bg-[#4A90E2]/15' : 'hover:bg-[#1A1A1A]'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                  <input type="text" placeholder="Collection name…" value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createCollection()}
                    className="w-full rounded-md border border-[#2A2A2A] bg-[#1A1A1A] px-2.5 py-1.5 text-xs text-[#FAFAF9] placeholder:text-[#555] focus:border-[#4A90E2]/50 focus:outline-none"
                    autoFocus />
                  <div className="flex gap-1.5">
                    <button type="button" onClick={createCollection}
                      className="flex-1 rounded-md bg-[#4A90E2] py-1 text-xs font-semibold text-white hover:bg-[#3D7CC9]">
                      Create
                    </button>
                    <button type="button" onClick={() => setShowNewCollection(false)}
                      className="rounded-md border border-[#2A2A2A] px-2 py-1 text-xs text-[#555] hover:bg-[#1A1A1A]">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setShowNewCollection(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#555] transition-colors hover:bg-[#1A1A1A] hover:text-[#888]">
                  <Plus className="h-3.5 w-3.5" />New collection
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto p-4 sm:p-5">
            {visibleLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]">
                  <Bookmark className="h-7 w-7 text-[#333]" />
                </div>
                <h2 className="mt-4 text-base font-bold text-[#888]">No saved leads yet</h2>
                <p className="mt-2 max-w-xs text-sm text-[#555]">
                  Search for businesses and click the bookmark icon to save high-potential leads here.
                </p>
                <Link to="/dashboard"
                  className="mt-5 rounded-lg bg-[#4A90E2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3D7CC9] transition-colors">
                  Find leads now
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onSelect={setSelectedBusiness} savedLeadsHook={savedLeadsHook} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BusinessDetailModal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} savedLeadsHook={savedLeadsHook} />
    </div>
  )
}
