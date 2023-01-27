import { GoogleAnalyticsData } from './google-analytics'

export class GoogleAnalyticsDataExtended extends GoogleAnalyticsData {
  async getByDate() {
    return this.getMetric(['activeUsers'], ['date'])
  }

  async getByDate7Days() {
    return this.getMetric(['activeUsers'], ['date'], '7daysAgo', 'yesterday')
  }

  async getByDayOfWeek() {
    return this.getMetric(['activeUsers'], ['dayOfWeek'], '7daysAgo', 'yesterday')
  }

  async getByHour() {
    return this.getMetric(['activeUsers'], ['hour'])
  }

  async getByMonth() {
    return this.getMetric(['activeUsers'], ['month'], '365daysAgo', 'yesterday')
  }

  async getByNewVsReturning() {
    return this.getMetric(['activeUsers'], ['newVsReturning'], '30daysAgo', 'yesterday')
  }

  async getByPagePathPlusQueryString() {
    return this.getMetric(['activeUsers'], ['pagePathPlusQueryString'], '30daysAgo', 'yesterday')
  }

  async getByPlatformDeviceCategory() {
    return this.getMetric(['activeUsers'], ['platformDeviceCategory'], '30daysAgo', 'yesterday')
  }

  async getByPageReferrer() {
    return this.getMetric(['activeUsers'], ['pageReferrer'], '30daysAgo', 'yesterday')
  }

  async getByPageTitle() {
    return this.getMetric(['activeUsers'], ['pageTitle'], '30daysAgo', 'yesterday')
  }

  async getByUserGender() {
    return this.getMetric(['activeUsers'], ['userGender'], '30daysAgo', 'yesterday')
  }

  async getByYear() {
    return this.getMetric(['activeUsers'], ['year'], '730daysAgo', 'yesterday')
  }
}

export const googleAnalyticsDataExtended = new GoogleAnalyticsDataExtended()
