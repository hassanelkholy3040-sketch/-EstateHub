import assert from 'node:assert/strict'
import test from 'node:test'
import { readLocalJson, writeLocalJson } from '../src/utils/localStorage.js'

test('browser JSON storage reads valid values and falls back safely for malformed data', () => {
  const previous = globalThis.localStorage
  const values = new Map([['valid', '["eh-001"]'], ['broken', '{not json'], ['object', '{"unexpected":true}']])
  globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  try {
    assert.deepEqual(readLocalJson('valid', []), ['eh-001'])
    assert.deepEqual(readLocalJson('broken', []), [])
    assert.equal(readLocalJson('missing', 'fallback'), 'fallback')
    assert.deepEqual(readLocalJson('object', []), { unexpected: true })
    assert.equal(writeLocalJson('saved', ['eh-002']), true)
    assert.deepEqual(JSON.parse(values.get('saved')), ['eh-002'])
  } finally {
    if (previous === undefined) delete globalThis.localStorage
    else globalThis.localStorage = previous
  }
})

test('storage access failures do not escape into the application', () => {
  const previous = globalThis.localStorage
  globalThis.localStorage = {
    getItem() { throw new Error('storage denied') },
    setItem() { throw new Error('quota exceeded') },
  }
  try {
    assert.deepEqual(readLocalJson('items', []), [])
    assert.equal(writeLocalJson('items', []), false)
  } finally {
    if (previous === undefined) delete globalThis.localStorage
    else globalThis.localStorage = previous
  }
})
