import type { FeedEvent } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { MrQuakEmpty } from './MrQuak'

interface HotLeadsFeedProps {
  events: FeedEvent[]
  title?: string
}

function scoreStyle(score: number) {
  if (score >= 80) return 'bg-[#E07A45]/10 text-[#E07A45] border-[#E07A45]/20'
  if (score >= 65) return 'bg-[#4A8FE0]/10 text-[#4A8FE0] border-[#4A8FE0]/20'
  if (score >= 45) return 'bg-[#E8A520]/10 text-[#E8A520] border-[#E8A520]/20'
  return 'bg-[#1F1F30] text-[#82829A] border-[#1F1F30]'
}

export function HotLeadsFeed({ events, title = 'Live feed' }: HotLeadsFeedProps) {
  const topEvents = events.slice(0, 8)
  return (
    <div className="overflow-hidden rounded-xl border border-[#1F1F30] bg-[#16161D]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#1F1F30] px-4 py-3">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#E07A45]" />
        <h3 className="flex-1 text-xs font-semibold text-[#EAEAF0]">{title}</h3>
        <span className="rounded-full border border-[#1F1F30] bg-[#101015] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#424258]">
          Live
        </span>
      </div>

      {/* Items */}
      <div>
        {topEvents.length === 0 ? (
          <MrQuakEmpty
            title="No signals yet"
            subtitle="MrQuak is watching for opportunities"
          />
        ) : (
          topEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 border-b border-[#1A1A28] px-4 py-2.5 last:border-0 transition-colors hover:bg-[#1C1C26]"
            >
              {/* Score chip */}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold tabular-nums ${scoreStyle(event.intentScore)}`}
              >
                {event.intentScore}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#EAEAF0]">{event.companyName}</p>
                <p className="truncate text-[11px] leading-snug text-[#82829A]">{event.signal}</p>
              </div>

              {/* Time */}
              <span className="shrink-0 text-[10px] text-[#424258]">
                {relativeTime(event.timestamp)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
