import type { GenEdType, StudyProgram } from '@cugetreg/zod-schemas';

export function studyProgramMapper(studyProgram: StudyProgram) {
  switch (studyProgram) {
    case 'T':
      return 'ตรีภาค';
    case 'I':
      return 'นานาชาติ';
    case 'S':
      return 'ทวิภาค';
    default:
      throw new Error(`study program ${studyProgram} is invalid`);
  }
}
export function genEdTypeMapper(genEdType: GenEdType) {
  switch (genEdType) {
    case 'SC':
      return 'หมวดวิทย์';
    case 'SO':
      return 'หมวดสังคม';
    case 'HU':
      return 'หมวดมนุษย์';
    case 'IN':
      return 'หมวดสหฯ';
    default:
      return null;
  }
}
