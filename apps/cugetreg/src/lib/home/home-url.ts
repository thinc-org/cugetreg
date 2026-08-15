import { semesterToTermMapper } from '$lib/mapper';

import type { Semester, StudyProgram } from '@cugetreg/zod-schemas';

export interface HomeUrlState {
  selectedGenEds: string[];
  selectedFaculties: string[];
  selectedDays: string[];
  selectedEval: string[];
  credit: string;
  startTime: string;
  endTime: string;
  fitSchedule: boolean;
  noConditions: boolean;
  favoriteOnly: boolean;
  currentProgram: StudyProgram;
  currentSemester: Semester;
  currentAY: number;
}

const DEFAULT_ACADEMIC_YEAR = 2568;
const STUDY_PROGRAMS = new Set<StudyProgram>(['S', 'I', 'T']);

function parseList(value: string | null): string[] {
  return value?.split(',').filter(Boolean) ?? [];
}

function parseSemester(term: string | null): {
  academicYear: number;
  semester: Semester;
} {
  const [year, semester] = term?.split('/') ?? [];

  return {
    academicYear: Number(year) || DEFAULT_ACADEMIC_YEAR,
    semester:
      semester === '3' ? 'SUMMER' : semester === '2' ? 'SECOND' : 'FIRST',
  };
}

export function parseHomeUrl(url: URL): HomeUrlState {
  const params = url.searchParams;
  const pathProgram = url.pathname.split('/').filter(Boolean)[0];
  const currentProgram = STUDY_PROGRAMS.has(pathProgram as StudyProgram)
    ? (pathProgram as StudyProgram)
    : 'S';
  const { academicYear, semester } = parseSemester(params.get('term'));

  return {
    selectedGenEds: parseList(params.get('genEdType')),
    selectedFaculties: parseList(params.get('faculty')),
    selectedDays: parseList(params.get('day')),
    selectedEval: parseList(params.get('gradingType')),
    credit: params.get('credit') ?? '',
    startTime: params.get('timeStart') ?? '',
    endTime: params.get('timeEnd') ?? '',
    fitSchedule: params.get('fitSchedule') === 'true',
    noConditions: params.get('noConditions') === 'true',
    favoriteOnly: params.get('favorite') === 'true',
    currentProgram,
    currentSemester: semester,
    currentAY: academicYear,
  };
}

export function buildHomeUrl(baseUrl: URL, state: HomeUrlState): URL {
  const url = new URL(baseUrl);
  url.pathname = `/${state.currentProgram}/courses`;

  const values = {
    term: `${state.currentAY}/${semesterToTermMapper(state.currentSemester)}`,
    genEdType: state.selectedGenEds.join(',') || null,
    faculty: state.selectedFaculties.join(',') || null,
    day: state.selectedDays.join(',') || null,
    timeStart: state.startTime || null,
    timeEnd: state.endTime || null,
    gradingType: state.selectedEval.join(',') || null,
    credit: state.credit || null,
    fitSchedule: state.fitSchedule ? 'true' : null,
    noConditions: state.noConditions ? 'true' : null,
    favorite: state.favoriteOnly ? 'true' : null,
  };

  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }

  return url;
}
