import { Lock, Zap, ArrowRight } from 'lucide-react'

interface UpgradeGateProps {
  lockedCount: number
  onUpgrade: () => void
  lockedPreviews?: React.ReactNode
}

export function UpgradeGate({ lockedCount, onUpgrade, lockedPreviews }: UpgradeGateProps) {
  return (
    <div className="results-locked mt-1">
      {lockedPreviews && (
        <div className="results-locked-blur">{lockedPreviews}</div>
      )}
      <div className="results-locked-overlay px-6 py-12 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#1A1A1A]">
          <Lock className="h-5 w-5 text-[#888]" />
        </div>
        <h3 className="mt-3 text-base font-bold text-[#FAFAF9]">
          {lockedCount} more result{lockedCount !== 1 ? 's' : ''} locked
        </h3>
        <p className="mt-1 text-sm text-[#888]">
          You've used all your free searches. Upgrade to unlock full results.
        </p>
        <div className="mt-5 flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={onUpgrade}
            className="flex items-center gap-2 rounded-lg bg-[#4A90E2] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3D7CC9]"
          >
            <Zap className="h-4 w-4" />
            Unlock Full Results
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-[#555]">Starting at $19/month · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
