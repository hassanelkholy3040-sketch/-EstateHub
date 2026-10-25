import { Compass, Heart, Languages, SearchCheck } from 'lucide-react'
import Button from '../components/ui/Button'
import PageIntro from '../components/ui/PageIntro'
import { useI18n } from '../context/I18nContext'

const featureIcons = [SearchCheck, Heart, Languages]

export default function AboutPage() {
  const { t } = useI18n()
  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <section className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">
      <div className="absolute -end-16 -top-20 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -end-4 -top-8 h-48 w-48 rounded-full border border-white/10" />
      <div className="relative max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-[#e3ad88]">{t('about.eyebrow')}</p><h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{t('about.title')}</h1><p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">{t('about.intro')}</p></div>
    </section>
    <section className="grid gap-8 py-14 sm:py-20 lg:grid-cols-[.8fr_1.2fr] lg:gap-16"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sand text-forest"><Compass size={22} aria-hidden="true" /></span><h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{t('about.storyTitle')}</h2></div><p className="max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">{t('about.storyText')}</p></section>
    <section className="rounded-[2rem] bg-sand/70 px-5 py-10 sm:px-8 sm:py-14"><div className="mb-8"><PageIntro eyebrow={t('about.eyebrow')} title={t('about.featureTitle')} /></div><div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => { const Icon = featureIcons[item - 1]; return <article key={item} className="rounded-[1.5rem] border border-line bg-white p-6 sm:p-7"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand text-forest"><Icon size={20} aria-hidden="true" /></span><h3 className="mt-6 font-display text-xl font-semibold text-ink">{t(`about.feature${item}Title`)}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{t(`about.feature${item}Text`)}</p></article>})}</div></section>
    <section className="mt-12 flex flex-col gap-5 rounded-[1.75rem] border border-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9"><div><h2 className="font-display text-2xl font-semibold text-ink">{t('about.ctaTitle')}</h2><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{t('about.ctaText')}</p></div><Button as="link" to="/properties" className="w-fit">{t('common.explore')}</Button></section>
  </main>
}
