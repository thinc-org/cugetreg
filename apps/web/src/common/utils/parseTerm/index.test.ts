import { describe, expect, it, vi } from 'vitest'

import { Term } from '@web/common/types/term'

describe('', () => {
  vi.doMock('../getCurrentTerm', () => ({
    getCurrentTerm: vi.fn(() => ({ academicYear: '2564', semester: '2' })),
  }))

  it.each`
    input        | expectedAcedemicYear | expectedSemester
    ${'2564/2'}  | ${'2564'}            | ${'2'}
    ${'2564/1'}  | ${'2564'}            | ${'1'}
    ${'2565/1'}  | ${'2565'}            | ${'1'}
    ${'2565/3'}  | ${'2565'}            | ${'3'}
    ${'25653/3'} | ${'2564'}            | ${'2'}
    ${'2565/34'} | ${'2564'}            | ${'2'}
    ${'256/34'}  | ${'2564'}            | ${'2'}
    ${'2565'}    | ${'2564'}            | ${'2'}
    ${'2565/'}   | ${'2564'}            | ${'2'}
    ${''}        | ${'2564'}            | ${'2'}
  `('', async ({ input, expectedAcedemicYear, expectedSemester }) => {
    const { parseTerm } = await import('.')

    const result: Term = parseTerm(input)

    expect(result.academicYear).toMatch(expectedAcedemicYear)
    expect(result.semester).toMatch(expectedSemester)
  })
})
