import { CUGetReg } from '../core/CUGetReg'
import { IScheduler } from './IScheduler'

export const ReportChannelScheduler: IScheduler = {
  cronTime: '0 0 18 * * *',
  callbackFunction: async (client: CUGetReg) => {
    const allReportChannels = await client.db.getAllReportChannels()

    allReportChannels.forEach(async (reportChannel) => {
      client.sendMessage(reportChannel, 'Report Data')
    })
  },
}
