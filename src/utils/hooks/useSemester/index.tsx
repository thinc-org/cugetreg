import { CourseSearchContext } from '@/context/CourseSearch'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

interface Semester {
  year: string
  sem: string
}

interface QueryParams extends Partial<Semester> {}

// TODO: dynamic year and semester
const CURRENT_SEMESTER: Semester = {
  year: '2563',
  sem: '1',
}

export default function useSemester() {
  const router = useRouter()
  const [semester, setSemester] = useState(CURRENT_SEMESTER)
  const { setSearchCourseVars } = useContext(CourseSearchContext)

  useEffect(() => {
    const params = router.query as QueryParams
    setSemester({
      year: params.year ? params.year : CURRENT_SEMESTER.year,
      sem: params.sem ? params.sem : CURRENT_SEMESTER.sem,
    })
  }, [router, setSemester])

  const changeSemester = (params: QueryParams) => {
    const currentPathName = router.pathname

    const actualYear = params.year ? params.year : CURRENT_SEMESTER.year
    const actualSem = params.sem ? params.sem : CURRENT_SEMESTER.sem

    const yearParams = params.year === CURRENT_SEMESTER.year ? undefined : params.year
    const semParams = params.sem === CURRENT_SEMESTER.sem ? undefined : params.sem

    setSearchCourseVars((currentVars) => ({
      ...currentVars,
      courseGroup: {
        ...currentVars.courseGroup,
        academicYear: actualYear,
        semester: actualSem,
      },
    }))

    router.push(currentPathName, {
      query: {
        year: yearParams,
        sem: semParams,
      },
    })
  }

  return { semester, changeSemester }
}
