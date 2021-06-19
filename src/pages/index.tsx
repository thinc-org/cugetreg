import { DEFAULT_STUDY_PROGRAM } from '@/constants/studyProgram'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push(`${DEFAULT_STUDY_PROGRAM}/courses`)
  }, [router])

  return null
}

export default HomePage
