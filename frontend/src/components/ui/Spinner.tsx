import { LoaderCircle } from 'lucide-react'

import { classNames } from '../../lib/classNames'

interface SpinnerProps {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <LoaderCircle aria-hidden="true" className={classNames('h-4 w-4 animate-spin', className)} />
  )
}
