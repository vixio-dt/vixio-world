'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
}

const styles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
}

const iconStyles: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-sky-500',
}

function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[toast.type]} animate-slide-in`}
    >
      <Icon className={`w-5 h-5 ${iconStyles[toast.type]}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-black/5 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  const [mounted, setMounted] = useState(false)

  // Using layoutEffect pattern for SSR hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  )
}
