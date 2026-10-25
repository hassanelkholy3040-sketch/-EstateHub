import { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AboutPage from './pages/AboutPage'
import AddPropertyPage from './pages/AddPropertyPage'
import ContactPage from './pages/ContactPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import { useI18n } from './context/I18nContext'
import { useApp } from './context/AppContext'
import { localized } from './utils/format'

function SiteLayout() {
  const { t } = useI18n()
  return <><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest">{t('common.skipToContent')}</a><Header /><Outlet /><Footer /></>
}

function RouteEffects() {
  const location = useLocation()
  const { t, language } = useI18n()
  const { properties } = useApp()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const propertyMatch = location.pathname.match(/^\/properties\/([^/]+)$/)
    const property = propertyMatch && properties.find((item) => item.id === propertyMatch[1])
    const routeKey = location.pathname === '/' ? 'home' : location.pathname === '/properties' ? 'properties' : location.pathname === '/favorites' ? 'favorites' : location.pathname === '/add-property' ? 'add' : location.pathname === '/about' ? 'about' : location.pathname === '/contact' ? 'contact' : ''
    const isDetailsPath = Boolean(propertyMatch)
    const titles = { home: `${t('brand.name')} — ${t('brand.tagline')}`, properties: `${t('nav.properties')} — ${t('brand.name')}`, favorites: `${t('nav.favorites')} — ${t('brand.name')}`, add: `${t('add.title')} — ${t('brand.name')}`, about: `${t('nav.about')} — ${t('brand.name')}`, contact: `${t('nav.contact')} — ${t('brand.name')}` }
    const descriptions = { home: t('home.subhead'), properties: t('listings.intro'), favorites: t('favorites.intro'), add: t('add.intro'), about: t('about.intro'), contact: t('contact.intro') }
    document.title = property ? `${localized(property.title, language)} — ${t('brand.name')}` : isDetailsPath ? `${t('property.unknownTitle')} — ${t('brand.name')}` : titles[routeKey] || `404 — ${t('brand.name')}`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', property ? localized(property.description, language) : isDetailsPath ? t('property.unknownText') : descriptions[routeKey] || t('notFound.text'))
  }, [location.pathname, language, properties, t])

  return null
}

export default function App() {
  return <><RouteEffects /><Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="properties" element={<PropertiesPage />} />
      <Route path="properties/:id" element={<PropertyDetailsPage />} />
      <Route path="favorites" element={<FavoritesPage />} />
      <Route path="add-property" element={<AddPropertyPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></>
}
