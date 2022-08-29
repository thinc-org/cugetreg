import { SemesterEnum } from '@thinc-org/chula-courses'

describe('getSemesterName', () => {
  it.each`
    semester               | expectedName
    ${SemesterEnum.First}  | ${'ภาคต้น'}
    ${SemesterEnum.Second} | ${'ภาคปลาย'}
    ${SemesterEnum.Third}  | ${'ภาคฤดูร้อน'}
  `('should return result correctly', async ({ semester, expectedName }) => {
    const { getSemesterName } = await import('.')
    expect(getSemesterName(semester)).toBe(expectedName)
  })
})
