import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, debounceMs, onChange, value])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-8 py-2 rounded-lg border border-slate-300 dark:border-slate-600',
          'bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
          'placeholder:text-slate-400 dark:placeholder:text-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent'
        )}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
