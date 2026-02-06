'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Button as MantineButton } from '@mantine/core'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    // Map variant to Mantine variant and color
    let mantineVariant: 'filled' | 'light' | 'outline' | 'subtle' = 'filled'
    let mantineColor: string | undefined = undefined

    switch (variant) {
      case 'primary':
        mantineVariant = 'filled'
        mantineColor = 'cyan'
        break
      case 'secondary':
        mantineVariant = 'light'
        mantineColor = 'cyan'
        break
      case 'outline':
        mantineVariant = 'outline'
        mantineColor = 'cyan'
        break
      case 'ghost':
        mantineVariant = 'subtle'
        mantineColor = 'cyan'
        break
      case 'destructive':
        mantineVariant = 'filled'
        mantineColor = 'red'
        break
    }

    // Map size to Mantine size
    const mantineSize = size === 'sm' ? 'xs' : size === 'md' ? 'sm' : 'md'

    return (
      <MantineButton
        ref={ref}
        variant={mantineVariant}
        color={mantineColor}
        size={mantineSize}
        className={className}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
