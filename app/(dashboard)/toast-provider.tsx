'use client'

import { ToastContainer } from '@/components/ui'
import { ToastContext, useToastState } from '@/lib/hooks/useToast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, addToast, dismissToast } = useToastState()

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
