'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { Textarea as MantineTextarea } from '@mantine/core'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows, ...props }, ref) => {
    return (
      <MantineTextarea
        ref={ref}
        id={id}
        label={label}
        error={error}
        minRows={rows}
        className={className}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
