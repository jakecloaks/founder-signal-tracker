import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { MrQuak } from './MrQuak'

interface UpgradeGateProps {
  lockedCount: number
  onUpgrade: () => void
  lockedPreviews?: React.ReactNode
  location?: string
}

export function UpgradeGate({ lockedCount, onUpgrade: _onUpgrade, lockedPreviews, location }: UpgradeGateProps) {
  return (
    <div className="results-locked">
      {lockedPreviews && (
        <div className="results-locked-blur">{lockedPreviews}</div>
      )}

      <div className="results-locked-overlay px-6 py-10 text-center">
        <div className="inline-flex flex-col items-center gap-5 rounded-2xl border border-[#1F1F30] bg-[#0C0C10]/90 px-8 py-7 backdrop-blur-md"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>

          {/* MrQuak mascot moment */}
          <MrQuak size={36} className="text-[#4A8FE0]/60" />

          {/* Headline */}
          <div>
            <h3 className="text-[15px] font-bold tracking-tight text-[#EAEAF0]">
              {lockedCount} more lead{lockedCount !== 1 ? 's' : ''} found
              {location ? <span className="text-[#82829A]"> in {location}</span> : ''}
            </h3>
            <p className="mt-1.5 max-w-[280px] text-xs leading-relaxed text-[#82829A]">
              Agencies using SignalScope find 3–5 high-fit leads per city search — these are yours if you unlock them.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex w-full flex-col items-center gap-2.5">
            <Link
              to="/waitlist"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A8FE0] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3A7CC8]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/waitlist"
              className="text-xs font-medium text-[#82829A] transition-colors hover:text-[#EAEAF0]"
            >
              Join waitlist instead →
            </Link>
          </div>

          <p className="text-[10px] text-[#424258]">No card required · Early access pricing</p>
        </div>
      </div>
    </div>
  )
}
