import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Bath, BedDouble, Check, ChevronLeft, ChevronRight, Heart, ImageOff, MapPin, Maximize2, X } from 'lucide-react'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FormField, { inputClass } from '../components/ui/FormField'
import PageIntro from '../components/ui/PageIntro'
import PropertyGrid from '../components/properties/PropertyGrid'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { formatArea, formatDate, formatPrice, localized } from '../utils/format'
import { getFirstInvalidFieldId } from '../utils/forms'
import { getDetailBackTarget, getPropertiesTarget } from '../utils/navigation'

function PhotoGallery({ property, language, t, isRTL }) {
  const [index, setIndex] = useState(null)
  const [failed, setFailed] = useState({})
  const closeRef = useRef(null)
  const triggerRef = useRef(null)
  const images = (property.images?.length ? property.images : property.image ? [property.image] : []).filter(Boolean)
  const isOpen = index !== null
  const previous = () => setIndex((current) => (current + images.length - 1) % images.length)
  const next = () => setIndex((current) => (current + 1) % images.length)
  const openGallery = (imageIndex, event) => { triggerRef.current = event.currentTarget; setIndex(imageIndex) }
  const closeGallery = () => { setIndex(null); requestAnimationFrame(() => triggerRef.current?.focus()) }

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeGallery()
      if (event.key === (isRTL ? 'ArrowRight' : 'ArrowLeft')) previous()
      if (event.key === (isRTL ? 'ArrowLeft' : 'ArrowRight')) next()
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll('#estatehub-gallery-dialog button:not([disabled])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow }
  }, [isOpen, images.length, isRTL])

  if (!images.length) return <div className="grid aspect-[1.65/1] place-items-center rounded-[1.75rem] bg-sand text-slate-600"><div className="text-center"><ImageOff size={28} className="mx-auto text-slate-500" aria-hidden="true" /><p className="mt-3 text-sm">{t('common.noImage')}</p></div></div>
  const title = localized(property.title, language)
  return <>
    <div className="relative grid gap-3 overflow-hidden rounded-[1.75rem] md:grid-cols-[1.7fr_1fr]">
      <button type="button" onClick={(event) => openGallery(0, event)} className="group relative aspect-[1.35/1] overflow-hidden bg-sand text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest md:aspect-auto md:min-h-[480px]" aria-label={t('property.openImage', { index: 1 })}>
        {failed[0] ? <span className="grid h-full place-items-center text-slate-600"><ImageOff size={28} aria-hidden="true" /></span> : <img src={images[0]} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" onError={() => setFailed((value) => ({ ...value, 0: true }))} />}
      </button>
      <div className="hidden gap-3 md:grid md:grid-rows-2">
        {images.slice(1, 3).map((image, offset) => {
          const imageIndex = offset + 1
          return <button key={`${image}-${imageIndex}`} type="button" onClick={(event) => openGallery(imageIndex, event)} className="group relative min-h-0 overflow-hidden bg-sand text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest" aria-label={t('property.openImage', { index: imageIndex + 1 })}>
            {failed[imageIndex] ? <span className="grid h-full place-items-center text-slate-600"><ImageOff size={24} aria-hidden="true" /></span> : <img src={image} alt={`${title} ${imageIndex + 1}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" onError={() => setFailed((value) => ({ ...value, [imageIndex]: true }))} />}
            {imageIndex === 2 && images.length > 3 && <span className="absolute inset-0 grid place-items-center bg-ink/55 text-sm font-semibold text-white">+{images.length - 3} {t('property.photos', { count: images.length - 3 })}</span>}
          </button>
        })}
      </div>
      <button type="button" onClick={(event) => openGallery(0, event)} className="flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-forest hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest md:absolute md:bottom-5 md:end-5 md:bg-white" aria-label={t('property.seePhotos')}><span>{t('property.seePhotos')}</span><span className="rounded-full bg-sand px-2 py-0.5">{images.length}</span></button>
    </div>
    {isOpen && <div id="estatehub-gallery-dialog" className="fixed inset-0 z-[80] grid place-items-center bg-[#08110f]/95 p-4" role="dialog" aria-modal="true" aria-label={t('property.gallery')} onClick={(event) => { if (event.target === event.currentTarget) closeGallery() }}>
      <button ref={closeRef} type="button" onClick={closeGallery} className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t('common.close')}><X size={21} aria-hidden="true" /></button>
      <div className="relative flex max-h-[86vh] w-full max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
          <button type="button" onClick={previous} className="absolute start-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t('common.previous')}>{isRTL ? <ChevronRight size={22} aria-hidden="true" /> : <ChevronLeft size={22} aria-hidden="true" />}</button>
          {failed[index] ? <div className="grid h-48 w-72 place-items-center rounded-xl bg-white/10 text-center text-white/75"><ImageOff size={26} aria-hidden="true" /><span className="text-sm">{t('common.noImage')}</span></div> : <img src={images[index]} alt={`${title} — ${index + 1}`} className="max-h-[75vh] max-w-full rounded-xl object-contain" onError={() => setFailed((value) => ({ ...value, [index]: true }))} />}
          <button type="button" onClick={next} className="absolute end-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label={t('common.next')}>{isRTL ? <ChevronLeft size={22} aria-hidden="true" /> : <ChevronRight size={22} aria-hidden="true" />}</button>
        </div>
        <p className="mt-4 text-sm text-white/80" aria-live="polite">{index + 1} / {images.length}</p>
      </div>
    </div>}
  </>
}

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { properties, favorites, toggleFavorite } = useApp()
  const { language, t, isRTL } = useI18n()
  const property = properties.find((item) => item.id === id)
  const backTarget = getDetailBackTarget(location.state)
  const propertiesTarget = getPropertiesTarget(location.state)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const Arrow = isRTL ? ArrowRight : ArrowLeft
  const related = useMemo(() => property ? properties.filter((item) => item.id !== property.id && (item.type === property.type || localized(item.city, language) === localized(property.city, language))).slice(0, 3) : [], [property, properties, language])

  if (!property) return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><EmptyState as="h1" title={t('property.unknownTitle')} text={t('property.unknownText')}><Button as="link" to="/properties">{t('common.browse')}</Button></EmptyState></main>

  const title = localized(property.title, language)
  const locationText = `${localized(property.neighborhood, language)}, ${localized(property.city, language)}`
  const favorite = favorites.includes(property.id)
  function handleSubmit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = t('common.nameRequired')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('common.invalidEmail')
    if (form.message.trim().length < 10) next.message = t('common.tooShort')
    setErrors(next)
    if (Object.keys(next).length) { document.getElementById(getFirstInvalidFieldId(next, 'inquiry'))?.focus(); return }
    setSubmitted(true)
  }
  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); setSubmitted(false) }

  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label={t('property.details')}><Link to="/" className="rounded-sm hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{t('property.breadcrumbHome')}</Link><span aria-hidden="true">/</span><Link to={propertiesTarget} className="rounded-sm hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{t('property.breadcrumbProperties')}</Link><span aria-hidden="true">/</span><span className="max-w-[16rem] truncate text-ink" aria-current="page">{title}</span></nav>
    <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-ink">{t(`purposes.${property.purpose}`)}</span><span className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-slate-600">{t(`types.${property.type}`)}</span>{property.featured && <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">{t('common.featured')}</span>}</div><h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1><p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={16} className="text-sage" aria-hidden="true" />{locationText}</p></div>
      <div className="flex items-center gap-3"><p className="text-xl font-bold text-ink sm:text-2xl"><bdi dir="auto">{formatPrice(property.price, language, property.purpose)}</bdi></p><button type="button" onClick={() => toggleFavorite(property.id)} aria-pressed={favorite} aria-label={`${favorite ? t('common.remove') : t('common.save')} — ${title}`} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${favorite ? 'text-clay' : 'text-ink'}`}><Heart size={19} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" /></button></div>
    </div>
    {location.state?.created && <div className="mb-5 rounded-2xl border border-sage/30 bg-[#f0f5f0] p-4 text-sm font-medium text-forest" role="status"><Check size={17} className="me-2 inline" aria-hidden="true" />{location.state.persisted === false ? t('add.storageFailure') : t('add.success')}</div>}
    <PhotoGallery key={property.id} property={property} language={language} t={t} isRTL={isRTL} />

    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="min-w-0">
        <section><h2 className="font-display text-2xl font-semibold text-ink">{t('property.highlights')}</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {property.type !== 'commercial' && <div className="rounded-2xl border border-line p-4"><BedDouble size={19} className="text-sage" aria-hidden="true" /><p className="mt-3 font-semibold text-ink"><bdi dir="ltr">{property.beds}</bdi> {t('property.bedrooms')}</p></div>}
          <div className="rounded-2xl border border-line p-4"><Bath size={19} className="text-sage" aria-hidden="true" /><p className="mt-3 font-semibold text-ink"><bdi dir="ltr">{property.baths}</bdi> {t('property.bathrooms')}</p></div>
          <div className="rounded-2xl border border-line p-4"><Maximize2 size={18} className="text-sage" aria-hidden="true" /><p className="mt-3 font-semibold text-ink"><bdi dir="auto">{formatArea(property.area, language)}</bdi></p><p className="mt-1 text-xs text-slate-500">{t('property.area')}</p></div>
          {property.built && <div className="rounded-2xl border border-line p-4"><span className="text-xs font-bold uppercase text-sage">{t('property.yearBuilt')}</span><p className="mt-2 font-semibold text-ink">{property.built}</p></div>}
        </div></section>
        <section className="mt-10 border-t border-line pt-8"><h2 className="font-display text-2xl font-semibold text-ink">{t('property.overview')}</h2><p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">{localized(property.description, language)}</p><p className="mt-4 text-xs text-slate-500">{t('property.listed')} · <bdi dir="auto">{formatDate(property.listedAt, language)}</bdi></p></section>
        <section className="mt-10 border-t border-line pt-8"><h2 className="font-display text-2xl font-semibold text-ink">{t('property.amenities')}</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{(property.amenities?.[language] || property.amenities?.en || []).map((item) => <li key={item} className="flex items-center gap-3 text-sm text-slate-600"><span className="grid h-7 w-7 place-items-center rounded-full bg-sand text-forest"><Check size={14} aria-hidden="true" /></span>{item}</li>)}</ul></section>
        <section className="mt-10 rounded-[1.6rem] bg-sand/80 p-5 sm:p-7"><h2 className="font-display text-xl font-semibold text-ink">{t('property.agentTitle')}</h2><p className="mt-3 text-sm font-semibold text-ink">{localized(property.agent?.name, language) || t('property.agentName')}</p><p className="mt-2 text-sm leading-7 text-slate-600">{t('property.agentNote')}</p></section>
      </div>

      <aside className="h-fit rounded-[1.6rem] border border-line bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-28">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-clay">{t('property.contactAgent')}</p><h2 className="mt-2 font-display text-xl font-semibold text-ink">{title}</h2><p className="mt-2 text-sm text-slate-500">{t('property.agentNote')}</p>
        <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-4">
          <FormField id="inquiry-name" label={t('property.inquiryName')} error={errors.name}><input id="inquiry-name" required value={form.name} onChange={(event) => update('name', event.target.value)} className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'inquiry-name-error' : undefined} /></FormField>
          <FormField id="inquiry-email" label={t('property.inquiryEmail')} error={errors.email}><input id="inquiry-email" required dir="ltr" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={inputClass} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'inquiry-email-error' : undefined} /></FormField>
          <FormField id="inquiry-message" label={t('property.inquiryMessage')} error={errors.message}><textarea id="inquiry-message" required value={form.message} onChange={(event) => update('message', event.target.value)} placeholder={t('property.inquiryPlaceholder')} rows="4" className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'inquiry-message-error' : undefined} /></FormField>
          {submitted && <p className="rounded-xl bg-[#f0f5f0] p-3 text-sm leading-6 text-forest" role="status">{t('property.inquirySent')}</p>}
          <Button type="submit" className="w-full">{t('common.submit')}</Button>
        </form>
      </aside>
    </div>
    {!!related.length && <section className="mt-16 border-t border-line pt-10"><PageIntro as="h2" title={t('property.related')} text={t('property.relatedIntro')} /><div className="mt-7"><PropertyGrid properties={related} compact /></div></section>}
    <div className="mt-10"><Button type="button" variant="ghost" onClick={() => navigate(location.state?.from ? -1 : backTarget)}><Arrow size={16} aria-hidden="true" />{t('common.back')}</Button></div>
  </main>
}
