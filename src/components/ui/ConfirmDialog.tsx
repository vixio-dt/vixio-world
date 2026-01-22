import { Modal, ModalFooter } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger'
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-amber-100 dark:bg-amber-900/30'
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${
              variant === 'danger' ? 'text-red-600' : 'text-amber-600'
            }`}
          />
        </div>
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">{message}</p>
      </div>
      <ModalFooter className="justify-center">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
