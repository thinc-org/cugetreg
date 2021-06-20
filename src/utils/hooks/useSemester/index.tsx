import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Semester {
  year: string
  sem: string
}

interface QueryParams extends Partial<Semester> {}

// TODO: dynamic year and semester
const CURRENT_SEMESTER: Semester = {
  year: '2564',
  sem: '1',
}

export default function useSemester() {
  const router = useRouter()
  const [semester, setSemester] = useState(CURRENT_SEMESTER)

  useEffect(() => {
    const params = router.query as QueryParams
    setSemester({
      year: params.year ? params.year : CURRENT_SEMESTER.year,
      sem: params.sem ? params.sem : CURRENT_SEMESTER.sem,
    })
  }, [router, setSemester])

  const changeSemester = (params: QueryParams) => {
    const currentPathName = router.pathname
    router.push(currentPathName, {
      query: {
        year: params.year === CURRENT_SEMESTER.year ? undefined : params.year,
        sem: params.sem === CURRENT_SEMESTER.sem ? undefined : params.sem,
      },
    })
  }

  return { semester, changeSemester }
}
