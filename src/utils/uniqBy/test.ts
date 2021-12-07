import assert from 'assert'

import { uniqBy } from '@/utils/uniqBy'

describe('uniqBy methods', function () {
  const objects = [{ a: 2 }, { a: 3 }, { a: 1 }, { a: 2 }, { a: 3 }, { a: 1 }]

  it('should work with an `iteratee`', function () {
    const expected = objects.slice(0, 3)

    const actual = uniqBy(objects, function (object) {
      return object.a
    })

    assert.deepStrictEqual(actual, expected)
  })

  it('should provide correct `iteratee` arguments', function () {
    let lastArgs: unknown = null

    uniqBy(objects, function (...args) {
      lastArgs || (lastArgs = args)
    })

    assert.deepStrictEqual(lastArgs, [objects[0]])
  })
})
