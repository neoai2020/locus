'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'cyan' | 'success' | 'warning' | 'error'
  className?: string
}

export default function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  const variants = {
    purple: 'bg-[rgba(139,92,246,0.15)] text-[var(--color-burst-purple)] border-[rgba(139,92,246,0.3)]',
    cyan: 'bg-[rgba(6,182,212,0.15)] text-[var(--color-burst-cyan)] border-[rgba(6,182,212,0.3)]',
    success: 'bg-[rgba(16,185,129,0.15)] text-[var(--color-burst-success)] border-[rgba(16,185,129,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.15)] text-[var(--color-burst-warning)] border-[rgba(245,158,11,0.3)]',
    error: 'bg-[rgba(239,68,68,0.15)] text-[var(--color-burst-error)] border-[rgba(239,68,68,0.3)]',
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
