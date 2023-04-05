import { useEffect } from 'react'

import { useRouter } from 'next/router'

export default function GenerateToken() {
  const router = useRouter()

  useEffect(() => {
    console.log(router.query)
    const { code } = router.query

    // TODO: send code to backend
    // router.push('/pendingReviews')
  }, [router])

  return (
    <>
      <h1>Hello</h1>
    </>
  )
}
