import assert from 'assert'
import { describe, it } from 'vitest'

import { tail } from '@web/utils/tail'

describe('tail', function () {
  const array = [1, 2, 3]

  it('should exclude the first element', function () {
    assert.deepStrictEqual(tail(array), [2, 3])
  })

  it('should return an empty when querying empty arrays', function () {
    assert.deepStrictEqual(tail([]), [])
  })
})
