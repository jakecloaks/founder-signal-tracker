import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { LocalBusiness } from '../types'
import type { useSavedLeads } from '../hooks/useSavedLeads'

interface SaveButtonProps {
  business: LocalBusiness
  savedLeadsHook: ReturnType<typeof useSavedLeads>
  className?: string
}

export function SaveButton({ business, savedLeadsHook, className = '' }: SaveButtonProps) {
  const { isSaved, saveLead, removeLead } = savedLeadsHook
  const saved = isSaved(business.id)

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (saved) {
      removeLead(business.id)
    } else {
      saveLead(business)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={saved ? 'Remove from saved' : 'Save lead'}
      className={`flex items-center justify-center rounded-lg p-1.5 transition-colors ${
        saved
          ? 'text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'
          : 'text-stone-400 bg-transparent hover:text-stone-600 hover:bg-stone-100'
      } ${className}`}
    >
      {saved ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
