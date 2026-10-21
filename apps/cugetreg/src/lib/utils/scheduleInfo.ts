import { getSemesterLabel } from '$lib/semesterOptions';

import type { Locale } from '@cugetreg/ui/i18n';
import { type CartSchema } from '@cugetreg/zod-schemas';

import { semesterToTermMapper, studyProgramMapper } from '../mapper';

export function convertSchedulesInfo(
  schedules: CartSchema[],
  locale: Locale = 'th',
) {
  const result = schedules
    .sort((a, b) => b.studyProgram.localeCompare(a.studyProgram))
    .map((schedule) => {
      const scheduleTerm = [
        studyProgramMapper(schedule.studyProgram, locale),
        schedule.academicYear.toString(),
        '/',
        getSemesterLabel(schedule.semester, locale),
      ].join(' ');

      return {
        id: schedule.id,
        title: schedule.name,
        subtitle: scheduleTerm,
        year: schedule.academicYear,
        semester: Number(semesterToTermMapper(schedule.semester)),
        isPublic: schedule.visible === 'PUB',
      };
    });
  return result;
}
