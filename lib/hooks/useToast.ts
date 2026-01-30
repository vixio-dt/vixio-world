'use client'

import { useState, useCallback, createContext, useContext } from 'react'
import type { ToastMessage, ToastType } from '@/components/ui/Toast'

interface ToastContextValue {
  toasts: ToastMessage[]
  addToast: (type: ToastType, message: string) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function useToastState() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, addToast, dismissToast }
}
