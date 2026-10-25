import { useEffect, useRef, useState } from 'react'
import { Heart, Home, Menu, Plus, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import { useApp } from '../../context/AppContext'

function LanguageButton() {
  const { language, setLanguage, t } = useI18n()
  const next = language === 'en' ? 'ar' : 'en'
  return <button type="button" onClick={() => setLanguage(next)} className="rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-forest transition hover:border-sage hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-label={language === 'en' ? t('nav.switchToArabic') : t('nav.switchToEnglish')}>
    {language === 'en' ? t('nav.switchToArabic') : t('nav.switchToEnglish')}
  </button>
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const { t } = useI18n()
  const { favorites } = useApp()
  const location = useLocation()
  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/properties', label: t('nav.properties') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]
  const linkClass = ({ isActive }) => `rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${isActive ? 'text-ink' : 'text-slate-600 hover:text-ink'}`
  const closeMenu = () => setOpen(false)

  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setOpen(false); requestAnimationFrame(() => menuButtonRef.current?.focus()) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return <header className="sticky top-0 z-40 border-b border-line/80 bg-white/95 backdrop-blur-xl">
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" onClick={closeMenu} className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-label={t('brand.name')}>
        <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-ink text-white transition group-hover:bg-forest"><Home size={19} strokeWidth={1.8} aria-hidden="true" /></span>
        <span className="leading-tight"><span className="block text-[17px] font-bold tracking-tight text-ink">{t('brand.name')}</span><span className="mt-0.5 block text-[10px] tracking-wide text-slate-500">{t('brand.tagline')}</span></span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.mainNavigation')}>
        {links.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>{item.label}</NavLink>)}
        <NavLink to="/favorites" className={({ isActive }) => `${linkClass({ isActive })} inline-flex items-center gap-2`} aria-label={`${t('nav.favorites')}, ${t('nav.savedCount', { count: favorites.length })}`}>
          <Heart size={16} aria-hidden="true" />{t('nav.favorites')}<span className="grid h-5 min-w-5 place-items-center rounded-full bg-sand px-1 text-[10px] text-forest"><bdi dir="ltr">{favorites.length}</bdi></span>
        </NavLink>
      </nav>

      <div className="hidden items-center gap-3 lg:flex">
        <LanguageButton />
        <Link to="/add-property" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"><Plus size={16} aria-hidden="true" />{t('nav.list')}</Link>
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <LanguageButton />
        <button ref={menuButtonRef} type="button" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}>
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>
    </div>
    <nav id="mobile-navigation" hidden={!open} className="border-t border-line bg-white px-4 pb-5 pt-3 lg:hidden" aria-label={t('nav.mobileNavigation')}>
      <div className="mx-auto grid max-w-7xl gap-1">
        {links.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={closeMenu} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${isActive ? 'bg-sand text-ink' : 'text-slate-600 hover:bg-sand'}`}>{item.label}</NavLink>)}
        <NavLink to="/favorites" onClick={closeMenu} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"><span className="flex items-center gap-2"><Heart size={17} aria-hidden="true" />{t('nav.favorites')}</span><span><bdi dir="ltr">{favorites.length}</bdi></span></NavLink>
        <Link to="/add-property" onClick={closeMenu} className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"><Plus size={16} aria-hidden="true" />{t('nav.list')}</Link>
      </div>
    </nav>
  </header>
}
