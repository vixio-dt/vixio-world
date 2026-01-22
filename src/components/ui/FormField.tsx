import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-slate-300 dark:border-slate-600',
        className
      )}
      {...props}
    />
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'resize-none',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-slate-300 dark:border-slate-600',
        className
      )}
      rows={3}
      {...props}
    />
  )
}
