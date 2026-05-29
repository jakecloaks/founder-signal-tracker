import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variants = {
  primary:
    'bg-[#4A90E2] text-white hover:bg-[#3D7CC9] border border-transparent',
  secondary:
    'bg-[#1A1A1A] text-[#FAFAF9] hover:bg-[#222] border border-[#333]',
  ghost:
    'bg-transparent text-[#888] hover:bg-[#1A1A1A] hover:text-[#FAFAF9] border border-transparent',
  danger:
    'bg-transparent text-red-400 hover:bg-red-500/10 border border-red-500/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
