import { useApp } from '../context/AppContext'
import { useI18n } from '../context/I18nContext'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import PageIntro from '../components/ui/PageIntro'
import PropertyGrid from '../components/properties/PropertyGrid'

export default function FavoritesPage() {
  const { favorites, properties, clearFavorites } = useApp()
  const { t } = useI18n()
  const saved = properties.filter((property) => favorites.includes(property.id))
  function clear() {
    if (window.confirm(t('favorites.clearConfirm'))) clearFavorites()
  }

  return <main id="main-content" tabIndex="-1" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><PageIntro eyebrow={t('favorites.eyebrow')} title={t('favorites.title')} text={t('favorites.intro')} />{saved.length > 0 && <Button type="button" variant="secondary" onClick={clear} className="w-fit">{t('common.clearAll')}</Button>}</div>
    <section className="mt-9" aria-label={t('favorites.title')}>
      {saved.length ? <><p className="mb-5 text-sm text-slate-500" aria-live="polite">{t('favorites.count', { count: saved.length })}</p><PropertyGrid properties={saved} /></> : <EmptyState title={t('favorites.emptyTitle')} text={t('favorites.emptyText')}><Button as="link" to="/properties">{t('favorites.browse')}</Button></EmptyState>}
    </section>
  </main>
}
