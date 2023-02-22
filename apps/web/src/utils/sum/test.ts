import assert from 'assert'

import { sum } from '@web/utils/sum'

describe('sum', function () {
  const array = [6, 4, 2]

  it('should return the sum of an array of numbers', function () {
    assert.strictEqual(sum(array), 12)
  })

  it('should return `0` when passing empty `array` values', function () {
    assert.strictEqual(sum([]), 0)
  })

  it('should not skip `NaN` values', function () {
    assert.deepStrictEqual(sum([1, NaN]), NaN)
  })
})
