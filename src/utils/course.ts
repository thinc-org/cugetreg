import { Course } from '@thinc-org/chula-courses'

type StringKey = keyof Pick<Course, 'courseNo' | 'courseNameTh' | 'courseNameEn'>
type SortKey = keyof Pick<Course, 'genEdType' | StringKey>

const sortCoursesByGenEdType = (courses: Course[]): Course[] => {
  const nonGenEdCourses = courses.filter(({ genEdType }) => genEdType === 'NO')
  const genEdCourses = courses
    .filter(({ genEdType }) => genEdType !== 'NO')
    .sort((A, B) => A.genEdType.localeCompare(B.genEdType))
  return genEdCourses.concat(nonGenEdCourses)
}

const sortCoursesByStringKey = (courses: Course[], key: StringKey): Course[] => {
  return courses.sort((a, b) => a[key].localeCompare(b[key]))
}

export const sortCourses = (courses: Course[], key: SortKey): Course[] => {
  switch (key) {
    case 'genEdType':
      return sortCoursesByGenEdType(courses)
    case 'courseNo':
    case 'courseNameTh':
    case 'courseNameEn':
      return sortCoursesByStringKey(courses, key)
    default:
      return courses
  }
}
