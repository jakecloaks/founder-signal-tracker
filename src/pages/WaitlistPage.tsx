import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Zap, Star, Vote, Headphones, ArrowRight } from 'lucide-react'
import { SignalScopeLogo } from '../components/SignalScopeLogo'
import { MrQuak } from '../components/MrQuak'
import { submitWaitlist, getWaitlistCount } from '../services/waitlist'
import type { WaitlistEntry } from '../services/waitlist'

const AGENCY_TYPES = [
  { value: 'solo',    label: 'Solo freelancer' },
  { value: 'small',  label: 'Small team (2–5)' },
  { value: 'mid',    label: 'Growing agency (6–20)' },
  { value: 'large',  label: 'Established agency (20+)' },
]

const REVENUE_RANGES = [
  { value: 'under-2k',   label: 'Under $2,000 / month' },
  { value: '2k-10k',     label: '$2,000 – $10,000 / month' },
  { value: '10k-50k',    label: '$10,000 – $50,000 / month' },
  { value: 'over-50k',   label: '$50,000+ / month' },
]

const BENEFITS = [
  {
    icon: Zap,
    color: 'text-[#4A8FE0]',
    bg: 'bg-[#4A8FE0]/8 border-[#4A8FE0]/15',
    title: 'Early access',
    desc: 'First in line when we open to new agencies.',
  },
  {
    icon: Star,
    color: 'text-[#E8A520]',
    bg: 'bg-[#E8A520]/8 border-[#E8A520]/15',
    title: 'Founder pricing',
    desc: 'Locked-in rate. Yours for life, no matter what.',
  },
  {
    icon: Vote,
    color: 'text-[#3DCC6E]',
    bg: 'bg-[#3DCC6E]/8 border-[#3DCC6E]/15',
    title: 'Feature voting',
    desc: 'Directly influence what we build next.',
  },
  {
    icon: Headphones,
    color: 'text-[#E07A45]',
    bg: 'bg-[#E07A45]/8 border-[#E07A45]/15',
    title: 'Priority support',
    desc: 'Skip the queue. Real humans, fast answers.',
  },
]

interface FormState extends WaitlistEntry {}

const EMPTY: FormState = { name: '', email: '', agencyType: '', revenue: '' }

