'use client'

import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { height: 28 },
    md: { height: 36 },
    lg: { height: 48 },
  }

  const h = sizes[size].height

  if (!showText) {
    return (
      <div style={{ width: h, height: h, overflow: 'hidden', flexShrink: 0 }}>
        <Image
          src="/locus_white.png"
          alt="Locus"
          width={h * 6}
          height={h}
          priority
          style={{
            height: h,
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
      </div>
    )
  }

  return (
    <Image
      src="/locus_white.png"
      alt="Locus"
      width={Math.round(h * 5.2)}
      height={h}
      priority
      style={{
        height: h,
        width: 'auto',
        objectFit: 'contain',
        objectPosition: 'left center',
      }}
    />
  )
}
