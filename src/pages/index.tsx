import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { DEFAULT_STUDY_PROGRAM } from '@/constants/studyProgram'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${DEFAULT_STUDY_PROGRAM}/courses`)
  }, [router])

  return null
}

export default HomePage
