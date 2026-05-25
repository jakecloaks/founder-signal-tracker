import { useState, type FormEvent } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from './Button'

interface AnalyzeBarProps {
  onAnalyze: (query: string) => Promise<void>
  disabled?: boolean
}

export function AnalyzeBar({ onAnalyze, disabled }: AnalyzeBarProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setError(null)
    setLoading(true)
    try {
      await onAnalyze(trimmed)
      setQuery('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b border-zinc-800 bg-zinc-900/20 px-4 py-4 sm:px-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
          <input
            type="text"
            placeholder="Enter company domain (stripe.com) or name (Stripe)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading || disabled}
            className="w-full rounded-lg border border-indigo-500/30 bg-zinc-900/60 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-60"
          />
        </div>
        <Button type="submit" disabled={loading || disabled || !query.trim()} className="shrink-0">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            'Analyze company'
          )}
        </Button>
      </form>
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-zinc-600">
        Live intelligence: website metadata, NewsAPI headlines, growth heuristics, and AI scoring.
      </p>
    </div>
  )
}
