import { DEFAULT_STUDY_PROGRAM } from '@/constants/studyProgram'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push(`/T/courses?academicYear=2021&semester=2`)
    //router.replace(`${DEFAULT_STUDY_PROGRAM}/courses`)
  }, [router])

  return null
}

export default HomePage
