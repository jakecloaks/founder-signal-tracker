import { Zap } from 'lucide-react'
import type { FeedEvent } from '../types'
import { relativeTime } from '../utils/signalEngine'

interface HotLeadsFeedProps {
  events: FeedEvent[]
  title?: string
}

function fitStyle(score: number) {
  if (score >= 80) return 'bg-orange-50 text-orange-700 border-orange-200'
  if (score >= 65) return 'bg-indigo-50 text-indigo-700 border-indigo-200'
  if (score >= 45) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-stone-100 text-stone-500 border-stone-200'
}

export function HotLeadsFeed({ events, title = 'Live feed' }: HotLeadsFeedProps) {
  const topEvents = events.slice(0, 8)

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2.5">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
        <Zap className="h-3.5 w-3.5 text-orange-500" />
        <h3 className="text-xs font-semibold text-stone-700">{title}</h3>
        <span className="ml-auto rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Live
        </span>
      </div>
      <div>
        {topEvents.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-stone-400">No signals yet</p>
        ) : (
          topEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 border-b border-stone-100 px-4 py-2.5 last:border-0 hover:bg-stone-50 transition-colors">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tabular-nums ${fitStyle(event.intentScore)}`}>
                {event.intentScore}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-stone-800">{event.companyName}</p>
                <p className="truncate text-[11px] text-stone-500">{event.signal}</p>
              </div>
              <span className="shrink-0 text-[10px] text-stone-400">{relativeTime(event.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
