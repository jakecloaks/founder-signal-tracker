import { Zap } from 'lucide-react'
import type { FeedEvent } from '../types'
import { relativeTime } from '../utils/signalEngine'

interface HotLeadsFeedProps {
  events: FeedEvent[]
  title?: string
}

function fitStyle(score: number) {
  if (score >= 80) return 'bg-orange-500/15 text-orange-400 border-orange-500/25'
  if (score >= 65) return 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/25'
  if (score >= 45) return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
  return 'bg-white/5 text-[#888] border-[#2A2A2A]'
}

export function HotLeadsFeed({ events, title = 'Live feed' }: HotLeadsFeedProps) {
  const topEvents = events.slice(0, 8)
  return (
    <div className="overflow-hidden rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]">
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] bg-[#111] px-4 py-2.5">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-orange-500" />
        <Zap className="h-3.5 w-3.5 text-orange-400" />
        <h3 className="text-xs font-semibold text-[#FAFAF9]">{title}</h3>
        <span className="ml-auto rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#555]">
          Live
        </span>
      </div>
      <div>
        {topEvents.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-[#555]">No signals yet</p>
        ) : (
          topEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 border-b border-[#1E1E1E] px-4 py-2.5 last:border-0 transition-colors hover:bg-[#1E1E1E]"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tabular-nums ${fitStyle(event.intentScore)}`}>
                {event.intentScore}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#FAFAF9]">{event.companyName}</p>
                <p className="truncate text-[11px] text-[#888]">{event.signal}</p>
              </div>
              <span className="shrink-0 text-[10px] text-[#555]">{relativeTime(event.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
