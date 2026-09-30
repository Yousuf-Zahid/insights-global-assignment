import { toast } from 'sonner'

interface NotifyAction {
  label: string
  onClick: () => void
}

interface NotifyErrorOptions {
  description?: string
  action?: NotifyAction
}

export function notifyError(message: string, { description, action }: NotifyErrorOptions = {}) {
  toast.error(message, { description, action })
}
