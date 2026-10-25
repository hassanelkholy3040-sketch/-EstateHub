export function formatPrice(price, language, purpose, compact = false) {
  const number = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG', compact
    ? { notation: 'compact', maximumFractionDigits: 1 }
    : { maximumFractionDigits: 0 }).format(price)
  return language === 'ar'
    ? `${number} ج.م${purpose === 'rent' ? ' / شهرياً' : ''}`
    : `EGP ${number}${purpose === 'rent' ? ' / mo' : ''}`
}

export function formatArea(area, language) {
  return `${new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG', { maximumFractionDigits: 0 }).format(area)} ${language === 'ar' ? 'م²' : 'm²'}`
}

export function formatDate(date, language) {
  let value
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number)
    value = new Date(year, month - 1, day)
  } else value = new Date(date)
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(value)
}

export function localized(value, language) {
  if (value && typeof value === 'object') return value[language] || value.en || ''
  return value || ''
}
