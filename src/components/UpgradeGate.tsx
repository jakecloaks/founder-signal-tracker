import { Lock, Zap, ArrowRight } from 'lucide-react'

interface UpgradeGateProps {
  lockedCount: number
  onUpgrade: () => void
  lockedPreviews?: React.ReactNode
}

export function UpgradeGate({ lockedCount, onUpgrade, lockedPreviews }: UpgradeGateProps) {
  return (
    <div className="results-locked mt-1">
      {/* Blurred locked cards */}
      {lockedPreviews && (
        <div className="results-locked-blur">{lockedPreviews}</div>
      )}

      {/* CTA overlay */}
      <div className="results-locked-overlay px-6 py-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-white shadow-sm">
          <Lock className="h-5 w-5 text-stone-400" />
        </div>
        <h3 className="mt-3 text-base font-bold text-stone-900">
          {lockedCount} more result{lockedCount !== 1 ? 's' : ''} locked
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          You've used all your free searches. Upgrade to unlock full results.
        </p>

        <div className="mt-5 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={onUpgrade}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md"
          >
            <Zap className="h-4 w-4" />
            Unlock Full Results
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-stone-400">Starting at $19/month · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
