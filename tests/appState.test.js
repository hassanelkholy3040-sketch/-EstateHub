import assert from 'node:assert/strict'
import test from 'node:test'
import { properties, isValidProperty } from '../src/data/properties.js'
import { createUniquePropertyId, insertUserProperty, sanitizeFavoriteIds, sanitizeUserProperties, toggleFavoriteId } from '../src/utils/appState.js'

const builtInIds = new Set(properties.map((property) => property.id))
const customProperty = { ...properties[0], id: 'eh-user-test' }
const validIds = new Set([...builtInIds, customProperty.id])

test('stored user properties keep valid unique custom records and ignore built-in or malformed records', () => {
  const result = sanitizeUserProperties([customProperty, customProperty, properties[0], null, { id: 'broken' }], isValidProperty, builtInIds)
  assert.deepEqual(result, [customProperty])
})

test('stored favorites keep valid built-in and user listing IDs once and in order', () => {
  assert.deepEqual(
    sanitizeFavoriteIds(['eh-001', 'eh-001', customProperty.id, 'removed-id', null, 7], validIds),
    ['eh-001', customProperty.id],
  )
  assert.deepEqual(sanitizeFavoriteIds({ unexpected: true }, validIds), [])
})

test('favorite toggling adds, removes, and rejects unknown IDs', () => {
  const added = toggleFavoriteId([], 'eh-001', validIds)
  assert.deepEqual(added, { accepted: true, favorites: ['eh-001'] })
  assert.deepEqual(toggleFavoriteId(added.favorites, 'eh-001', validIds), { accepted: true, favorites: [] })
  const current = [customProperty.id]
  const rejected = toggleFavoriteId(current, 'missing-id', validIds)
  assert.equal(rejected.accepted, false)
  assert.equal(rejected.favorites, current)
})

test('adding a user listing validates it, prepends it, and refuses ID collisions', () => {
  assert.deepEqual(insertUserProperty([], customProperty, isValidProperty, builtInIds), [customProperty])
  assert.equal(insertUserProperty([], properties[0], isValidProperty, builtInIds), null)
  assert.equal(insertUserProperty([customProperty], customProperty, isValidProperty, builtInIds), null)
  assert.equal(insertUserProperty([], { ...customProperty, price: -1 }, isValidProperty, builtInIds), null)
})

test('new property IDs retry when a generated candidate collides', () => {
  const candidates = ['taken', 'fresh-id']
  const existingIds = new Set([...builtInIds, 'eh-user-taken'])
  assert.equal(createUniquePropertyId(existingIds, () => candidates.shift()), 'eh-user-fresh-id')
})
