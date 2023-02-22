import { useEffect } from 'react'

import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'
import { useRouter } from 'next/router'

function HomePage() {
  const router = useRouter()
  const { buildLink } = useLinkBuilder()

  useEffect(() => {
    router.replace(buildLink(`/courses`))
  }, [router, buildLink])

  return null
}

export default HomePage
