import React, { createContext, useEffect, useState } from 'react'
import { DEFAULT_HISTORY_CONTEXT_VALUE } from '@/context/History/constants'
import { useRouter } from 'next/router'

export const HistoryContext = createContext(DEFAULT_HISTORY_CONTEXT_VALUE)

export const HistoryProvider: React.FC = (props) => {
  const router = useRouter()
  const [histories, setHistories] = useState<string[]>([])

  useEffect(() => {
    setHistories((histories) => [router.asPath, ...histories])
  }, [router.asPath])

  const value = { histories }

  return <HistoryContext.Provider value={value} {...props} />
}
