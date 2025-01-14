import { expect, test } from 'vitest'

import { getShortenName } from './name.js'

test('getShortenName', () => {
  expect(getShortenName('John Doe')).toBe('John D.')
  expect(getShortenName('John Doe Jr.')).toBe('John J.')
})
