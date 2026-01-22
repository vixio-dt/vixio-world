import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'sky' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'slate'
  size?: 'sm' | 'md'
  className?: string
}

const variantClasses = {
  default: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  )
}
