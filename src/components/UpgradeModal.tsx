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
    color: 'border-stone-200',
    headerBg: 'bg-stone-50',
    features: [
      '20 searches/month',
      'Full business profiles',
      'AI fit scoring',
      'Outreach recommendations',
      'Saved leads (up to 50)',
    ],
    cta: 'Get Starter',
    ctaStyle: 'bg-stone-900 text-white hover:bg-stone-800',
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For agencies actively prospecting',
    searches: 'Unlimited searches',
    color: 'border-indigo-300',
    headerBg: 'bg-indigo-600',
    highlighted: true,
    features: [
      'Unlimited searches',
      'Full AI insights + analysis',
      'Contact channel scoring',
      'Lead exports (CSV)',
      'Saved leads (unlimited)',
      'Collections & notes',
      'Priority support',
    ],
    cta: 'Get Pro',
    ctaStyle: 'bg-indigo-600 text-white hover:bg-indigo-500',
  },
  {
    name: 'Agency',
    price: 99,
    description: 'For growing teams with multiple clients',
    searches: 'Unlimited everything',
    color: 'border-stone-200',
    headerBg: 'bg-stone-50',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Bulk analysis mode',
      'Advanced filters',
      'White-label reports',
      'Dedicated account manager',
    ],
    cta: 'Get Agency',
    ctaStyle: 'bg-stone-900 text-white hover:bg-stone-800',
  },
]

export function UpgradeModal({ onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="slide-up relative z-10 w-full max-w-4xl overflow-y-auto rounded-2xl border border-stone-200 bg-white shadow-2xl max-h-[92vh]"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}
      >
        <div className="border-b border-stone-100 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Upgrade SignalScope</h2>
              <p className="text-sm text-stone-500">Unlock unlimited searches and full AI insights</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-xl border ${plan.color} ${
                plan.highlighted ? 'shadow-lg shadow-indigo-500/10' : 'shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Most popular
                </div>
              )}

              <div className={`px-5 py-4 ${plan.headerBg}`}>
                <p className={`text-sm font-bold ${plan.highlighted ? 'text-white' : 'text-stone-900'}`}>
                  {plan.name}
                </p>
                <p className={`mt-0.5 text-xs ${plan.highlighted ? 'text-indigo-200' : 'text-stone-500'}`}>
                  {plan.description}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-stone-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={`mb-0.5 text-sm ${plan.highlighted ? 'text-indigo-200' : 'text-stone-400'}`}>
                    /mo
                  </span>
                </div>
              </div>

              <div className="px-5 py-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-stone-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={onUpgrade ?? onClose}
                  className={`mt-4 w-full rounded-lg py-2 text-sm font-semibold transition-colors ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </button>
                {plan.highlighted && (
                  <p className="mt-2 text-center text-[11px] text-stone-400">7-day free trial included</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-100 bg-stone-50 px-6 py-4 text-center text-xs text-stone-400">
          Cancel anytime · No long-term contracts · Questions? hello@signalscope.app
        </div>
      </div>
    </div>
  )
}
