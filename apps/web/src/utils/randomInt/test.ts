import assert from 'assert'

import { uniq } from '@web/utils/uniq'

import { randomInt } from '.'

describe('randomInt', function () {
  const array = [...Array(1000).keys()]

  it('should return `0` or `1` when no arguments are given', function () {
    const actual = uniq(array.map(() => randomInt())).sort()

    assert.deepStrictEqual(actual, [0, 1])
  })

  it('should support a `min` and `max`', function () {
    const min = 5,
      max = 10

    assert.ok(array.map(() => randomInt(min, max)).every((value) => value >= min && value <= max))
  })

  it('should swap `min` and `max` when `min` > `max`', function () {
    const min = 4,
      max = 2,
      expected = [2, 3, 4]

    const actual = uniq(array.map(() => randomInt(min, max))).sort()

    assert.deepStrictEqual(actual, expected)
  })

  it('should support large integer values', function () {
    const min = Math.pow(2, 31),
      max = Math.pow(2, 62)

    assert.ok(array.map(() => randomInt(min, max)).every((value) => value >= min && value <= max))
  })
})
