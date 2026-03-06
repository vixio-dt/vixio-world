'use client'

import { forwardRef } from 'react'
import { NativeSelect, type ElementProps, type NativeSelectProps } from '@mantine/core'

export interface SelectProps
  extends Omit<NativeSelectProps, 'data'>,
    ElementProps<'select', keyof NativeSelectProps | 'data'> {
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => {
    // Add blank first option "Select..." with value ""
    const data = [
      { value: '', label: 'Select...' },
      ...options
    ]

    return (
      <NativeSelect
        ref={ref}
        data={data}
        {...props}
      />
    )
  }
)
Select.displayName = 'Select'

export { Select }
