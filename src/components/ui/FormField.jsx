export default function FormField({ id, label, error, hint, children, className = '' }) {
  return <div className={`grid gap-2 ${className}`}>
    <label htmlFor={id} className="text-sm font-semibold text-ink">{label}</label>
    {children}
    {error && <p id={`${id}-error`} className="text-sm text-red-700" role="alert">{error}</p>}
    {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
}

export const inputClass = 'min-h-12 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-sage focus:ring-2 focus:ring-sage/15'
