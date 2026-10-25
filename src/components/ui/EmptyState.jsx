import { SearchX } from 'lucide-react'

export default function EmptyState({ title, text, children, as: Heading = 'h2' }) {
  return <div className="flex min-h-72 flex-col items-center justify-center rounded-[2rem] border border-dashed border-line bg-white px-6 py-14 text-center">
    <span className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-sand text-forest"><SearchX size={24} aria-hidden="true" /></span>
    <Heading className="font-display text-2xl font-semibold text-ink">{title}</Heading>
    <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">{text}</p>
    {children && <div className="mt-6">{children}</div>}
  </div>
}
