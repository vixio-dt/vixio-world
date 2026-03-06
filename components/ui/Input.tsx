'use client'

import { forwardRef } from 'react'
import { TextInput, type ElementProps, type TextInputProps } from '@mantine/core'

export interface InputProps
  extends TextInputProps,
    ElementProps<'input', keyof TextInputProps> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => <TextInput ref={ref} {...props} />
)
Input.displayName = 'Input'

export { Input }
