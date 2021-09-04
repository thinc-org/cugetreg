import { useCourseGroup } from '../useCourseGroup'

/**
 * @deprecated please switch to {@link useCourseGroup}
 */
export function useSemester() {
  const { academicYear, semester } = useCourseGroup()
  return {
    semester: {
      year: academicYear,
      sem: semester,
    },
  }
}
