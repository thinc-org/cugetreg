import { CUGetReg } from '../core/CUGetReg'
import { googleAnalyticsDataExtended as googleAnalytics } from '../google-analytics/google-analytics-extended'
import { lineChart } from '../utilities/generateChart'
import { IScheduler } from './IScheduler'

export const ReportChannelScheduler: IScheduler = {
  cronTime: '0 0 18 * * *',
  // cronTime: '*/10 * * * * *',
  callbackFunction: async (client: CUGetReg) => {
    try {
      const allReportChannels = await client.db.getAllReportChannels()
      // const data = await googleAnalytics.getByDate().then((res) => res.rows[0])
      const data = googleAnalytics.sortByDimentionValue(
        await googleAnalytics.getByDate7Days().then((res) => res.rows)
      )

      allReportChannels.forEach(async (reportChannel) => {
        // client.sendMessage(
        //   reportChannel,
        //   `\`\`\`Summary Report Data For Yesterday:\n\nActive Users: ${data.metricValues[0].value}\`\`\``
        // )
        client.sendImage(
          reportChannel,
          await lineChart(
            googleAnalytics.extractDimensionValueAsDayMonthDate(data),
            'Active Users',
            googleAnalytics.extractMetricValueAsInt(data),
            'CU Get Reg',
            'Date',
            'Users'
          )
        )
      })
    } catch (error) {
      console.error(`[Warning] Report Channel Scheduler Failed:\n          ${error}`)
    }
  },
}
