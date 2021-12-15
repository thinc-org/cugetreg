import assert from 'assert'

import { difference } from '.'

describe('difference', function () {
  it('should return the difference of two arrays', function () {
    const actual = difference([2, 1], [2, 3])
    assert.deepStrictEqual(actual, [1])
  })

  it('should treat `-0` as `0`', function () {
    const array = [-0, 0]

    const actual = array.map((value) => [value]).map((arr) => difference(array, arr))

    assert.deepStrictEqual(actual, [[], []])

    const actual2 = difference([-0, 1], [1]).map((value) => `${value}`)
    assert.deepStrictEqual(actual2, ['0'])
  })

  it('should match `NaN`', function () {
    assert.deepStrictEqual(difference([1, NaN, 3], [NaN, 5, NaN]), [1, 3])
  })
})
