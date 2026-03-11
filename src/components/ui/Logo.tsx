'use client'

import { Crosshair } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 40, text: 'text-3xl' },
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] blur-lg opacity-50" />
        <div className="relative bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-cyan)] p-2 rounded-xl">
          <Crosshair size={sizes[size].icon} className="text-white" fill="white" />
        </div>
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} gradient-text`} style={{ fontFamily: 'var(--font-display)' }}>
          Locus
        </span>
      )}
    </div>
  )
}
