import { useState } from 'react'
import { BedDouble, Bath, Heart, Maximize2, MapPin, ImageOff, ArrowUpLeft, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../context/I18nContext'
import { useApp } from '../../context/AppContext'
import { formatArea, formatPrice, localized } from '../../utils/format'

export default function PropertyCard({ property, compact = false }) {
  const { language, t, isRTL } = useI18n()
  const { favorites, toggleFavorite } = useApp()
  const routeLocation = useLocation()
  const [failed, setFailed] = useState(false)
  const isFavorite = favorites.includes(property.id)
  const title = localized(property.title, language)
  const location = `${localized(property.neighborhood, language)}, ${localized(property.city, language)}`
  const imageSource = property.image || property.images?.[0]
  const Arrow = isRTL ? ArrowUpLeft : ArrowUpRight
  const detailState = { from: `${routeLocation.pathname}${routeLocation.search}` }

  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card">
    <div className="relative aspect-[1.42/1] overflow-hidden bg-sand">
      {imageSource && !failed ? <img className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" src={imageSource} alt={title} loading="lazy" onError={() => setFailed(true)} /> : <div role="img" aria-label={t('common.noImage')} className="grid h-full place-items-center text-slate-600"><ImageOff size={26} aria-hidden="true" /></div>}
      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink shadow-sm">{t(`purposes.${property.purpose}`)}</span>{property.featured && <span className="rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-semibold text-white">{t('common.featured')}</span>}</div>
        <button type="button" onClick={() => toggleFavorite(property.id)} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${isFavorite ? 'text-clay' : 'text-ink'}`} aria-pressed={isFavorite} aria-label={`${isFavorite ? t('common.remove') : t('common.save')} — ${title}`}><Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" /></button>
      </div>
      <span className="absolute bottom-3 start-3 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">{t(`types.${property.type}`)}</span>
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div><p className="text-lg font-bold tracking-tight text-ink"><bdi dir="auto">{formatPrice(property.price, language, property.purpose, true)}</bdi></p></div>
      <h3 className="mt-2 line-clamp-1 font-display text-lg font-semibold text-ink"><Link to={`/properties/${property.id}`} state={detailState} className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{title}</Link></h3>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={15} className="shrink-0 text-sage" aria-hidden="true" /><span className="line-clamp-1">{location}</span></p>
      <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-xs text-slate-600">
        {property.type !== 'commercial' && <span className="inline-flex items-center gap-1.5"><BedDouble size={15} className="text-sage" aria-hidden="true" /><bdi dir="ltr">{property.beds}</bdi> <span className="hidden sm:inline">{t('property.bedrooms')}</span></span>}
        <span className="inline-flex items-center gap-1.5"><Bath size={15} className="text-sage" aria-hidden="true" /><bdi dir="ltr">{property.baths}</bdi> <span className="hidden sm:inline">{t('property.bathrooms')}</span></span>
        <span className="inline-flex items-center gap-1.5"><Maximize2 size={14} className="text-sage" aria-hidden="true" /><bdi dir="auto">{formatArea(property.area, language)}</bdi></span>
      </div>
      {!compact && <Link to={`/properties/${property.id}`} state={detailState} className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-forest transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{t('common.details')} <Arrow size={15} aria-hidden="true" /></Link>}
    </div>
  </article>
}
