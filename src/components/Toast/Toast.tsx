import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import type { ToastMessage } from '@/context/ToastContext'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type]
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <Icon size={18} />
            <span>{toast.text}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fechar notificação"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
