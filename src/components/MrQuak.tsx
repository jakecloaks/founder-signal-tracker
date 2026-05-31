/**
 * MrQuak — the SignalScope mascot duck.
 * Appears subtly throughout the interface as a moment of personality.
 * Clean SVG, not cartoonish.
 */

interface MrQuakProps {
  size?: number
  className?: string
  /** true = animate with floating effect */
  float?: boolean
}

export function MrQuak({ size = 28, className = '', float = false }: MrQuakProps) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.82)}
      viewBox="0 0 34 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${float ? 'quak-float' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Tail */}
      <path
        d="M4 18 C2 16 2.5 13 4.5 14.5 C4.5 14.5 4 16.5 4 18Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Body */}
      <ellipse cx="14" cy="19" rx="10.5" ry="7" fill="currentColor" />
      {/* Head */}
      <circle cx="23" cy="10" r="6" fill="currentColor" />
      {/* Bill */}
      <path d="M28 9 L33 10.5 L28 12Z" fill="#E8A520" />
      {/* Wing crease — subtle definition */}
      <path
        d="M7 18 C10 14.5 16 14.5 19 17"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eye */}
      <circle cx="25" cy="9" r="1" fill="rgba(0,0,0,0.35)" />
    </svg>
  )
}

/** Inline mascot moment for empty states */
export function MrQuakEmpty({
  title = "Nothing to see here",
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-14 text-center">
      <div className="relative">
        <MrQuak size={48} className="text-[#2A2A42] quak-float" />
      </div>
      <div>
        <p className="text-sm font-semibold text-[#44445C]">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-[#2A2A38]">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

/** Tiny duck mark for footer branding */
export function MrQuakMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <MrQuak size={14} className="text-[#2A2A42]" />
      <span className="text-[10px] font-semibold tracking-wide text-[#2A2A38]">MrQuak</span>
    </span>
  )
}
