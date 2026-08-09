import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

import type { CartSchema } from '@cugetreg/zod-schemas';

import { studyProgramMapper } from '../mapper';

export function convertSchedulesInfo(schedules: CartSchema[]) {
  const result = schedules
    .sort((a, b) => b.studyProgram.localeCompare(a.studyProgram))
    .map((schedule) => {
      const scheduleTerm = [
        studyProgramMapper(schedule.studyProgram),
        schedule.academicYear.toString(),
        '/',
        SEMESTER_LABEL_LONG[schedule.semester],
      ].join(' ');

      return {
        id: schedule.id,
        title: schedule.name,
        subtitle: scheduleTerm,
        isPublic: schedule.visible === 'PUB',
      };
    });
  return result;
}
