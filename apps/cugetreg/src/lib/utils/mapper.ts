export function semesterMapper(semester: string) {
  switch (semester) {
    case 'FIRST':
    case '1':
      return 'ภาคต้น';
    case 'SECOND':
    case '2':
      return 'ภาคปลาย';
    case 'SUMMER':
    case '3':
      return 'ภาคฤดูร้อน';
  }
}
export function studyProgramMapper(studyProgram: string) {
  switch (studyProgram) {
    case 'T':
      return 'ตรีภาค';
    case 'I':
      return 'นานาชาติ';
    case 'S':
      return 'ทวิภาค';
  }
}
