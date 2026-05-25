import { Flame } from 'lucide-react'
import type { FeedEvent } from '../types'
import { relativeTime } from '../utils/signalEngine'

interface HotLeadsFeedProps {
  events: FeedEvent[]
  title?: string
}

function FeedItem({ event }: { event: FeedEvent }) {
  return (
    <div className="flex shrink-0 items-center gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500/10 text-xs font-bold text-orange-400">
        {event.intentScore}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-200">{event.companyName}</p>
        <p className="truncate text-xs text-zinc-500">{event.signal}</p>
      </div>
      <span className="shrink-0 text-xs text-zinc-600">{relativeTime(event.timestamp)}</span>
    </div>
  )
}

export function HotLeadsFeed({ events, title = 'Hot leads feed' }: HotLeadsFeedProps) {
  const duplicated = [...events, ...events]

  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <span className="live-dot h-2 w-2 rounded-full bg-orange-500" />
        <Flame className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
        <span className="ml-auto text-xs text-zinc-500">Live</span>
      </div>
      <div className="relative h-64 overflow-hidden">
        <div className="feed-track space-y-2 p-3">
          {duplicated.map((event, i) => (
            <FeedItem key={`${event.id}-${i}`} event={event} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#12121a] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#12121a] to-transparent" />
      </div>
    </div>
  )
}
