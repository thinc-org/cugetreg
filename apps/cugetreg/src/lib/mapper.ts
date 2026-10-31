import { ALLOWED_SEMESTER, getSemesterLabel } from '$lib/semesterOptions';

import {
  defineMessages,
  genEdMessages,
  type Locale,
  studyProgramMessages,
  translate,
} from '@cugetreg/ui/i18n';
import type { Day } from '@cugetreg/utils/types';
import type { GenEdType, SortBy, StudyProgram } from '@cugetreg/zod-schemas';
import type { Semester } from '@cugetreg/zod-schemas';

export function studyProgramMapper(
  studyProgram: StudyProgram,
  locale: Locale = 'th',
) {
  if (!(studyProgram in studyProgramMessages.th)) {
    throw new Error(`study program ${studyProgram} is invalid`);
  }
  return translate(studyProgramMessages, locale, studyProgram);
}

export function genEdTypeMapper(genEdType: GenEdType, locale: Locale = 'th') {
  if (!(genEdType in genEdMessages.th)) return null;
  return translate(
    genEdMessages,
    locale,
    genEdType as keyof typeof genEdMessages.th,
  );
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

const sortByMessages = defineMessages({
  th: {
    NAME: 'ชื่อวิชา',
    CAPACITY_SUM: 'จำนวนที่นั่ง',
    REMAINING_SUM: 'เหลือที่นั่ง',
    COURSE_NO: 'รหัสวิชา',
  },
  en: {
    NAME: 'Course name',
    CAPACITY_SUM: 'Total seats',
    REMAINING_SUM: 'Seats left',
    COURSE_NO: 'Course code',
  },
});

export function sortByMapper(sortBy: SortBy, locale: Locale = 'th') {
  if (!(sortBy in sortByMessages.th)) {
    throw new Error(`SortBy ${sortBy} is invalid`);
  }
  return translate(sortByMessages, locale, sortBy);
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

export function semesterLabelMapper(semester: Semester, locale: Locale = 'th') {
  return getSemesterLabel(semester, locale);
}

export function reviewStatusPriorityMapper(status: string): number {
  const priority: Record<string, number> = {
    REJECTED: 0,
    PENDING: 1,
    APPROVED: 2,
  };
  return priority[status] ?? 3;
}

/** Maps a long semester label in either language back to its enum value. */
export function labelToSemesterMapper(label: string): Semester {
  return (
    ALLOWED_SEMESTER.find(
      (s) =>
        getSemesterLabel(s, 'th') === label ||
        getSemesterLabel(s, 'en') === label,
    ) || 'FIRST'
  );
}
