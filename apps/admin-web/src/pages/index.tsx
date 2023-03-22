import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../styles/globals.css'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/pendingReviews')
  }, [])
  return null
}
