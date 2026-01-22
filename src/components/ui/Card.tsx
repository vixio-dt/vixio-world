import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function Card({ children, className, onClick, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        hoverable && 'hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 border-b border-slate-200 dark:border-slate-700',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-4', className)}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-4 py-3 border-t border-slate-200 dark:border-slate-700',
        className
      )}
    >
      {children}
    </div>
  )
}
