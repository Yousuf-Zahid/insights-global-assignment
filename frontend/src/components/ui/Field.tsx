import { useId, type ReactNode } from 'react'

export const CONTROL_CLASSES =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm ' +
  'placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-1 ' +
  'focus-visible:outline-indigo-600 aria-[invalid=true]:border-red-500'

interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: (control: FieldControlProps) => ReactNode
}

/** Label + hint/error wrapper that hands the wiring (id, aria-*) to the actual control. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': messageId,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <p id={messageId} className="text-sm text-red-600">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={messageId} className="text-sm text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}
