import { removeUndefinedValue } from '.'

describe('removeUndefinedValue', () => {
  it.each`
    input                                      | expectedResult
    ${{ a: 'a', b: 'b' }}                      | ${{ a: 'a', b: 'b' }}
    ${{ a: 'a', b: undefined }}                | ${{ a: 'a' }}
    ${{ a: 'a', b: { c: 'c', d: undefined } }} | ${{ a: 'a', b: { c: 'c' } }}
  `('Should removeUndefinedValue correctly', ({ input, expectedResult }) => {
    const result = removeUndefinedValue(input)
    expect(result).toEqual(expectedResult)
  })
})
