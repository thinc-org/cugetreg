import { useRouter } from 'next/router'
import { useEffect } from 'react'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    router.replace(`${studyProgram}/courses`)
  }, [router])

  return null
}

export default HomePage
