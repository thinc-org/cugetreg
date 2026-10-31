import {
  type Locale,
  LOCALES,
  semesterMessages,
  semesterShortMessages,
  translate,
} from '@cugetreg/ui/i18n';
import type { Semester } from '@cugetreg/zod-schemas/constants';

export const ALLOWED_ACADEMIC_YEAR = [
  2564, 2565, 2566, 2567, 2568, 2569,
] as const;
export const ALLOWED_SEMESTER = ['FIRST', 'SECOND', 'SUMMER'] as const;

export type AcademicYear = (typeof ALLOWED_ACADEMIC_YEAR)[number];

export function getSemesterLabel(semester: Semester, locale: Locale = 'th') {
  return translate(semesterMessages, locale, semester);
}

export function getSemesterShortLabel(
  semester: Semester,
  locale: Locale = 'th',
) {
  return translate(semesterShortMessages, locale, semester);
}

export function getSemesterDisplayOptions(locale: Locale = 'th'): {
  value: {
    ay: number;
    semester: Semester;
  };
  label: string;
}[] {
  const result: { value: { ay: number; semester: Semester }; label: string }[] =
    [];
  const years = [...ALLOWED_ACADEMIC_YEAR].reverse();
  const order: Semester[] = ['SUMMER', 'SECOND', 'FIRST'];
  for (const year of years) {
    for (const semester of order) {
      result.push({
        value: { ay: year, semester },
        label: `${year} / ${getSemesterShortLabel(semester, locale)}`,
      });
    }
  }
  return result;
}

/** Parses "2568 / 1" or "2568 / ภาคต้น" style labels in either language. */
export function parseSemesterDisplay(
  display: string,
): { academicYear: string; semester: Semester } | null {
  const parts = display.split(' / ');
  if (parts.length !== 2) return null;
  const [year, label] = parts;
  for (const locale of LOCALES) {
    for (const sem of ALLOWED_SEMESTER) {
      if (
        getSemesterShortLabel(sem, locale) === label ||
        getSemesterLabel(sem, locale) === label
      )
        return { academicYear: year, semester: sem };
    }
  }
  return null;
}

/** Dropdown-friendly year options (newest first) */
export function getYearOptions(): { value: string; label: string }[] {
  return [...ALLOWED_ACADEMIC_YEAR]
    .reverse()
    .map((y) => ({ value: String(y), label: String(y) }));
}

export function getSemesterShortOptions(locale: Locale = 'th'): {
  value: Semester;
  label: string;
}[] {
  return ALLOWED_SEMESTER.map((s) => ({
    value: s,
    label: getSemesterShortLabel(s, locale),
  }));
}
