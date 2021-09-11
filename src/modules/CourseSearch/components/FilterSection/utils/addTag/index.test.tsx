import { addTag } from '.'

describe('addTag', () => {
  it.each`
    array               | tag        | expectedResult
    ${undefined}        | ${'test'}  | ${['test']}
    ${[]}               | ${'test2'} | ${['test2']}
    ${['tag1']}         | ${'test3'} | ${['tag1', 'test3']}
    ${['tag2', 'tag3']} | ${'test4'} | ${['tag2', 'tag3', 'test4']}
  `('Should addTag: $tag to array: $array correctly', ({ array, tag, expectedResult }) => {
    const result = addTag(array, tag)
    expect(result).toEqual(expectedResult)
  })
})
