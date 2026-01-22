'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  options: SelectOption[]
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-burst-text)] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full appearance-none bg-[rgba(255,255,255,0.03)] border border-[var(--color-burst-border)] 
              rounded-xl py-3 px-4 pr-10 text-[var(--color-burst-text)] text-sm
              focus:outline-none focus:border-[var(--color-burst-purple)] 
              focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]
              transition-all duration-300 cursor-pointer
              ${error ? 'border-[var(--color-burst-error)]' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[var(--color-burst-card)]">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-burst-muted)] pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-burst-error)]">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
