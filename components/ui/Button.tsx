import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500': variant === 'secondary',
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500': variant === 'outline',
            'text-slate-700 hover:bg-slate-100 focus:ring-slate-500': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
