import { ENVIRONMENT, GOOGLE_ANALYTIC_PROPERTY_ID } from '@web/env'

import { AnalyticsType } from '../../types'

export function useAnalytics() {
  const addEvent: AnalyticsType['addEvent'] = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gaData = typeof window !== 'undefined' && (window as any).gaData
    const experiments = gaData && gaData[GOOGLE_ANALYTIC_PROPERTY_ID]?.experiments

    // Removed logging functionality - just log to console
    console.log('Analytics event:', e)
  }

  return { addEvent }
}
