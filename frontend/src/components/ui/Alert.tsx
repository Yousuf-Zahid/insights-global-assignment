import { CircleAlert, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { classNames } from '../../lib/classNames'

type AlertVariant = 'error' | 'warning' | 'info'

interface AlertProps {
  variant: AlertVariant
  title: string
  children?: ReactNode
  className?: string
}

interface VariantConfig {
  icon: LucideIcon
  classes: string
  live: 'assertive' | 'polite'
}

const VARIANTS: Record<AlertVariant, VariantConfig> = {
  error: { icon: CircleAlert, classes: 'border-red-200 bg-red-50 text-red-900', live: 'assertive' },
  warning: {
    icon: TriangleAlert,
    classes: 'border-amber-200 bg-amber-50 text-amber-900',
    live: 'polite',
  },
  info: { icon: Info, classes: 'border-sky-200 bg-sky-50 text-sky-900', live: 'polite' },
}

export function Alert({ variant, title, children, className }: AlertProps) {
  const { icon: Icon, classes, live } = VARIANTS[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={live}
      className={classNames('flex gap-3 rounded-lg border p-4', classes, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1 text-sm">
        <p className="font-semibold">{title}</p>
        {children}
      </div>
    </div>
  )
}
