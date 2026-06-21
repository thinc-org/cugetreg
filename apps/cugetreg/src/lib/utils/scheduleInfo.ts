import { SEMESTER_LABEL_LONG } from '$lib/semesterOptions';

import type { Semester, StudyProgram } from '@cugetreg/zod-schemas';

import { studyProgramMapper } from '../mapper';

type Schedule = {
  id: string;
  userId: string;
  studyProgram: StudyProgram;
  academicYear: number;
  semester: Semester;
  name: string;
  visible: string;
  isDefault: boolean;
  cartOrder: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function convertSchedulesInfo(schedules: Schedule[]) {
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
