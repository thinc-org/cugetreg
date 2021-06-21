import { useContext, useEffect } from 'react'
import { StudyProgram } from '@thinc-org/chula-courses'
import { useRouter } from 'next/router'
import { CourseSearchContext } from '@/context/CourseSearch'

export function useStudyProgram() {
  const router = useRouter()

  const { setSearchCourseVars } = useContext(CourseSearchContext)
  const studyProgram = (router.query.studyProgram as StudyProgram) || 'S'

  useEffect(() => {
    console.log(router.query)
  }, [router.query])

  const setStudyProgram = (program: StudyProgram) => {
    const splittedPathName = (router.asPath as string).split('/')
    splittedPathName[1] = program
    const newPathName = splittedPathName.join('/')

    router.push(newPathName)

    setSearchCourseVars((currentVars) => ({
      ...currentVars,
      courseGroup: {
        ...currentVars.courseGroup,
        studyProgram: program,
      },
    }))
  }

  return { studyProgram, setStudyProgram }
}
