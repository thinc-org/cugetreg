import { Semester } from '@cgr/codegen'

export const getSemesterName = (semester: Semester) => {
  switch (semester) {
    case Semester.First:
      return 'ภาคต้น'
    case Semester.Second:
      return 'ภาคปลาย'
    case Semester.Third:
      return 'ภาคฤดูร้อน'
  }
}
