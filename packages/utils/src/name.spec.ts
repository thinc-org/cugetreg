import { expect, test } from 'vitest'

import { getShortenName } from './name.js'

test('getShortenName', () => {
  expect(getShortenName('John Doe')).toBe('John D.')
  expect(getShortenName('John Doe Jr.')).toBe('John J.')

  // Middle Name Google Style
  expect(getShortenName('John [Smith] Doe')).toBe('John D.')
  expect(getShortenName('John[Smith] Doe')).toBe('John D.')

  // Some edge cases
  expect(getShortenName('John')).toBe('John')
  expect(getShortenName('John ')).toBe('John')
  expect(getShortenName('John Doe ')).toBe('John D.')

  // Some edge cases (real)
  expect(getShortenName('6531234521 6531234521')).toBe('6531234521')

  // Thai
  expect(getShortenName('ประยุทธ์ จันทร์โอชา')).toBe('ประยุทธ์ จ.')
})
