import { BetaAnalyticsDataClient } from '@google-analytics/data'

import { configuration as config } from '../config/config'
import { googleAnalyticDimensions, googleAnalyticMetrics } from './type'

export class GoogleAnalyticData {
  private analyticsDataClient: BetaAnalyticsDataClient
  private property: string

  constructor() {
    this.analyticsDataClient = new BetaAnalyticsDataClient()
    this.property = `properties/${config.googleAnalytic.GA4_PROPERTY_ID}`
  }

  async getMetric(
    metrics: googleAnalyticMetrics[],
    dimensions: googleAnalyticDimensions[],
    startDate = 'yesterday',
    endDate = 'yesterday'
  ) {
    const [response] = await this.analyticsDataClient.runReport({
      property: this.property,
      dateRanges: [{ startDate: startDate, endDate: endDate }],
      dimensions: dimensions.map((dimension) => ({ name: dimension })),
      metrics: metrics.map((metric) => ({ name: metric })),
    })

    return response
  }
}
