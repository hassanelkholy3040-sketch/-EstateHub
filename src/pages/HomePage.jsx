import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpLeft, ArrowUpRight, Building2, Home, Landmark, Search, Store, Trees, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import FormField, { inputClass } from '../components/ui/FormField'
import PropertyGrid from '../components/properties/PropertyGrid'
import { useI18n } from '../context/I18nContext'
import { useApp } from '../context/AppContext'
import { propertyTypes } from '../data/properties'

const categories = [
  { type: 'apartment', icon: Building2 }, { type: 'house', icon: Home }, { type: 'villa', icon: Trees }, { type: 'townhouse', icon: Landmark }, { type: 'commercial', icon: Store },
]

export default function HomePage() {
  const { t, isRTL } = useI18n()
  const { properties } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ location: '', type: '', purpose: '', min: '', max: '' })
  const [error, setError] = useState('')
  const featured = useMemo(() => properties.filter((item) => item.featured).slice(0, 3), [properties])
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); setError('') }
  function search(event) {
    event.preventDefault()
    if (form.min && form.max && Number(form.min) > Number(form.max)) { setError(t('home.priceError')); return }
    const params = new URLSearchParams()
    Object.entries(form).forEach(([key, value]) => { if (value) params.set(key === 'min' ? 'min' : key === 'max' ? 'max' : key, value) })
    const query = params.toString()
    navigate(`/properties${query ? `?${query}` : ''}`)
  }

  return <main id="main-content" tabIndex="-1">
    <section className="relative isolate min-h-[630px] overflow-hidden bg-ink sm:min-h-[660px]">
      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88" alt={t('home.heroAlt')} className="absolute inset-0 -z-20 h-full w-full object-cover object-center" fetchpriority="high" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d1c19]/90 via-[#142722]/70 to-[#142722]/20 rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d1c19]/55 via-transparent to-black/10" />
      <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:min-h-[660px] lg:px-8">
        <div className="max-w-3xl text-white">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur"><Sparkles size={14} className="text-[#e4b491]" aria-hidden="true" />{t('home.eyebrow')}</p>
          <h1 className="font-display max-w-[14ch] text-5xl font-medium leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">{t('home.headline')}</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/78 sm:text-lg">{t('home.subhead')}</p>
        </div>
        <form onSubmit={search} className="mt-10 rounded-[1.75rem] bg-white p-4 shadow-2xl shadow-black/15 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_.8fr_.8fr_auto] lg:items-end">
            <FormField id="home-location" label={t('home.location')} className="sm:col-span-2 lg:col-span-1">
              <input id="home-location" value={form.location} onChange={(event) => update('location', event.target.value)} placeholder={t('home.locationPlaceholder')} className={inputClass} />
            </FormField>
            <FormField id="home-type" label={t('home.type')}>
              <select id="home-type" value={form.type} onChange={(event) => update('type', event.target.value)} className={inputClass}><option value="">{t('home.anyType')}</option>{propertyTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}</select>
            </FormField>
            <FormField id="home-purpose" label={t('home.purpose')}>
              <select id="home-purpose" value={form.purpose} onChange={(event) => update('purpose', event.target.value)} className={inputClass}><option value="">{t('home.anyPurpose')}</option><option value="sale">{t('purposes.sale')}</option><option value="rent">{t('purposes.rent')}</option></select>
            </FormField>
            <FormField id="home-min" label={t('home.minPrice')}>
              <input id="home-min" type="number" dir="ltr" min="0" inputMode="numeric" value={form.min} onChange={(event) => update('min', event.target.value)} placeholder="EGP" className={inputClass} />
            </FormField>
            <FormField id="home-max" label={t('home.maxPrice')}>
              <input id="home-max" type="number" dir="ltr" min="0" inputMode="numeric" value={form.max} onChange={(event) => update('max', event.target.value)} placeholder="EGP" className={inputClass} />
            </FormField>
            <Button type="submit" className="h-12 w-full whitespace-nowrap px-5 lg:w-auto"><Search size={17} aria-hidden="true" />{t('home.search')}</Button>
          </div>
          {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        </form>
        <p className="mt-4 text-xs text-white/70">{t('home.searchNote')}</p>
      </div>
      <span className="absolute bottom-4 end-4 hidden rounded-full bg-ink/85 px-3 py-1.5 text-[10px] text-white sm:block">{t('home.photoCredit')}</span>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-clay">{t('home.featuredEyebrow')}</p><h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('home.featuredTitle')}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t('home.featuredIntro')}</p></div>
        <Button as="link" to="/properties" variant="secondary" className="w-fit">{t('common.viewAll')} <Arrow size={16} aria-hidden="true" /></Button>
      </div>
      <PropertyGrid properties={featured} />
    </section>

    <section className="bg-sand/75 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-clay">{t('home.categoriesEyebrow')}</p><h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t('home.categoriesTitle')}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t('home.categoryIntro')}</p></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ type, icon: Icon }) => <button key={type} type="button" onClick={() => navigate(`/properties?type=${type}`)} className="group flex min-h-36 flex-col items-start justify-between rounded-[1.5rem] border border-line bg-white p-5 text-start transition hover:-translate-y-1 hover:border-sage hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest sm:min-h-40 sm:p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand text-forest transition group-hover:bg-ink group-hover:text-white"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span><span className="mt-5 flex w-full items-center justify-between gap-2 text-sm font-semibold text-ink">{t(`types.${type}`)}<Arrow size={15} className="text-sage transition group-hover:-translate-y-0.5" aria-hidden="true" /></span></button>)}
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8">
      <div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-clay">{t('home.whyEyebrow')}</p><h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{t('home.whyTitle')}</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-600">{t('home.whyIntro')}</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item} className="rounded-[1.5rem] border border-line bg-white p-5 sm:p-6"><span className="font-display text-3xl font-semibold text-clay">0{item}</span><h3 className="mt-5 font-display text-lg font-semibold text-ink">{t(`home.benefit${item}Title`)}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{t(`home.benefit${item}Text`)}</p></div>)}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-forest px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
        <div className="absolute -end-10 -top-20 h-64 w-64 rounded-full border border-white/10" /><div className="absolute -end-2 -top-12 h-48 w-48 rounded-full border border-white/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><h2 className="font-display text-3xl font-semibold sm:text-4xl">{t('home.ctaTitle')}</h2><p className="mt-3 text-sm leading-7 text-white/75">{t('home.ctaText')}</p></div><div className="flex flex-wrap gap-3"><Button as="link" to="/properties" variant="secondary" className="border-white bg-white text-ink hover:bg-sand">{t('common.explore')} <Arrow size={16} aria-hidden="true" /></Button><Button as="link" to="/add-property" variant="clay">{t('nav.list')}</Button></div></div>
      </div>
    </section>
  </main>
}
