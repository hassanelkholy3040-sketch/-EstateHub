import { ArrowLeft, ArrowRight, Compass } from 'lucide-react'
import Button from '../components/ui/Button'
import { useI18n } from '../context/I18nContext'

export default function NotFoundPage() {
  const { t, isRTL } = useI18n()
  const Arrow = isRTL ? ArrowRight : ArrowLeft
  return <main id="main-content" tabIndex="-1" className="mx-auto flex min-h-[55vh] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
    <span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-sand text-forest"><Compass size={26} aria-hidden="true" /></span>
    <p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-clay">404</p>
    <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{t('notFound.title')}</h1>
    <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">{t('notFound.text')}</p>
    <Button as="link" to="/" className="mt-7"><Arrow size={16} aria-hidden="true" />{t('notFound.action')}</Button>
  </main>
}
