import type { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

// Shared by LoginPage and RegisterPage so the label+input+styling only
// exists once. Any extra prop (type, value, onChange, ...) passes straight
// through to the underlying <input> via InputHTMLAttributes.
export function FormInput({ label, id, ...inputProps }: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
        {...inputProps}
      />
    </div>
  )
}
