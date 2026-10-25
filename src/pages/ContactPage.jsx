import { useState } from 'react'
import { Mail, Phone, Clock3 } from 'lucide-react'
import Button from '../components/ui/Button'
import FormField, { inputClass } from '../components/ui/FormField'
import PageIntro from '../components/ui/PageIntro'
import { useI18n } from '../context/I18nContext'
import { getFirstInvalidFieldId } from '../utils/forms'

const initial = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const { t } = useI18n()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function update(key, value) { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); setSent(false) }
  function submit(event) {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = t('contact.errors.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = t('contact.errors.email')
    if (!form.subject.trim()) next.subject = t('contact.errors.subject')
    if (form.message.trim().length < 10) next.message = t('contact.errors.message')
    setErrors(next)
    if (Object.keys(next).length) { document.getElementById(getFirstInvalidFieldId(next, 'contact'))?.focus(); return }
    setSent(true)
  }

  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <PageIntro eyebrow={t('contact.eyebrow')} title={t('contact.title')} text={t('contact.intro')} />
    <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[1.75rem] border border-line bg-white p-5 shadow-card sm:p-8"><h2 className="font-display text-2xl font-semibold text-ink">{t('contact.formTitle')}</h2>
        <form onSubmit={submit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField id="contact-name" label={t('contact.name')} error={errors.name}><input id="contact-name" required value={form.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" className={inputClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} /></FormField>
          <FormField id="contact-email" label={t('contact.email')} error={errors.email}><input id="contact-email" required dir="ltr" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} /></FormField>
          <FormField id="contact-subject" label={t('contact.subject')} error={errors.subject} className="sm:col-span-2"><input id="contact-subject" required value={form.subject} onChange={(event) => update('subject', event.target.value)} placeholder={t('contact.subjectPlaceholder')} className={inputClass} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'contact-subject-error' : undefined} /></FormField>
          <FormField id="contact-message" label={t('contact.message')} error={errors.message} className="sm:col-span-2"><textarea id="contact-message" required rows="6" value={form.message} onChange={(event) => update('message', event.target.value)} placeholder={t('contact.messagePlaceholder')} className={`${inputClass} resize-y`} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} /></FormField>
          {sent && <p className="rounded-xl bg-[#f0f5f0] p-4 text-sm leading-6 text-forest sm:col-span-2" role="status"><strong className="block">{t('contact.successTitle')}</strong>{t('contact.successText')}</p>}
          <div className="sm:col-span-2"><Button type="submit">{t('contact.send')}</Button></div>
        </form>
      </section>
      <aside className="h-fit rounded-[1.75rem] bg-ink p-6 text-white sm:p-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#e3ad88]">{t('contact.demoLabel')}</p><h2 className="mt-3 font-display text-2xl font-semibold">{t('contact.detailsTitle')}</h2><div className="mt-7 grid gap-6 text-sm">
        <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Mail size={17} aria-hidden="true" /></span><div><p className="text-white/60">{t('contact.emailLabel')}</p><a dir="ltr" href="mailto:hello@example.test" className="mt-1 inline-block rounded-sm font-medium underline decoration-white/25 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">hello@example.test</a></div></div>
        <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Phone size={17} aria-hidden="true" /></span><div><p className="text-white/60">{t('contact.phoneLabel')}</p><span dir="ltr" className="mt-1 inline-block font-medium">+20 100 000 0000</span></div></div>
        <div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10"><Clock3 size={17} aria-hidden="true" /></span><div><p className="font-semibold">{t('contact.hoursTitle')}</p><p className="mt-1 leading-6 text-white/65">{t('contact.hoursText')}</p></div></div>
      </div><p className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/55">{t('common.demoMessages')}</p></aside>
    </div>
  </main>
}
