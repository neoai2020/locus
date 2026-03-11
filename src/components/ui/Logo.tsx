'use client'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

function LocusIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rounded square */}
      <rect x="2" y="2" width="44" height="44" rx="10" fill="none" stroke="white" strokeWidth="2.5" />

      {/* Inner circle */}
      <circle cx="24" cy="24" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />

      {/* Upward arrow — growth / money */}
      <path
        d="M24 34V16"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M17 22L24 15L31 22"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Speed lines */}
      <line x1="12" y1="30" x2="18" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="10" y1="35" x2="17" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <line x1="13" y1="25" x2="17" y2="25" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', pad: 'p-1.5' },
    md: { icon: 36, text: 'text-2xl', pad: 'p-1.5' },
    lg: { icon: 48, text: 'text-4xl', pad: 'p-2' },
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] blur-lg opacity-50" />
        <div className={`relative bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] ${sizes[size].pad} rounded-xl`}>
          <LocusIcon size={sizes[size].icon} />
        </div>
      </div>
      {showText && (
        <span
          className={`font-extrabold ${sizes[size].text} tracking-tight`}
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, var(--color-locus-teal), var(--color-locus-cyan), var(--color-locus-emerald))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LOCUS
        </span>
      )}
    </div>
  )
}
