export default function PageIntro({ eyebrow, title, text, children, centered = false, as: Heading = 'h1' }) {
  return <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-clay">{eyebrow}</p>}
    <Heading className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">{title}</Heading>
    {text && <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{text}</p>}
    {children}
  </div>
}
