interface SignalIconProps {
  size?: number
  className?: string
}

/** Radar/signal SVG icon */
export function SignalIcon({ size = 20, className = '' }: SignalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="3.5" cy="16.5" r="2" fill="#4A8FE0" />
      <path
        d="M3.5 11.5 C6.8 11.5 9.5 14.2 9.5 17.5"
        stroke="#4A8FE0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3.5 7 C9.5 7 14.5 12 14.5 18"
        stroke="#4A8FE0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M3.5 2.5 C12.2 2.5 19 9.3 19 18"
        stroke="#4A8FE0"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  )
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'horizontal' | 'icon-only'
  dark?: boolean
}

export function SignalScopeLogo({ size = 'md', variant = 'horizontal', dark = true }: LogoProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 28
  const textClass =
    size === 'sm' ? 'text-sm font-bold tracking-[-0.015em]' :
    size === 'md' ? 'text-[15px] font-bold tracking-[-0.02em]' :
    'text-xl font-bold tracking-[-0.025em]'
  const textColor = dark ? 'text-[#EAEAF0]' : 'text-[#0C0C10]'

  if (variant === 'icon-only') return <SignalIcon size={iconSize} />

  return (
    <div className="flex items-center gap-2">
      <SignalIcon size={iconSize} />
      <span className={`${textClass} ${textColor}`}>SignalScope</span>
    </div>
  )
}
