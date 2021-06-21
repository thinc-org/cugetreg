import { useCourseGroup } from '../useCourseGroup'

/**
 * @deprecated please switch to {@link useCourseGroup}
 */
export function useStudyProgram() {
  const { studyProgram, setStudyProgram } = useCourseGroup()
  return { studyProgram, setStudyProgram }
}
