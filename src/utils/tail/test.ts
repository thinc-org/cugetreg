import assert from 'assert'

import { tail } from '@/utils/tail'

describe('tail', function () {
  const array = [1, 2, 3]

  it('should exclude the first element', function () {
    assert.deepStrictEqual(tail(array), [2, 3])
  })

  it('should return an empty when querying empty arrays', function () {
    assert.deepStrictEqual(tail([]), [])
  })
})
