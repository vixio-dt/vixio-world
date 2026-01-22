import { type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  placeholder?: string
  error?: boolean
}

export function Select({
  options,
  placeholder,
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'appearance-none bg-no-repeat bg-right',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-slate-300 dark:border-slate-600',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundSize: '1.5em 1.5em',
        backgroundPosition: 'right 0.5em center',
        paddingRight: '2.5em',
      }}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
