import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageOff, Info } from 'lucide-react'
import Button from '../components/ui/Button'
import FormField, { inputClass } from '../components/ui/FormField'
import PageIntro from '../components/ui/PageIntro'
import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import { propertyTypes } from '../data/properties'
import { validatePropertyDraft } from '../utils/propertyValidation'
import { createUniquePropertyId } from '../utils/appState'

const initialForm = {
  titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', purpose: 'sale', type: 'apartment', price: '', cityEn: '', cityAr: '', neighborhoodEn: '', neighborhoodAr: '', address: '', bedrooms: '2', bathrooms: '1', area: '', yearBuilt: '', amenitiesEn: '', amenitiesAr: '', mainImage: '', extraImages: '', agentNameEn: '', agentNameAr: '', agentPhone: '', agentEmail: '',
}

export default function AddPropertyPage() {
  const { t } = useI18n()
  const { addProperty, properties } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const submittingRef = useRef(false)

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setAttempted(false)
    if (key === 'mainImage') setPreviewFailed(false)
  }

  function submit(event) {
    event.preventDefault()
    if (submittingRef.current || submitting) return
    setAttempted(true)
    const invalid = validatePropertyDraft(form, t)
    setErrors(invalid)
    if (Object.keys(invalid).length) {
      const first = Object.keys(invalid)[0]
      requestAnimationFrame(() => document.getElementById(first)?.focus())
      return
    }
    submittingRef.current = true
    setSubmitting(true)
    const extraImages = form.extraImages.split(',').map((item) => item.trim()).filter(Boolean)
    const images = [form.mainImage.trim(), ...extraImages].filter(Boolean)
    const id = createUniquePropertyId(new Set(properties.map((property) => property.id)))
    const listing = {
      id, type: form.type, purpose: form.purpose, price: Number(form.price), beds: Number(form.bedrooms), baths: Number(form.bathrooms), area: Number(form.area),
      title: { en: form.titleEn.trim(), ar: form.titleAr.trim() },
      description: { en: form.descriptionEn.trim(), ar: form.descriptionAr.trim() },
      city: { en: form.cityEn.trim(), ar: form.cityAr.trim() },
      neighborhood: { en: form.neighborhoodEn.trim(), ar: form.neighborhoodAr.trim() },
      address: form.address.trim(), images, image: images[0] || '', featured: false,
      amenities: { en: form.amenitiesEn.split('\n').map((item) => item.trim()).filter(Boolean), ar: form.amenitiesAr.split('\n').map((item) => item.trim()).filter(Boolean) },
      listedAt: new Date().toISOString().slice(0, 10),
      ...(form.yearBuilt ? { built: Number(form.yearBuilt) } : {}),
      agent: { name: { en: form.agentNameEn.trim() || 'EstateHub Demo Team', ar: form.agentNameAr.trim() || 'فريق إيستيت هَب التجريبي' }, phone: form.agentPhone.trim() || '+20 100 000 0000', email: form.agentEmail.trim() || 'hello@example.test' },
    }
    const persisted = addProperty(listing)
    navigate(`/properties/${id}`, { state: { created: true, persisted } })
  }

  function Field({ name, label, type = 'text', required = false, placeholder, ...props }) {
    return <FormField id={name} label={<>{label}{required && <span className="ms-1 text-clay" aria-hidden="true">*</span>}</>} error={errors[name]}>
      <input id={name} type={type} dir={['number', 'tel', 'email', 'url'].includes(type) ? 'ltr' : undefined} value={form[name]} onChange={(event) => update(name, event.target.value)} placeholder={placeholder} className={inputClass} required={required} aria-required={required || undefined} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
    </FormField>
  }

  function AreaField({ name, label, required = false, rows = 5 }) {
    return <FormField id={name} label={<>{label}{required && <span className="ms-1 text-clay" aria-hidden="true">*</span>}</>} error={errors[name]}><textarea id={name} rows={rows} value={form[name]} onChange={(event) => update(name, event.target.value)} className={`${inputClass} resize-y`} required={required} aria-required={required || undefined} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} /></FormField>
  }

  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <PageIntro eyebrow={t('add.eyebrow')} title={t('add.title')} text={t('add.intro')} />
    <div className="mt-7 flex gap-3 rounded-2xl border border-[#d7e1d8] bg-[#f0f5f0] p-4 sm:p-5"><Info size={19} className="mt-0.5 shrink-0 text-forest" aria-hidden="true" /><div><p className="text-sm font-semibold text-ink">{t('add.noticeTitle')}</p><p className="mt-1 text-sm leading-6 text-slate-600">{t('add.notice')}</p></div></div>

    <form onSubmit={submit} noValidate className="mt-8 grid gap-7" aria-busy={submitting}>
      {attempted && Object.keys(errors).length > 0 && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">{t('add.errorTitle')} ({Object.keys(errors).length})</div>}
      <section className="rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-8"><h2 className="font-display text-xl font-semibold text-ink">{t('add.bilingualTitle')}</h2><div className="mt-6 grid gap-5 md:grid-cols-2"><Field name="titleEn" label={t('add.titleEn')} required /><Field name="titleAr" label={t('add.titleAr')} required /><AreaField name="descriptionEn" label={t('add.descriptionEn')} required /><AreaField name="descriptionAr" label={t('add.descriptionAr')} required /></div></section>

      <section className="rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-8"><h2 className="font-display text-xl font-semibold text-ink">{t('add.basics')}</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField id="purpose" label={t('add.purpose')}><select id="purpose" value={form.purpose} onChange={(event) => update('purpose', event.target.value)} className={inputClass}><option value="sale">{t('purposes.sale')}</option><option value="rent">{t('purposes.rent')}</option></select></FormField>
        <FormField id="type" label={t('add.type')}><select id="type" value={form.type} onChange={(event) => update('type', event.target.value)} className={inputClass}>{propertyTypes.map((type) => <option key={type} value={type}>{t(`types.${type}`)}</option>)}</select></FormField>
        <Field name="price" label={t('add.price')} type="number" required /><Field name="cityEn" label={t('add.cityEn')} required /><Field name="cityAr" label={t('add.cityAr')} required /><Field name="neighborhoodEn" label={t('add.areaEn')} required /><Field name="neighborhoodAr" label={t('add.areaAr')} required /><Field name="address" label={t('add.address')} placeholder={t('add.addressPlaceholder')} />
        <Field name="bedrooms" label={t('add.bedrooms')} type="number" required /><Field name="bathrooms" label={t('add.bathrooms')} type="number" required /><Field name="area" label={t('add.areaSize')} type="number" required /><Field name="yearBuilt" label={t('add.yearBuilt')} type="number" />
        <AreaField name="amenitiesEn" label={t('add.amenitiesEn')} rows={4} /><AreaField name="amenitiesAr" label={t('add.amenitiesAr')} rows={4} />
      </div></section>

      <section className="rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-8"><h2 className="font-display text-xl font-semibold text-ink">{t('add.imagesTitle')}</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field name="mainImage" label={t('add.mainImage')} type="url" /><Field name="extraImages" label={t('add.extraImages')} placeholder={t('add.imagesPlaceholder')} />
        <div className="sm:col-span-2"><p className="mb-2 text-sm font-semibold text-ink">{t('add.preview')}</p><div className="grid aspect-[2/1] max-h-80 place-items-center overflow-hidden rounded-2xl bg-sand">{form.mainImage && !previewFailed ? <img src={form.mainImage} alt={t('add.preview')} className="h-full w-full object-cover" onError={() => setPreviewFailed(true)} /> : <div className="text-center text-slate-600"><ImageOff size={26} className="mx-auto text-slate-500" aria-hidden="true" /><p className="mt-2 text-xs">{t('common.noImage')}</p></div>}</div></div>
      </div></section>

      <section className="rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-8"><h2 className="font-display text-xl font-semibold text-ink">{t('add.agentTitle')}</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><Field name="agentNameEn" label={t('add.agentNameEn')} /><Field name="agentNameAr" label={t('add.agentNameAr')} /><Field name="agentPhone" label={t('add.agentPhone')} type="tel" /><Field name="agentEmail" label={t('add.agentEmail')} type="email" /></div></section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" onClick={() => navigate(-1)}>{t('common.cancel')}</Button><Button type="submit" disabled={submitting} className="sm:min-w-52">{submitting ? t('common.saving') : t('add.create')}</Button></div>
    </form>
  </main>
}
