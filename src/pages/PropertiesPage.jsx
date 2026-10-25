import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FormField, { inputClass } from '../components/ui/FormField'
import PageIntro from '../components/ui/PageIntro'
import PropertyGrid from '../components/properties/PropertyGrid'
import { useI18n } from '../context/I18nContext'
import { useApp } from '../context/AppContext'
import { propertyTypes } from '../data/properties'
import { defaultFilters, filterProperties, hasInvalidPriceRange, readPropertyFilters } from '../utils/propertyFilters'

const PAGE_SIZE = 9

export default function PropertiesPage() {
  const { t, language } = useI18n()
  const { properties } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => readPropertyFilters(searchParams))
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [invalidPriceRange, setInvalidPriceRange] = useState(() => hasInvalidPriceRange(readPropertyFilters(searchParams)))

  useEffect(() => {
    const next = readPropertyFilters(searchParams)
    setFilters(next)
    setInvalidPriceRange(hasInvalidPriceRange(next))
    setVisible(PAGE_SIZE)
  }, [searchParams])

  const matches = useMemo(() => filterProperties(properties, filters, language), [filters, language, properties])

  function update(key, value) {
    const next = { ...filters, [key]: value }
    setFilters(next)
    setInvalidPriceRange(hasInvalidPriceRange(next))
  }
  function apply(event) {
    event.preventDefault()
    if (hasInvalidPriceRange(filters)) { setInvalidPriceRange(true); return }
    setInvalidPriceRange(false)
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => { if (value && !(key === 'sort' && value === 'recommended')) params.set(key, value) })
    setSearchParams(params)
    setVisible(PAGE_SIZE)
  }
  function clear() {
    setInvalidPriceRange(false)
    setFilters({ ...defaultFilters })
    setSearchParams({})
    setVisible(PAGE_SIZE)
  }

  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <PageIntro eyebrow={t('listings.eyebrow')} title={t('listings.title')} text={t('listings.intro')} />
    <form onSubmit={apply} className="mt-9 rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-xl font-semibold text-ink">{t('listings.filterTitle')}</h2><button type="button" onClick={clear} className="rounded px-2 py-1 text-xs font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{t('listings.clearFilters')}</button></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField id="filter-q" label={t('listings.searchLabel')} className="sm:col-span-2"><input id="filter-q" value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder={t('listings.searchPlaceholder')} className={inputClass} /></FormField>
        <FormField id="filter-location" label={t('listings.location')}><input id="filter-location" value={filters.location} onChange={(event) => update('location', event.target.value)} placeholder={t('listings.locationPlaceholder')} className={inputClass} /></FormField>
        <FormField id="filter-type" label={t('listings.type')}><select id="filter-type" value={filters.type} onChange={(event) => update('type', event.target.value)} className={inputClass}><option value="">{t('home.anyType')}</option>{propertyTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}</select></FormField>
        <FormField id="filter-purpose" label={t('listings.purpose')}><select id="filter-purpose" value={filters.purpose} onChange={(event) => update('purpose', event.target.value)} className={inputClass}><option value="">{t('listings.anyPurpose')}</option><option value="sale">{t('purposes.sale')}</option><option value="rent">{t('purposes.rent')}</option></select></FormField>
        <FormField id="filter-min" label={t('listings.minPrice')}><input id="filter-min" type="number" dir="ltr" min="0" value={filters.min} onChange={(event) => update('min', event.target.value)} placeholder="EGP" className={inputClass} /></FormField>
        <FormField id="filter-max" label={t('listings.maxPrice')}><input id="filter-max" type="number" dir="ltr" min="0" value={filters.max} onChange={(event) => update('max', event.target.value)} placeholder="EGP" className={inputClass} /></FormField>
        <FormField id="filter-beds" label={t('listings.minBeds')}><select id="filter-beds" value={filters.beds} onChange={(event) => update('beds', event.target.value)} className={inputClass}><option value="">{t('listings.anyBeds')}</option>{[1, 2, 3, 4, 5].map((beds) => <option key={beds} value={beds}>{beds}+</option>)}</select></FormField>
        <FormField id="filter-sort" label={t('listings.sort')}><select id="filter-sort" value={filters.sort} onChange={(event) => update('sort', event.target.value)} className={inputClass}><option value="recommended">{t('listings.recommended')}</option><option value="price-asc">{t('listings.priceLow')}</option><option value="price-desc">{t('listings.priceHigh')}</option><option value="newest">{t('listings.newest')}</option></select></FormField>
      </div>
      {invalidPriceRange && <p className="mt-4 text-sm text-red-700" role="alert">{t('listings.priceError')}</p>}
      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500" aria-live="polite">{t('listings.count', { count: matches.length })}</p><Button type="submit" className="w-full sm:w-auto">{t('common.apply')}</Button></div>
    </form>

    <section className="mt-8" aria-label={t('nav.properties')}>
      {matches.length ? <>
        <PropertyGrid properties={matches.slice(0, visible)} />
        {matches.length > PAGE_SIZE && <div className="mt-8 flex flex-col items-center gap-3"><p className="text-xs text-slate-500">{visible >= matches.length ? t('listings.loadedAll') : t('common.showing', { count: Math.min(visible, matches.length), total: matches.length })}</p>{visible < matches.length && <Button type="button" variant="secondary" onClick={() => setVisible((count) => count + PAGE_SIZE)}>{t('listings.loadMore')}</Button>}</div>}
      </> : <EmptyState title={t('listings.emptyTitle')} text={t('listings.emptyText')}><Button type="button" onClick={clear}>{t('common.clear')}</Button></EmptyState>}
    </section>
  </main>
}
