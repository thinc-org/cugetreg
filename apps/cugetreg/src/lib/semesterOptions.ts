import type { Semester } from '@cugetreg/zod-schemas/constants';

export const ALLOWED_ACADEMIC_YEAR = [2564, 2565, 2566, 2567, 2568] as const;
export const ALLOWED_SEMESTER = ['FIRST', 'SECOND', 'SUMMER'] as const;

export type AcademicYear = (typeof ALLOWED_ACADEMIC_YEAR)[number];

export const SEMESTER_LABEL_SHORT: Record<Semester, string> = {
  FIRST: '1',
  SECOND: '2',
  SUMMER: 'ฤดูร้อน',
};

export const SEMESTER_LABEL_LONG: Record<Semester, string> = {
  FIRST: 'ภาคต้น',
  SECOND: 'ภาคปลาย',
  SUMMER: 'ภาคฤดูร้อน',
};

export function getSemesterDisplayOptions(): string[] {
  const result: string[] = [];
  const years = [...ALLOWED_ACADEMIC_YEAR].reverse();
  for (const year of years) {
    result.push(`${year} / ${SEMESTER_LABEL_SHORT.SUMMER}`);
    result.push(`${year} / ${SEMESTER_LABEL_SHORT.SECOND}`);
    result.push(`${year} / ${SEMESTER_LABEL_SHORT.FIRST}`);
  }
  return result;
}

export function parseSemesterDisplay(
  display: string,
): { academicYear: string; semester: Semester } | null {
  const parts = display.split(' / ');
  if (parts.length !== 2) return null;
  const [year, label] = parts;
  for (const [sem, semLabel] of Object.entries(SEMESTER_LABEL_SHORT)) {
    if (semLabel === label)
      return { academicYear: year, semester: sem as Semester };
  }
  for (const [sem, semLabel] of Object.entries(SEMESTER_LABEL_LONG)) {
    if (semLabel === label)
      return { academicYear: year, semester: sem as Semester };
  }
  return null;
}

/** Dropdown-friendly year options (newest first) */
export function getYearOptions(): { value: string; label: string }[] {
  return [...ALLOWED_ACADEMIC_YEAR]
    .reverse()
    .map((y) => ({ value: String(y), label: String(y) }));
}

export function getSemesterShortOptions(): {
  value: Semester;
  label: string;
}[] {
  return ALLOWED_SEMESTER.map((s) => ({
    value: s,
    label: SEMESTER_LABEL_SHORT[s],
  }));
}