export function WaitlistPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ position: number; duplicate: boolean } | null>(null)
  const [apiError, setApiError] = useState('')
  const [count, setCount] = useState<number>(147) // seed count

  useEffect(() => {
    getWaitlistCount().then((n) => setCount(Math.max(n + 140, 140))) // 140 seed offset for social proof
  }, [])

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.agencyType)   e.agencyType = 'Please select your agency type'
    if (!form.revenue)      e.revenue = 'Please select your revenue range'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setApiError('')
    try {
      const res = await submitWaitlist(form)
      setResult({ position: res.position + 140, duplicate: res.duplicate })
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function field(id: keyof FormState) {
    return {
      value: form[id],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [id]: e.target.value }))
        setErrors((er) => ({ ...er, [id]: undefined }))
      },
    }
  }

  const inputClass = (err?: string) =>
    `w-full rounded-lg border bg-[#0C0C10] px-3.5 py-2.5 text-sm text-[#EAEAF0] placeholder-[#424258] outline-none transition-colors focus:border-[#4A8FE0]/50 focus:ring-1 focus:ring-[#4A8FE0]/20 ${
      err ? 'border-[#D95555]/50' : 'border-[#1F1F30] hover:border-[#2A2A42]'
    }`

  return (
    <div className="min-h-screen bg-[#0C0C10] text-[#EAEAF0]">
      {/* Nav */}
      <header className="border-b border-[#1F1F30] bg-[#0C0C10]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <SignalScopeLogo size="md" />
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-sm text-[#82829A] transition-colors hover:text-[#EAEAF0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to demo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">

          {/* ── Left column: Hero + Benefits ───────────────────── */}
          <div>
            {/* Social proof pill */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1F1F30] bg-[#16161D] px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3DCC6E]" />
              <span className="text-xs font-medium text-[#82829A]">
                <span className="font-bold text-[#EAEAF0]">{count}</span> agencies on the waitlist
              </span>
            </div>

            <h1 className="heading-1 text-[#EAEAF0]">
              Get early access<br />
              <span className="text-[#4A8FE0]">to SignalScope</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#82829A]">
              SignalScope is in private beta. We're onboarding web designers and agencies one cohort at a time — starting with the people who helped shape it.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-[#82829A]">
              Join the waitlist and we'll email you when your spot opens. Waitlist members always get founder pricing — locked in for life.
            </p>

            {/* Benefits grid */}
            <div className="mt-10 grid grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className={`rounded-xl border p-4 ${b.bg}`}
                >
                  <div className={`mb-2.5 flex h-7 w-7 items-center justify-center rounded-lg border ${b.bg}`}>
                    <b.icon className={`h-3.5 w-3.5 ${b.color}`} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-semibold text-[#EAEAF0]">{b.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#82829A]">{b.desc}</p>
                </div>
              ))}
            </div>

            {/* MrQuak */}
            <div className="mt-10 flex items-center gap-3 border-t border-[#1F1F30] pt-8">
              <MrQuak size={32} className="text-[#2A2A42]" float />
              <div>
                <p className="text-xs font-semibold text-[#424258]">Built by MrQuak</p>
                <p className="mt-0.5 text-[11px] text-[#2A2A38]">
                  A small team building tools for web agencies that actually work.
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column: Form ──────────────────────────────── */}
          <div>
            <div
              className="rounded-2xl border border-[#1F1F30] bg-[#16161D] p-7"
              style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
            >
              {result ? (
                /* ── Success state ─────────────────────────────── */
                <div className="flex flex-col items-center gap-5 py-8 text-center">
                  <MrQuak size={56} className="text-[#4A8FE0]" float />
                  <div>
                    <div className="mb-3 flex justify-center">
                      <span className="flex items-center gap-1.5 rounded-full border border-[#3DCC6E]/25 bg-[#3DCC6E]/10 px-3 py-1 text-xs font-semibold text-[#3DCC6E]">
                        <Check className="h-3 w-3" />
                        You're on the list
                      </span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-[#EAEAF0]">
                      {result.duplicate ? "You're already on it!" : "Welcome aboard!"}
                    </h2>
                    <p className="mt-2 text-sm text-[#82829A]">
                      {result.duplicate
                        ? `You're already #${result.position} on the waitlist.`
                        : `You're #${result.position} on the waitlist.`}
                    </p>
                    <p className="mt-1 text-xs text-[#424258]">
                      We'll reach out at <span className="text-[#82829A]">{form.email}</span> when your spot opens.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-1.5 rounded-lg bg-[#4A8FE0] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3A7CC8]"
                    >
                      Continue exploring the demo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <p className="text-[11px] text-[#424258]">
                      The full demo is still available while you wait.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Form ──────────────────────────────────────── */
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-[#EAEAF0]">Request early access</h2>
                    <p className="mt-1 text-sm text-[#82829A]">
                      Tell us a bit about your agency so we can prioritize your spot.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Name */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#82829A]">
                        Your name
                      </label>
                      <input
                        type="text"
                        placeholder="Alex Johnson"
                        className={inputClass(errors.name)}
                        autoComplete="name"
                        {...field('name')}
                      />
                      {errors.name && <p className="mt-1 text-[11px] text-[#D95555]">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#82829A]">
                        Work email
                      </label>
                      <input
                        type="email"
                        placeholder="alex@youragency.com"
                        className={inputClass(errors.email)}
                        autoComplete="email"
                        {...field('email')}
                      />
                      {errors.email && <p className="mt-1 text-[11px] text-[#D95555]">{errors.email}</p>}
                    </div>

                    {/* Agency type */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#82829A]">
                        Agency type
                      </label>
                      <select
                        className={inputClass(errors.agencyType)}
                        {...field('agencyType')}
                      >
                        <option value="">Select…</option>
                        {AGENCY_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {errors.agencyType && <p className="mt-1 text-[11px] text-[#D95555]">{errors.agencyType}</p>}
                    </div>

                    {/* Revenue */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-[#82829A]">
                        Monthly revenue
                      </label>
                      <select
                        className={inputClass(errors.revenue)}
                        {...field('revenue')}
                      >
                        <option value="">Select…</option>
                        {REVENUE_RANGES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      {errors.revenue && <p className="mt-1 text-[11px] text-[#D95555]">{errors.revenue}</p>}
                    </div>

                    {/* API error */}
                    {apiError && (
                      <div className="rounded-lg border border-[#D95555]/25 bg-[#D95555]/8 px-3.5 py-2.5 text-xs text-[#D95555]">
                        {apiError}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A8FE0] py-3 text-sm font-bold text-white transition-all hover:bg-[#3A7CC8] disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Joining…
                        </span>
                      ) : (
                        <>
                          Join the Waitlist
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-[#424258]">
                      No spam. One email when you're in. That's it.
                    </p>
                  </form>
                </>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              {[
                '✓  No credit card required',
                '✓  Cancel anytime',
                '✓  Founder pricing locked in',
              ].map((t) => (
                <span key={t} className="text-[11px] text-[#424258]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
