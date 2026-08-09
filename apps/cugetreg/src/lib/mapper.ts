import { ALLOWED_SEMESTER, SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

import type { Day } from '@cugetreg/utils/types';
import type { GenEdType, SortBy, StudyProgram } from '@cugetreg/zod-schemas';
import type { Semester } from '@cugetreg/zod-schemas';

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

export function normalizeDayMapper(
  d: string | number | undefined | null,
): Day | undefined {
  if (d === undefined || d === null) return undefined;

  const up = String(d).toUpperCase();
  if (up.startsWith('MO') || up === '1') return 'MO';
  if (up.startsWith('TU') || up === '2') return 'TU';
  if (up.startsWith('WE') || up === '3') return 'WE';
  if (up.startsWith('TH') || up === '4') return 'TH';
  if (up.startsWith('FR') || up === '5') return 'FR';
  if (up.startsWith('SA') || up === '6') return 'SA';
  if (up.startsWith('SU') || up === '7' || up === '0') return 'SU';

  const KNOWN_DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const sliced = up.slice(0, 2);
  return KNOWN_DAYS.includes(sliced) ? (sliced as Day) : undefined;
}

export function normalizeGenedMapper(g: string | undefined | null): string[] {
  if (!g || g === 'NO') return [];

  const up = String(g).toUpperCase();
  if (up.startsWith('SC')) return ['SC'];
  if (up.startsWith('SO')) return ['SO'];
  if (up.startsWith('HU')) return ['HU'];
  if (up.startsWith('IN')) return ['IN'];

  return [up];
}

export function semesterToTermMapper(semester: Semester | string): string {
  switch (semester) {
    case 'FIRST':
      return '1';
    case 'SECOND':
      return '2';
    case 'SUMMER':
      return '3';
    default:
      return '1';
  }
}

export function semesterToThaiMapper(semester: Semester) {
  return SEMESTER_LABEL_LONG[semester];
}

export function reviewStatusPriorityMapper(status: string): number {
  const priority: Record<string, number> = {
    REJECTED: 0,
    PENDING: 1,
    APPROVED: 2,
  };
  return priority[status] ?? 3;
}

export function thaiLabelToSemesterMapper(label: string): Semester {
  return (
    ALLOWED_SEMESTER.find((s) => SEMESTER_LABEL_LONG[s] === label) || 'FIRST'
  );
}
