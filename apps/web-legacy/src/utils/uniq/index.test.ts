import assert from 'assert'
import { describe, it } from 'vitest'

import { uniq } from '@web/utils/uniq'

describe('uniq methods', function () {
  const objects = [{ a: 2 }, { a: 3 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 1 }]

  it('should return unique values of an unsorted array', function () {
    const array = [2, 1, 2]
    assert.deepStrictEqual(uniq(array), [2, 1])
  })

  it('should return unique values of a sorted array', function () {
    const array = [1, 2, 2]
    assert.deepStrictEqual(uniq(array), [1, 2])
  })

  it('should treat object instances as unique', function () {
    assert.deepStrictEqual(uniq(objects), objects)
  })

  it('should treat `-0` as `0`', function () {
    const actual = uniq([-0, 0]).map((it) => `${it}`)
    assert.deepStrictEqual(actual, ['0'])
  })

  it('should match `NaN`', function () {
    assert.deepStrictEqual(uniq([NaN, NaN]), [NaN])
  })

  it('should distinguish between numbers and numeric strings', function () {
    const expected = ['2', 2, Object('2'), Object(2)]
    assert.deepStrictEqual(uniq([...expected, ...expected]), expected)
  })
})
