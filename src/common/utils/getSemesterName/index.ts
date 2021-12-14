import { Semester, SemesterEnum } from '@thinc-org/chula-courses'

export const getSemesterName = (semester: SemesterEnum | Semester) => {
  switch (semester) {
    case SemesterEnum.First:
      return 'ภาคต้น'
    case SemesterEnum.Second:
      return 'ภาคปลาย'
    case SemesterEnum.Third:
      return 'ภาคฤดูร้อน'
  }
}
