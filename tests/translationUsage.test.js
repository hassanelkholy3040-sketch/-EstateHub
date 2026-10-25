import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { translations } from '../src/i18n/translations.js'

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url))

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : /\.(jsx?|mjs)$/.test(entry.name) && !entry.name.endsWith('translations.js') ? [path] : []
  })
}

function getKey(root, path) {
  return path.split('.').reduce((value, key) => value?.[key], root)
}

test('every static translation call in application source resolves to translated text', () => {
  const files = sourceFiles(sourceRoot)
  const missing = []
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(/\bt\(\s*(['"])([^'"]+)\1/g)) {
      if (typeof getKey(translations.en, match[2]) !== 'string' || typeof getKey(translations.ar, match[2]) !== 'string') {
        missing.push(`${file}: ${match[2]}`)
      }
    }
  }
  assert.deepEqual(missing, [])
})

test('all enum and generated section labels used through dynamic keys exist in both languages', () => {
  const dynamicKeys = [
    ...['apartment', 'house', 'villa', 'townhouse', 'commercial'].map((type) => `types.${type}`),
    ...['sale', 'rent'].map((purpose) => `purposes.${purpose}`),
    ...[1, 2, 3].flatMap((index) => [`home.benefit${index}Title`, `home.benefit${index}Text`, `about.feature${index}Title`, `about.feature${index}Text`]),
  ]
  for (const key of dynamicKeys) {
    assert.equal(typeof getKey(translations.en, key), 'string', `English translation missing: ${key}`)
    assert.equal(typeof getKey(translations.ar, key), 'string', `Arabic translation missing: ${key}`)
  }
})

test('demo contact and inquiry acknowledgments do not claim messages were delivered or stored', () => {
  for (const key of ['common.demoMessages', 'contact.successText', 'property.inquirySent']) {
    assert.match(getKey(translations.en, key), /does not send or store/)
    assert.match(getKey(translations.ar, key), /لا يرسل.*يحفظ|لا ترسل.*تحفظ/)
  }
  assert.equal(translations.en.contact.successTitle, 'Demo form only')
  assert.equal(translations.ar.contact.successTitle, 'نموذج تجريبي فقط')
})
