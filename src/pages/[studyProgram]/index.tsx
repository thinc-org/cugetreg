import { useEffect } from 'react'
import { useRouter } from 'next/router'

function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    router.replace(`${studyProgram}/courses`)
  }, [router])

  return null
}

export default HomePage
