'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'glass'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', hover = true, children, ...props }, ref) => {
    const variants = {
      default: 'bg-[var(--color-burst-card)] border border-[var(--color-burst-border)]',
      glow: 'bg-[var(--color-burst-card)] border border-[var(--color-burst-border)] card-glow',
      glass: 'glass',
    }

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl p-6 transition-all duration-300
          ${variants[variant]}
          ${hover ? 'hover:border-[rgba(139,92,246,0.3)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
