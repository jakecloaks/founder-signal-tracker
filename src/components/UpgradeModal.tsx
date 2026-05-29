import { X, Check, Zap, Star } from 'lucide-react'

interface UpgradeModalProps {
  onClose: () => void
  onUpgrade?: () => void
}

const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For freelancers and solo operators',
    searches: '20 searches/month',
    highlighted: false,
    features: ['20 searches/month', 'Full business profiles', 'AI fit scoring', 'Outreach recommendations', 'Saved leads (50)'],
    cta: 'Get Starter',
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For agencies actively prospecting',
    searches: 'Unlimited searches',
    highlighted: true,
    features: ['Unlimited searches', 'Full AI insights + analysis', 'Contact channel scoring', 'Lead exports (CSV)', 'Saved leads (unlimited)', 'Collections & notes', 'Priority support'],
    cta: 'Get Pro',
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For growing teams with multiple clients',
    searches: 'Unlimited everything',
    highlighted: false,
    features: ['Everything in Pro', 'Up to 5 team members', 'Bulk analysis mode', 'Advanced filters', 'White-label reports', 'Dedicated account manager'],
    cta: 'Get Agency',
  },
]

export function UpgradeModal({ onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} aria-label="Close" />
      <div
        className="slide-up relative z-10 w-full max-w-4xl overflow-y-auto rounded-2xl border border-[#2A2A2A] bg-[#111] max-h-[92vh]"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        <div className="border-b border-[#1E1E1E] px-6 py-5">
          <button type="button" onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-[#555] hover:bg-[#1A1A1A] hover:text-[#888] transition-colors">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4A90E2]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAFAF9] tracking-tight">Upgrade SignalScope</h2>
              <p className="text-sm text-[#888]">Unlock unlimited searches and full AI insights</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-xl border ${
                plan.highlighted
                  ? 'border-[#4A90E2]/40 bg-[#4A90E2]/5'
                  : 'border-[#2A2A2A] bg-[#1A1A1A]'
              }`}
            >
              {plan.highlighted && (
                <div className="flex items-center justify-center gap-1 border-b border-[#4A90E2]/20 bg-[#4A90E2]/10 px-5 py-1.5">
                  <Star className="h-3 w-3 fill-[#4A90E2] text-[#4A90E2]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A90E2]">Most popular</span>
                </div>
              )}
              <div className="p-5">
                <p className="font-bold text-[#FAFAF9]">{plan.name}</p>
                <p className="mt-0.5 text-xs text-[#888]">{plan.description}</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-3xl font-bold text-[#FAFAF9]">${plan.price}</span>
                  <span className="mb-0.5 text-sm text-[#555]">/mo</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-[#4A90E2]">{plan.searches}</p>
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#888]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4A90E2]" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onUpgrade ?? onClose}
                  className={`mt-5 w-full rounded-lg py-2.5 text-sm font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-[#4A90E2] text-white hover:bg-[#3D7CC9]'
                      : 'bg-[#1E1E1E] text-[#FAFAF9] hover:bg-[#252525] border border-[#2A2A2A]'
                  }`}
                >
                  {plan.cta}
                </button>
                {plan.highlighted && (
                  <p className="mt-2 text-center text-[11px] text-[#555]">7-day free trial included</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#1E1E1E] bg-[#0D0D0D] px-6 py-4 text-center text-xs text-[#555]">
          Cancel anytime · No long-term contracts · Questions? hello@signalscope.app
        </div>
      </div>
    </div>
  )
}
