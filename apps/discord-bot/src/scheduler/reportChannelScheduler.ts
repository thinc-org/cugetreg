import { CUGetReg } from '../core/CUGetReg'
import { googleAnalyticDataExtended as googleAnalytic } from '../google-analytic/google-analytic-extended'
import { lineChart } from '../utilities/generateChart'
import { IScheduler } from './IScheduler'

export const ReportChannelScheduler: IScheduler = {
  cronTime: '0 0 18 * * *',
  // cronTime: '*/10 * * * * *',
  callbackFunction: async (client: CUGetReg) => {
    try {
      const allReportChannels = await client.db.getAllReportChannels()
      // const data = await googleAnalytic.getByDate().then((res) => res.rows[0])
      const data = googleAnalytic.sortByDimentionValue(
        await googleAnalytic.getByDate7Days().then((res) => res.rows)
      )

      allReportChannels.forEach(async (reportChannel) => {
        // client.sendMessage(
        //   reportChannel,
        //   `\`\`\`Summary Report Data For Yesterday:\n\nActive Users: ${data.metricValues[0].value}\`\`\``
        // )
        client.sendImage(
          reportChannel,
          await lineChart(
            googleAnalytic.extractDimensionValueAsDayMonthDate(data),
            'Active Users',
            googleAnalytic.extractMetricValueAsInt(data),
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
