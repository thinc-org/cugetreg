import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'

import { QueryParams } from '../../types'

describe('extractSearchVarsFromQuery', () => {
  const mockFilter = { key: 'value' }
  const mockRemoveUndefinedValue = jest.fn(() => mockFilter)
  jest.doMock('../removeUndefinedValue', () => ({ removeUndefinedValue: mockRemoveUndefinedValue }))

  it.each`
    keyword      | genEdTypes   | dayOfWeeks   | expectedParam
    ${undefined} | ${undefined} | ${undefined} | ${{}}
    ${'text'}    | ${'SC,IN'}   | ${'FRI,SUN'} | ${{ keyword: 'text', genEdTypes: ['SC', 'IN'], dayOfWeeks: ['FRI', 'SUN'] }}
    ${undefined} | ${'SC'}      | ${undefined} | ${{ genEdTypes: ['SC'] }}
  `(
    'should be able to extractSearchVarsFromQuery correctly',
    async ({ keyword, genEdTypes, dayOfWeeks, expectedParam }) => {
      const mockQuery = { keyword, genEdTypes, dayOfWeeks } as QueryParams
      const courseGroup = {} as CourseGroup

      const { extractSearchVarsFromQuery } = await import('.')
      const result = extractSearchVarsFromQuery(mockQuery, courseGroup)

      expect(mockRemoveUndefinedValue).toBeCalledWith(expectedParam)
      expect(result.filter).toEqual(mockFilter)
      expect(result.courseGroup).toEqual(courseGroup)
    }
  )
})
