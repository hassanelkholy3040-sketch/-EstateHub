import assert from 'node:assert/strict'
import test from 'node:test'
import { getFirstInvalidFieldId } from '../src/utils/forms.js'

test('form validation maps semantic error names to actual input IDs', () => {
  assert.equal(getFirstInvalidFieldId({ name: 'Required', email: 'Invalid' }, 'contact'), 'contact-name')
  assert.equal(getFirstInvalidFieldId({ email: 'Invalid', message: 'Too short' }, 'inquiry'), 'inquiry-email')
  assert.equal(getFirstInvalidFieldId({}, 'contact'), null)
})
