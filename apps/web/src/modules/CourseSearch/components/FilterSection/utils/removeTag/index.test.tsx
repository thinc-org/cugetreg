import { removeTag } from '.'

describe('removeTag', () => {
  it.each`
    array               | tag        | expectedResult
    ${undefined}        | ${'test'}  | ${[]}
    ${[]}               | ${'test2'} | ${[]}
    ${['tag1']}         | ${'tag1'}  | ${[]}
    ${['tag2', 'tag3']} | ${'tag3'}  | ${['tag2']}
    ${['tag4', 'tag5']} | ${'tag6'}  | ${['tag4', 'tag5']}
  `('Should removeTag: $tag from array: $array correctly', ({ array, tag, expectedResult }) => {
    const result = removeTag(array, tag)
    expect(result).toEqual(expectedResult)
  })
})
