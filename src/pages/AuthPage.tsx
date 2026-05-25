import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Radar, ArrowRight, Eye, EyeOff } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // UI-only auth — just navigate to dashboard
    navigate('/dashboard')
  }

  const inputClass =
    'w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all'

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 shadow-sm">
              <Radar className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-stone-900">SignalScope</span>
          </Link>
          <Link to="/" className="text-xs text-stone-500 hover:text-stone-900 transition-colors">
            ← Back to home
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
            {(['signup', 'login'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === m
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold text-stone-900">
              {mode === 'signup' ? 'Start finding prospects' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {mode === 'signup'
                ? '5 free searches included. No credit card needed.'
                : 'Sign in to your SignalScope workspace.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-600">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-600">Email</label>
                <input
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-600">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md"
              >
                {mode === 'signup' ? 'Create free account' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-100" />
              <span className="text-xs text-stone-400">or continue with</span>
              <div className="h-px flex-1 bg-stone-100" />
            </div>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-all hover:bg-stone-50 hover:border-stone-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {mode === 'login' && (
              <p className="mt-4 text-center text-xs text-stone-400">
                <button type="button" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Forgot password?
                </button>
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-stone-400">
            {mode === 'signup'
              ? 'Already have an account? '
              : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              {mode === 'signup' ? 'Sign in' : 'Create one free'}
            </button>
          </p>

          <p className="mt-3 text-center text-[11px] text-stone-400">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
