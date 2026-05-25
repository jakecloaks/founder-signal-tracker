import { Zap } from 'lucide-react'
import type { FeedEvent } from '../types'
import { relativeTime } from '../utils/signalEngine'

interface HotLeadsFeedProps {
  events: FeedEvent[]
  title?: string
}

function getFitColor(score: number) {
  if (score >= 80) return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
  if (score >= 65) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  if (score >= 45) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  return 'text-zinc-500 bg-zinc-800/60 border-zinc-700/40'
}

function FeedItem({ event }: { event: FeedEvent }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#161616] px-4 py-2.5 last:border-0">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-bold tabular-nums ${getFitColor(event.intentScore)}`}>
        {event.intentScore}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-[#ccc]">{event.companyName}</p>
        <p className="truncate text-[11px] text-[#555]">{event.signal}</p>
      </div>
      <span className="shrink-0 text-[10px] text-[#3a3a3a]">{relativeTime(event.timestamp)}</span>
    </div>
  )
}

export function HotLeadsFeed({ events, title = 'Live feed' }: HotLeadsFeedProps) {
  const topEvents = events.slice(0, 8)

  return (
    <div className="rounded-lg border border-[#1c1c1c] bg-[#111] overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#1c1c1c] px-4 py-2.5">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
        <Zap className="h-3.5 w-3.5 text-orange-400" />
        <h3 className="text-xs font-semibold text-[#ccc]">{title}</h3>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-[#3a3a3a]">Live</span>
      </div>
      <div>
        {topEvents.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-[#444]">No signals yet</p>
        ) : (
          topEvents.map((event) => <FeedItem key={event.id} event={event} />)
        )}
      </div>
    </div>
  )
}
