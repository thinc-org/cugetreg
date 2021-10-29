import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'

function HomePage() {
  const router = useRouter()
  const { buildLink } = useLinkBuilder()

  useEffect(() => {
    router.replace(buildLink(`/courses`))
  }, [router, buildLink])

  return null
}

export default HomePage
