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
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="16" y1="18" x2="48" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="50%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="shadowGrad" x1="24" y1="30" x2="42" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>
        <linearGradient id="dollarGrad" x1="28" y1="4" x2="36" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Main 3D geometric shape — back face (darker) */}
      <path
        d="M32 28L48 58H32L16 58Z"
        fill="url(#shadowGrad)"
      />

      {/* Main 3D geometric shape — front face (lighter teal) */}
      <path
        d="M32 22L48 56H16Z"
        fill="url(#bodyGrad)"
      />

      {/* Highlight fold on the left face for 3D depth */}
      <path
        d="M32 22L16 56H28L32 38Z"
        fill="url(#shadowGrad)"
        opacity="0.45"
      />

      {/* Inner lighter triangle detail */}
      <path
        d="M32 34L40 50H24Z"
        fill="white"
        opacity="0.12"
      />

      {/* Dollar sign */}
      <text
        x="32"
        y="20"
        textAnchor="middle"
        dominantBaseline="auto"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="20"
        fill="url(#dollarGrad)"
      >
        $
      </text>
    </svg>
  )
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 40, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { icon: 52, text: 'text-4xl', gap: 'gap-3' },
  }

  return (
    <div className={`flex items-center ${sizes[size].gap}`}>
      <LocusIcon size={sizes[size].icon} />
      {showText && (
        <span
          className={`font-extrabold ${sizes[size].text} tracking-tight`}
          style={{
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Locus
        </span>
      )}
    </div>
  )
}
