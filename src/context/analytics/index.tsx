import React, { createContext } from 'react'

import { AnalyticsType } from './types'

export const AnalyticsContext = createContext({} as AnalyticsType)

export const AnalyticsProvider = (props: { value: AnalyticsType; children: React.ReactNode }) => {
  return <AnalyticsContext.Provider {...props} />
}
