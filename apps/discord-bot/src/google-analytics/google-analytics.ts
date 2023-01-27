import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { google } from '@google-analytics/data/build/protos/protos'

import { configuration as config } from '../config'
import { googleAnalyticsDimensions, googleAnalyticsMetrics } from './type'

export class GoogleAnalyticsData {
  private analyticsDataClient: BetaAnalyticsDataClient
  private property: string

  constructor() {
    this.analyticsDataClient = new BetaAnalyticsDataClient()
    this.property = `properties/${config.googleAnalytics.GA4_PROPERTY_ID}`
  }

  sortByDimentionValue(data: google.analytics.data.v1beta.IRow[]) {
    data.sort((i, j) => {
      return parseInt(i.dimensionValues[0].value) - parseInt(j.dimensionValues[0].value)
    })
    return data
  }

  extractMetricValue(data: google.analytics.data.v1beta.IRow[]): string[] {
    return data.map((e) => e.metricValues[0].value)
  }

  extractMetricValueAsInt(data: google.analytics.data.v1beta.IRow[]): number[] {
    return data.map((e) => parseInt(e.metricValues[0].value))
  }

  extractDimensionValue(data: google.analytics.data.v1beta.IRow[]): string[] {
    return data.map((e) => e.dimensionValues[0].value)
  }

  extractDimensionValueAsDate(data: google.analytics.data.v1beta.IRow[]): number[] {
    return this.extractDimensionValue(data).map((e) =>
      Date.parse(e.slice(0, 4) + '-' + e.slice(4, 6) + '-' + e.slice(6, 8))
    )
  }

  extractDimensionValueAsDayMonthDate(data: google.analytics.data.v1beta.IRow[]): string[] {
    return this.extractDimensionValue(data).map((e) => {
      return new Date(e.slice(0, 4) + '-' + e.slice(4, 6) + '-' + e.slice(6, 8)).toLocaleString(
        'default',
        { month: 'short', day: 'numeric' }
      )
    })
  }

  async getMetric(
    metrics: googleAnalyticsMetrics[],
    dimensions: googleAnalyticsDimensions[],
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
