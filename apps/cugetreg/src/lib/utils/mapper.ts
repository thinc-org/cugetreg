import { Status } from '../../../../../packages/ui/dist/utils';
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
export function genEdTypeMapper(genEdType: string) {
  switch (genEdType) {
    case 'SC':
      return 'หมวดวิทย์';
    case 'SO':
      return 'หมวดสังคม';
    case 'HU':
      return 'หมวดมนุษย์';
    case 'SC':
      return 'หมวดสหฯ';
    default:
      return null;
  }
}

export function reviewStatusMapper(raw: string) {
  switch (raw) {
    case 'PENDING':
      return Status.PENDING;
    case 'APPROVED':
      return Status.APPROVED;
    case 'REJECTED':
      return Status.REJECTED;
    default:
      throw new Error(`Invalid ReviewStatus: ${raw}`);
  }
}
