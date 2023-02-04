import { Semester } from '@cgr/codegen'

describe('getSemesterName', () => {
  it.each`
    semester           | expectedName
    ${Semester.First}  | ${'ภาคต้น'}
    ${Semester.Second} | ${'ภาคปลาย'}
    ${Semester.Third}  | ${'ภาคฤดูร้อน'}
  `('should return result correctly', async ({ semester, expectedName }) => {
    const { getSemesterName } = await import('.')
    expect(getSemesterName(semester)).toBe(expectedName)
  })
})
