import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '../i18n/translations'

const I18nContext = createContext(null)
const STORAGE_KEY = 'estatehub-language'

function getInitialLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)
  const direction = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
    try { localStorage.setItem(STORAGE_KEY, language) } catch { /* storage may be disabled */ }
  }, [language, direction])

  const t = useCallback((key, values = {}) => {
    const read = (root, path) => path.split('.').reduce((node, part) => node?.[part], root)
    const template = read(translations[language], key) ?? read(translations.en, key) ?? key
    return typeof template === 'string' ? template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`)) : key
  }, [language])

  const value = useMemo(() => ({ language, direction, isRTL: direction === 'rtl', setLanguage, t }), [language, direction, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}
