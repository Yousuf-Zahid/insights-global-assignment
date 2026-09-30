import { forwardRef, type InputHTMLAttributes } from 'react'

import { classNames } from '../../lib/classNames'
import { CONTROL_CLASSES, Field } from './Field'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <input
          ref={ref}
          className={classNames(CONTROL_CLASSES, className)}
          {...control}
          {...rest}
        />
      )}
    </Field>
  )
})
