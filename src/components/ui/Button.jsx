import { Link } from 'react-router-dom'

const base = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-ink text-white hover:bg-forest',
  secondary: 'border border-line bg-white text-ink hover:border-sage hover:bg-sand',
  ghost: 'text-forest hover:bg-sand',
  clay: 'bg-clay text-white hover:bg-[#875034]',
}

export default function Button({ as = 'button', variant = 'primary', className = '', children, ...props }) {
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`
  if (as === 'link') return <Link className={classes} {...props}>{children}</Link>
  return <button className={classes} {...props}>{children}</button>
}
