import { semesterMapper, studyProgramMapper } from './mapper';

type Schedule = {
  id: string;
  userId: string;
  studyProgram: string;
  academicYear: number;
  semester: string;
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
        semesterMapper(schedule.semester),
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
