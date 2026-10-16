import type { Semester } from '@cugetreg/zod-schemas/constants';

export type GradingType = 'LETTER' | 'SU';

export interface PlanCourse {
  id: string;
  courseNo: string;
  courseName: string;
  credit: number;
  gradingType: GradingType;
  grade?: string;
}

export interface PlanTerm {
  semester: Semester;
  courses: PlanCourse[];
}

export interface PlanYear {
  academicYear: number;
  terms: PlanTerm[];
}

export interface StudyPlan {
  id: string;
  name: string;
  faculty: string;
  major: string;
  years: PlanYear[];
}

// TODO: replace with study plan API
function mockCourses(
  prefix: string,
  courses: [credit: number, grade?: string][],
  gradingType: GradingType = 'LETTER',
): PlanCourse[] {
  return courses.map(([credit, grade], i) => ({
    id: `${prefix}-${i}`,
    courseNo: '1092381',
    courseName: 'ดำน้ำผจญภัยโลกแอตแลนติส',
    credit,
    gradingType,
    grade,
  }));
}

export const mockStudyPlans: StudyPlan[] = [
  {
    id: 'study-plan-1',
    name: 'แผนการเรียน 1',
    faculty: 'คณะสถาปัตยกรรมศาสตร์',
    major: 'สาขาทองหล่อ',
    years: [
      {
        academicYear: 2567,
        terms: [
          {
            semester: 'FIRST',
            courses: mockCourses('y1t1', [[6, 'A'], [3], [2], [3, 'A'], [2]]),
          },
          {
            semester: 'SECOND',
            courses: mockCourses('y1t2', [[3, 'A'], [3], [3], [3, 'A']]),
          },
        ],
      },
      {
        academicYear: 2568,
        terms: [
          {
            semester: 'FIRST',
            courses: mockCourses('y2t1', [[6, 'A'], [3], [2]]),
          },
          {
            semester: 'SECOND',
            courses: mockCourses('y2t2', [[3], [6], [3, 'A']]),
          },
          {
            semester: 'SUMMER',
            courses: mockCourses('y2s', [[3, 'S']], 'SU'),
          },
        ],
      },
      {
        academicYear: 2569,
        terms: [
          {
            semester: 'FIRST',
            courses: mockCourses('y3t1', [[6, 'A'], [3], [2]]),
          },
          { semester: 'SECOND', courses: mockCourses('y3t2', [[3], [3]]) },
        ],
      },
      {
        academicYear: 2570,
        terms: [
          {
            semester: 'FIRST',
            courses: mockCourses('y4t1', [[6, 'A'], [3], [2], [2]]),
          },
          {
            semester: 'SECOND',
            courses: mockCourses('y4t2', [[3, 'A'], [3], [2, 'A'], [3], [6]]),
          },
        ],
      },
    ],
  },
  {
    id: 'study-plan-2',
    name: 'แผนการเรียน 2',
    faculty: 'คณะสถาปัตยกรรมศาสตร์',
    major: 'สาขาทองหล่อ',
    years: [
      {
        academicYear: 2567,
        terms: [
          { semester: 'FIRST', courses: mockCourses('p2y1t1', [[3], [3]]) },
          { semester: 'SECOND', courses: mockCourses('p2y1t2', [[3], [3]]) },
          { semester: 'SUMMER', courses: mockCourses('p2y1s', [[3]]) },
        ],
      },
      {
        academicYear: 2568,
        terms: [
          { semester: 'FIRST', courses: mockCourses('p2y2t1', [[3], [3]]) },
          { semester: 'SECOND', courses: mockCourses('p2y2t2', [[3]]) },
        ],
      },
      {
        academicYear: 2569,
        terms: [
          { semester: 'FIRST', courses: mockCourses('p2y3t1', [[3], [3]]) },
          { semester: 'SECOND', courses: mockCourses('p2y3t2', [[3], [3]]) },
        ],
      },
      {
        academicYear: 2570,
        terms: [
          { semester: 'FIRST', courses: mockCourses('p2y4t1', [[3]]) },
          { semester: 'SECOND', courses: mockCourses('p2y4t2', [[3], [3]]) },
        ],
      },
      {
        academicYear: 2571,
        terms: [
          { semester: 'FIRST', courses: mockCourses('p2y5t1', [[3], [3]]) },
        ],
      },
    ],
  },
];
