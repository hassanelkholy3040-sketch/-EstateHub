import assert from 'node:assert/strict'
import test from 'node:test'
import { properties, isValidProperty } from '../src/data/properties.js'
import { translations } from '../src/i18n/translations.js'
import { filterProperties, hasInvalidPriceRange, readPropertyFilters } from '../src/utils/propertyFilters.js'
import { validatePropertyDraft } from '../src/utils/propertyValidation.js'
import { formatArea, formatDate, formatPrice, localized } from '../src/utils/format.js'

function keyPaths(value, prefix = '') {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return child && typeof child === 'object' && !Array.isArray(child) ? keyPaths(child, path) : [path]
  }).sort()
}

test('the demo property data is complete, unique, and valid', () => {
  assert.equal(properties.length, 24)
  assert.equal(new Set(properties.map((item) => item.id)).size, properties.length)
  for (const item of properties) {
    assert.equal(isValidProperty(item), true, `invalid property: ${item.id}`)
    assert.ok(item.images.length > 0)
    assert.ok(item.amenities.en.length > 0)
    assert.ok(item.amenities.ar.length > 0)
    for (const value of [item.title.ar, item.description.ar, item.city.ar, item.neighborhood.ar]) {
      assert.match(value, /\p{Script=Arabic}/u, `${item.id} should have Arabic content`)
    }
  }
})

test('stored properties with invalid dates, enums, images, or numeric data are rejected', () => {
  const valid = properties[0]
  assert.equal(isValidProperty({ ...valid, listedAt: 'not-a-date' }), false)
  assert.equal(isValidProperty({ ...valid, type: 'penthouse' }), false)
  assert.equal(isValidProperty({ ...valid, images: ['javascript:alert(1)'] }), false)
  assert.equal(isValidProperty({ ...valid, price: Infinity }), false)
  assert.equal(isValidProperty({ ...valid, area: -1 }), false)
})

test('English and Arabic dictionaries have the same complete key structure', () => {
  assert.deepEqual(keyPaths(translations.en), keyPaths(translations.ar))
  for (const dictionary of Object.values(translations)) {
    for (const path of keyPaths(dictionary)) {
      const value = path.split('.').reduce((node, part) => node[part], dictionary)
      assert.equal(typeof value, 'string', `${path} should resolve to text`)
      assert.ok(value.trim(), `${path} should not be empty`)
    }
  }
})

test('URL filters safely ignore invalid enum and numeric values', () => {
  const filters = readPropertyFilters('?type=castle&purpose=lease&min=NaN&max=-1&beds=9&sort=unknown')
  assert.deepEqual(filters, { q: '', location: '', type: '', purpose: '', min: '', max: '', beds: '', sort: 'recommended' })
  assert.equal(hasInvalidPriceRange(readPropertyFilters('?min=500&max=100')), true)
})

test('search matches either language and combines all active filters', () => {
  const filters = readPropertyFilters('?location=New%20Cairo&type=apartment&purpose=sale&min=3000000&max=5000000&beds=2')
  const result = filterProperties(properties, filters, 'ar')
  assert.deepEqual(result.map((item) => item.id), ['eh-001'])
  assert.ok(filterProperties(properties, { ...readPropertyFilters(''), q: 'القاهرة الجديدة' }, 'en').length > 0)
  assert.ok(filterProperties(properties, { ...readPropertyFilters(''), q: 'sunlit apartment' }, 'ar').some((item) => item.id === 'eh-009'))
  assert.equal(filterProperties(properties, { ...readPropertyFilters(''), q: '   ' }, 'en').length, properties.length)
})

test('price and newest sorting return predictable order', () => {
  const base = { ...readPropertyFilters(''), purpose: 'rent', type: 'apartment' }
  const ascending = filterProperties(properties, { ...base, sort: 'price-asc' })
  const descending = filterProperties(properties, { ...base, sort: 'price-desc' })
  const newest = filterProperties(properties, { ...base, sort: 'newest' })
  assert.deepEqual(ascending.map((item) => item.price), [...ascending.map((item) => item.price)].sort((a, b) => a - b))
  assert.deepEqual(descending.map((item) => item.price), [...descending.map((item) => item.price)].sort((a, b) => b - a))
  assert.ok(Date.parse(newest[0].listedAt) >= Date.parse(newest.at(-1).listedAt))
})

test('localized content and formatting preserve readable EGP and area labels', () => {
  assert.equal(localized({ en: 'Maadi', ar: 'المعادي' }, 'ar'), 'المعادي')
  assert.match(formatPrice(32000, 'en', 'rent'), /EGP.*\/ mo/)
  assert.match(formatPrice(32000, 'ar', 'rent'), /ج\.م.*شهرياً/)
  assert.match(formatArea(120, 'en'), /m²/)
  assert.match(formatArea(120, 'ar'), /م²/)
  assert.equal(formatDate('2026-10-25', 'en'), new Intl.DateTimeFormat('en-EG', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(2026, 9, 25)))
})

function translationAt(path) {
  return path.split('.').reduce((value, key) => value[key], translations.en)
}

function validDraft() {
  return {
    titleEn: 'Sample apartment', titleAr: 'شقة تجريبية',
    descriptionEn: 'A bright apartment with generous natural light.', descriptionAr: 'شقة مشرقة تتميز بإضاءة طبيعية ومساحات مريحة.',
    price: '2500000', area: '120', bedrooms: '2', bathrooms: '1', yearBuilt: '2020',
    cityEn: 'Maadi', cityAr: 'المعادي', neighborhoodEn: 'Degla', neighborhoodAr: 'دجلة',
    mainImage: 'https://example.test/home.jpg', extraImages: 'https://example.test/room.jpg', agentEmail: 'agent@example.test',
  }
}

test('the add-property form accepts a complete bilingual draft and localizes validation errors', () => {
  assert.deepEqual(validatePropertyDraft(validDraft(), translationAt, 2026), {})
  const invalid = validatePropertyDraft({ ...validDraft(), titleAr: '', price: 'Infinity', bedrooms: '-1', yearBuilt: '2032', mainImage: 'javascript:alert(1)', agentEmail: 'wrong' }, translationAt, 2026)
  assert.equal(invalid.titleAr, translations.en.add.validation.required)
  assert.equal(invalid.price, translations.en.add.validation.positive)
  assert.equal(invalid.bedrooms, translations.en.add.validation.nonNegative)
  assert.equal(invalid.yearBuilt, translations.en.add.validation.year)
  assert.equal(invalid.mainImage, translations.en.add.validation.url)
  assert.equal(invalid.agentEmail, translations.en.add.validation.email)
})

test('core interface accent and placeholder colors meet AA contrast on white', async () => {
  const { default: config } = await import('../tailwind.config.js')
  const luminance = (hex) => {
    const channels = hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16) / 255).map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }
  const contrast = (foreground, background) => {
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
    return (lighter + 0.05) / (darker + 0.05)
  }
  for (const color of [config.theme.extend.colors.clay, config.theme.extend.colors.sage]) {
    for (const background of ['#ffffff', '#f5f3ee']) assert.ok(contrast(color, background) >= 4.5, `${color} should meet AA contrast on ${background}`)
  }
  assert.ok(contrast('#64748b', '#ffffff') >= 4.5, 'Input placeholders should meet AA contrast on white')
  assert.ok(contrast('#ffffff', '#875034') >= 4.5, 'The clay button hover state should meet AA contrast')
})
