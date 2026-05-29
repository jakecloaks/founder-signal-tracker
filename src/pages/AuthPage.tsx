import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { SignalScopeLogo } from '../components/SignalScopeLogo'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/dashboard')
  }

  const inputClass =
    'w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#FAFAF9] placeholder:text-[#555] focus:border-[#4A90E2]/50 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/10 transition-all'

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0D0D] text-[#FAFAF9]">
      {/* Nav */}
      <nav className="border-b border-[#1E1E1E] bg-[#111] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <SignalScopeLogo size="md" />
          <Link to="/" className="text-xs text-[#555] hover:text-[#888] transition-colors">← Back to home</Link>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-1">
            {(['signup', 'login'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === m ? 'bg-[#4A90E2] text-white' : 'text-[#888] hover:text-[#FAFAF9]'
                }`}>
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#2A2A2A] bg-[#111] p-6" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            <h1 className="text-xl font-bold text-[#FAFAF9] tracking-tight">
              {mode === 'signup' ? 'Start finding prospects' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-sm text-[#888]">
              {mode === 'signup' ? '5 free searches included. No credit card needed.' : 'Sign in to your SignalScope workspace.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#888]">Name</label>
                  <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#888]">Email</label>
                <input type="email" placeholder="you@agency.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#888]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className={`${inputClass} pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4A90E2] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3D7CC9]">
                {mode === 'signup' ? 'Create free account' : 'Sign in'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#1E1E1E]" />
              <span className="text-xs text-[#555]">or continue with</span>
              <div className="h-px flex-1 bg-[#1E1E1E]" />
            </div>

            <button type="button" onClick={() => navigate('/dashboard')}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] py-2.5 text-sm font-medium text-[#FAFAF9] transition-all hover:bg-[#1E1E1E] hover:border-[#333]">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {mode === 'login' && (
              <p className="mt-4 text-center text-xs text-[#555]">
                <button type="button" className="text-[#4A90E2] hover:text-[#6aaff0] font-medium">Forgot password?</button>
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-[#555]">
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="font-semibold text-[#4A90E2] hover:text-[#6aaff0]">
              {mode === 'signup' ? 'Sign in' : 'Create one free'}
            </button>
          </p>

          <p className="mt-3 text-center text-[11px] text-[#555]">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
