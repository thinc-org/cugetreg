import { stubFalse } from '@web/utils/stubFalse'
import assert from 'assert'

describe('sum', function () {
  it('should return false', function () {
    assert.strictEqual(stubFalse(), false)
  })
})
