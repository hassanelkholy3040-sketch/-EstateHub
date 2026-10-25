import assert from 'node:assert/strict'
import test from 'node:test'
import { getDetailBackTarget, getPropertiesTarget } from '../src/utils/navigation.js'

test('property detail navigation preserves an internal filtered source and has a safe direct-link fallback', () => {
  const source = { from: '/properties?type=apartment&min=1000000' }
  assert.equal(getDetailBackTarget(source), source.from)
  assert.equal(getPropertiesTarget(source), source.from)
  assert.equal(getDetailBackTarget(undefined), '/properties')
  assert.equal(getDetailBackTarget({ from: '//external.test' }), '/properties')
})

test('property breadcrumbs use listings even when the detail was opened from another route', () => {
  assert.equal(getPropertiesTarget({ from: '/favorites' }), '/properties')
  assert.equal(getPropertiesTarget({ from: '/properties/eh-001' }), '/properties')
})
