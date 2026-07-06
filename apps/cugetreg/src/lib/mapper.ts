import type { Day } from '@cugetreg/utils/types';
import type { GenEdType, SortBy, StudyProgram } from '@cugetreg/zod-schemas';

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

export function getColumnFromDay(day: Day): number {
  switch (day) {
    case 'MO':
      return 0;
    case 'TU':
      return 1;
    case 'WE':
      return 2;
    case 'TH':
      return 3;
    case 'FR':
      return 4;
    case 'SA':
      return 5;
    case 'SU':
      return 6;
  }
}

export function sortByMapper(sortBy: SortBy) {
  switch (sortBy) {
    case 'NAME':
      return 'ชื่อวิชา';
    case 'CAPACITY_SUM':
      return 'จำนวนที่นั่ง';
    case 'REMAINING_SUM':
      return 'เหลือที่นั่ง';
    case 'COURSE_NO':
      return 'รหัสวิชา';
    default:
      throw new Error(`SortBy ${sortBy} is invalid`);
  }
}
