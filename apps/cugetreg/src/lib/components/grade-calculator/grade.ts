import type { PlanCourse, StudyPlan } from './mock-data';

export const LETTER_GRADE_POINTS: Record<string, number> = {
  A: 4,
  'B+': 3.5,
  B: 3,
  'C+': 2.5,
  C: 2,
  'D+': 1.5,
  D: 1,
  F: 0,
};

export function calculateGpa(
  courses: PlanCourse[],
  grades: Record<string, string>,
) {
  let points = 0;
  let credits = 0;
  for (const course of courses) {
    const grade = grades[course.id];
    if (course.gradingType !== 'LETTER' || grade === undefined) continue;
    points += LETTER_GRADE_POINTS[grade] * course.credit;
    credits += course.credit;
  }
  if (credits === 0) return 0;
  return Math.round((points / credits + Number.EPSILON) * 100) / 100;
}

export function sumCredits(courses: PlanCourse[]) {
  return courses.reduce((sum, course) => sum + course.credit, 0);
}

export function getSavedGrades(studyPlan: StudyPlan) {
  const grades: Record<string, string> = {};
  for (const year of studyPlan.years) {
    for (const term of year.terms) {
      for (const course of term.courses) {
        if (course.grade) grades[course.id] = course.grade;
      }
    }
  }
  return grades;
}
