import { DEFAULT_STUDY_PROGRAM } from '../../hooks/useCourseGroup/constants'

describe('parseCourseGroup', () => {
  const MOCK_TERM = {
    academicYear: '2564',
    semester: '1',
  }
  const MOCK_TERM_2 = {
    academicYear: '2563',
    semester: '2',
  }
  const MOCK_STUDY_PROGRAM = 'T'

  const mockParseTerm = jest.fn((term: string) => {
    const isEmpty = term === ''
    return !isEmpty ? MOCK_TERM : MOCK_TERM_2
  })
  jest.doMock('@/common/utils/parseTerm', () => ({ parseTerm: mockParseTerm }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    studyProgram          | term         | expectedStudyProgram     | expectedTerm
    ${null}               | ${null}      | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM_2}
    ${null}               | ${undefined} | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM_2}
    ${null}               | ${MOCK_TERM} | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM}
    ${undefined}          | ${null}      | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM_2}
    ${undefined}          | ${undefined} | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM_2}
    ${undefined}          | ${MOCK_TERM} | ${DEFAULT_STUDY_PROGRAM} | ${MOCK_TERM}
    ${MOCK_STUDY_PROGRAM} | ${null}      | ${MOCK_STUDY_PROGRAM}    | ${MOCK_TERM_2}
    ${MOCK_STUDY_PROGRAM} | ${undefined} | ${MOCK_STUDY_PROGRAM}    | ${MOCK_TERM_2}
    ${MOCK_STUDY_PROGRAM} | ${MOCK_TERM} | ${MOCK_STUDY_PROGRAM}    | ${MOCK_TERM}
  `(
    'Should parse correctly when studyProgram is $studyProgram and term is $term',
    async ({ studyProgram, term, expectedStudyProgram, expectedTerm }) => {
      const { parseCourseGroup } = await import('.')
      const result = parseCourseGroup({ studyProgram, term })

      expect(mockParseTerm).toBeCalledWith(term ?? '')
      expect(mockParseTerm).toBeCalledTimes(1)
      expect(result).toEqual({ studyProgram: expectedStudyProgram, ...expectedTerm })
    }
  )
})
