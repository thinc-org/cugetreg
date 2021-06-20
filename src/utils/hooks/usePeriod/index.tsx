import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Period {
  year: string
  sem: string
}

interface QueryParams extends Partial<Period> {}

// TODO: dynamic year and semester
const CURRENT_PERIOD: Period = {
  year: '2564',
  sem: '1',
}

export default function usePeriod() {
  const router = useRouter()
  const [period, setPeriod] = useState(CURRENT_PERIOD)

  useEffect(() => {
    const params = router.query as QueryParams
    setPeriod({
      year: params.year ? params.year : CURRENT_PERIOD.year,
      sem: params.sem ? params.sem : CURRENT_PERIOD.sem,
    })
  }, [router, setPeriod])

  const changePeriod = (params: QueryParams) => {
    const currentPathName = router.pathname
    router.push(currentPathName, {
      query: {
        year: params.year === CURRENT_PERIOD.year ? undefined : params.year,
        sem: params.sem === CURRENT_PERIOD.sem ? undefined : params.sem,
      },
    })
  }

  return { period, changePeriod }
}
