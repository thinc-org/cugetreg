import assert from 'assert'
import { describe, it } from 'vitest'

import { stubFalse } from '@web/utils/stubFalse'

describe('sum', function () {
  it('should return false', function () {
    assert.strictEqual(stubFalse(), false)
  })
})
