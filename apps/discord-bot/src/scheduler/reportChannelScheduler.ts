import { CUGetReg } from '../core/CUGetReg'
import { googleAnalyticDataExtended as googleAnalytic } from '../google-analytic/google-analytic-extended'
import { IScheduler } from './IScheduler'

export const ReportChannelScheduler: IScheduler = {
  cronTime: '0 0 18 * * *',
  callbackFunction: async (client: CUGetReg) => {
    try {
      const allReportChannels = await client.db.getAllReportChannels()
      const data = await googleAnalytic.getByDate().then((res) => res.rows[0])

      allReportChannels.forEach(async (reportChannel) => {
        client.sendMessage(
          reportChannel,
          `\`\`\`Summary Report Data For Yesterday:\n\nActive Users: ${data.metricValues[0].value}\`\`\``
        )
      })
      throw new Error('Test Error')
    } catch (error) {
      console.error(`[Warning] Report Channel Scheduler Failed:\n          ${error}`)
    }
  },
}
