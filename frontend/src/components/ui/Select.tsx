import { forwardRef, type SelectHTMLAttributes } from 'react'

import { classNames } from '../../lib/classNames'
import { CONTROL_CLASSES, Field } from './Field'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  options: readonly SelectOption[]
  hint?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, hint, error, className, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(control) => (
        <select ref={ref} className={classNames(CONTROL_CLASSES, className)} {...control} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
})
