import { Link } from 'react-router-dom'
import { ArrowUpRight, Home } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

export default function Footer() {
  const { t, language } = useI18n()
  return <footer className="mt-20 bg-ink text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8 lg:py-16">
      <div>
        <Link to="/" className="inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-white/10"><Home size={19} aria-hidden="true" /></span><span className="text-lg font-bold">{t('brand.name')}</span></Link>
        <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">{t('footer.description')}</p>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-white">{t('footer.explore')}</h2>
        <div className="mt-4 grid gap-3 text-sm text-white/65">
          <Link className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" to="/properties">{t('nav.properties')}</Link><Link className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" to="/favorites">{t('nav.favorites')}</Link><Link className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" to="/add-property">{t('nav.list')}</Link>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-white">{t('footer.company')}</h2>
        <div className="mt-4 grid gap-3 text-sm text-white/65">
          <Link className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" to="/about">{t('nav.about')}</Link><Link className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" to="/contact">{t('nav.contact')}</Link>
          <a dir="ltr" className="inline-flex w-fit items-center gap-1.5 rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2" href="mailto:hello@example.test">hello@example.test <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>{t('footer.copyright', { year: new Intl.DateTimeFormat(language, { year: 'numeric' }).format(new Date()) })}</p><p>{t('footer.disclaimer')}</p>
      </div>
    </div>
  </footer>
}
