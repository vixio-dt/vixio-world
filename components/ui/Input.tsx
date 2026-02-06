'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { TextInput } from '@mantine/core'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, placeholder, value, onChange, name, type, required, disabled, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        id={id}
        label={label}
        error={error}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className={className}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
