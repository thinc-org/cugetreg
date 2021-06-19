import { DEFAULT_STUDY_PROGRAM } from '@/constants/studyProgram'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    //router.push(`${DEFAULT_STUDY_PROGRAM}/courses`)
    router.push(`courses/T/2021/2/2500000`)
  }, [router])

  return null
}

export default HomePage
