'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { NativeSelect } from '@mantine/core'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, value, onChange, name, required, disabled, ...props }, ref) => {
    // Add blank first option "Select..." with value ""
    const data = [
      { value: '', label: 'Select...' },
      ...options
    ]

    return (
      <NativeSelect
        ref={ref}
        id={id}
        label={label}
        error={error}
        data={data}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
        className={className}
        {...props}
      />
    )
  }
)
Select.displayName = 'Select'

export { Select }
