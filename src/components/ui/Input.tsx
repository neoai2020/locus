'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-burst-text)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-burst-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[rgba(255,255,255,0.03)] border border-[var(--color-burst-border)] 
              rounded-xl py-3 px-4 text-[var(--color-burst-text)] text-sm
              placeholder:text-[var(--color-burst-muted)]
              focus:outline-none focus:border-[var(--color-burst-purple)] 
              focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]
              transition-all duration-300
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-[var(--color-burst-error)]' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-burst-error)]">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
