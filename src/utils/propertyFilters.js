import { propertyTypes } from '../data/properties.js'

export const defaultFilters = Object.freeze({ q: '', location: '', type: '', purpose: '', min: '', max: '', beds: '', sort: 'recommended' })

function readLimit(value) {
  if (value == null || String(value).trim() === '') return ''
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? String(number) : ''
}

export function readPropertyFilters(params) {
  const source = params instanceof URLSearchParams ? params : new URLSearchParams(params || '')
  const beds = source.get('beds') || ''
  const sort = source.get('sort') || ''
  return {
    q: source.get('q') || '',
    location: source.get('location') || '',
    type: propertyTypes.includes(source.get('type')) ? source.get('type') : '',
    purpose: ['sale', 'rent'].includes(source.get('purpose')) ? source.get('purpose') : '',
    min: readLimit(source.get('min')),
    max: readLimit(source.get('max')),
    beds: ['1', '2', '3', '4', '5'].includes(beds) ? beds : '',
    sort: ['recommended', 'price-asc', 'price-desc', 'newest'].includes(sort) ? sort : 'recommended',
  }
}

export function hasInvalidPriceRange(filters) {
  return Boolean(filters.min && filters.max && Number(filters.min) > Number(filters.max))
}

function valueInBothLanguages(value) {
  if (value && typeof value === 'object') return [value.en, value.ar].filter((item) => typeof item === 'string').join(' ')
  return typeof value === 'string' ? value : ''
}

function normalize(value, locale) {
  return String(value || '').trim().toLocaleLowerCase(locale)
}

export function filterProperties(properties, filters, language = 'en') {
  const locale = language === 'ar' ? 'ar-EG' : 'en-EG'
  const query = normalize(filters.q, locale)
  const location = normalize(filters.location, locale)
  const min = filters.min === '' ? null : Number(filters.min)
  const max = filters.max === '' ? null : Number(filters.max)
  const beds = filters.beds === '' ? null : Number(filters.beds)

  const matching = properties.filter((property) => {
    const searchable = [property.title, property.description, property.city, property.neighborhood].map(valueInBothLanguages).join(' ')
    const propertyLocation = `${valueInBothLanguages(property.city)} ${valueInBothLanguages(property.neighborhood)}`
    return (!query || normalize(searchable, locale).includes(query))
      && (!location || normalize(propertyLocation, locale).includes(location))
      && (!filters.type || property.type === filters.type)
      && (!filters.purpose || property.purpose === filters.purpose)
      && (min === null || property.price >= min)
      && (max === null || property.price <= max)
      && (beds === null || property.beds >= beds)
  })

  const indexed = matching.map((property, index) => ({ property, index }))
  indexed.sort((left, right) => {
    const a = left.property
    const b = right.property
    let order = 0
    if (filters.sort === 'price-asc') order = a.price - b.price
    else if (filters.sort === 'price-desc') order = b.price - a.price
    else if (filters.sort === 'newest') order = Date.parse(b.listedAt) - Date.parse(a.listedAt)
    else order = Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Date.parse(b.listedAt) - Date.parse(a.listedAt)
    return order || left.index - right.index
  })
  return indexed.map(({ property }) => property)
}
