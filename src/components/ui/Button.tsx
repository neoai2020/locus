'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
    
    const variants = {
      primary: 'bg-gradient-to-r from-[var(--color-locus-teal)] to-[var(--color-locus-indigo)] text-white border border-[rgba(20,184,166,0.3)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.3)] hover:-translate-y-0.5',
      secondary: 'bg-[rgba(255,255,255,0.05)] border border-[var(--color-locus-border)] text-[var(--color-locus-text)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[var(--color-locus-teal)]',
      ghost: 'text-[var(--color-locus-muted)] hover:text-[var(--color-locus-text)] hover:bg-[rgba(255,255,255,0.05)]',
      danger: 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[var(--color-locus-error)] hover:bg-[rgba(239,68,68,0.25)]',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
