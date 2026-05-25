import { X, Sparkles, Target, Activity, BarChart3 } from 'lucide-react'
import type { Company } from '../types'
import { relativeTime } from '../utils/signalEngine'
import { GrowthBadge } from './Badge'
import { IntentScore } from './IntentScore'
import { SignalStrengthBar } from './SignalStrengthBar'

interface CompanyDetailModalProps {
  company: Company | null
  onClose: () => void
}

const breakdownLabels: { key: keyof Company['intentBreakdown']; label: string }[] = [
  { key: 'hiring', label: 'Hiring' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'product', label: 'Product' },
  { key: 'social', label: 'Social' },
  { key: 'funding', label: 'Funding' },
]

export function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  if (!company) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="glass relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 shadow-2xl shadow-indigo-500/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 text-lg font-bold text-indigo-400 ring-1 ring-indigo-500/20">
            {company.logo}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-100">{company.name}</h2>
            <p className="text-sm text-zinc-500">{company.domain} · {company.industry}</p>
            <div className="mt-2">
              <GrowthBadge status={company.growthStatus} />
            </div>
          </div>
          <IntentScore score={company.intentScore} size="lg" />
        </div>

        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-300">
            <Sparkles className="h-4 w-4" />
            AI Analysis
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{company.aiSummary}</p>
          {company.sources && (
            <p className="mt-3 text-xs text-zinc-500">
              Sources:{' '}
              {company.sources.website ? (
                <span>{company.sources.website}</span>
              ) : (
                <span>name/news lookup</span>
              )}
              {company.sources.articleCount != null && (
                <span> · {company.sources.articleCount} news articles</span>
              )}
            </p>
          )}
        </div>

        <div className="mt-4">
          <SignalStrengthBar value={company.signalStrength} label="Overall signal strength" />
        </div>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <BarChart3 className="h-4 w-4 text-zinc-500" />
            Intent breakdown
          </h3>
          <div className="space-y-3">
            {breakdownLabels.map(({ key, label }) => (
              <SignalStrengthBar
                key={key}
                value={company.intentBreakdown[key]}
                label={label}
                size="sm"
              />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-zinc-200">Detected signals</h3>
          <div className="space-y-2">
            {company.signals.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{s.label}</p>
                  <p className="text-xs text-zinc-500">{s.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-400">{s.strength}%</p>
                  <p className="text-xs text-zinc-600">{relativeTime(s.detectedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Target className="h-4 w-4 text-orange-400" />
            Outreach suggestion
          </h3>
          <p className="mb-2 text-sm font-medium text-orange-300/90">"{company.outreachAngle}"</p>
          <p className="text-sm leading-relaxed text-zinc-400">{company.outreachRecommendation}</p>
        </section>

        <section className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Activity className="h-4 w-4 text-zinc-500" />
            Recent activity
          </h3>
          <div className="relative border-l border-zinc-800 pl-4">
            {company.recentActivity.map((event, i) => (
              <div key={event.id} className={`relative pb-4 ${i === company.recentActivity.length - 1 ? 'pb-0' : ''}`}>
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-900 bg-indigo-500" />
                <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                <p className="text-xs text-zinc-500">{event.description}</p>
                <p className="mt-0.5 text-xs text-zinc-600">{relativeTime(event.timestamp)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
