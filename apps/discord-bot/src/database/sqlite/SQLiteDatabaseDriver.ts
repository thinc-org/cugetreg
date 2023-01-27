import { open } from 'sqlite'
import * as sqlite3 from 'sqlite3'

import { configuration } from '../../config'
import { IDatabase } from '../IDatabase'

const DB_FILE_NAME = configuration.database.connectionURL

type ReportChannel = {
  guild_id?: string
  channel_id: string
}

export class SQLiteDatabaseDriver implements IDatabase {
  constructor() {
    new sqlite3.Database(DB_FILE_NAME).run(
      'CREATE TABLE IF NOT EXISTS register_report_channel (channel_id TEXT PRIMARY KEY, guild_id TEXT)'
    )
  }

  async openDB() {
    return open({
      driver: sqlite3.Database,
      filename: DB_FILE_NAME,
    })
  }

  async saveRegisterReportChannel(guildId: string, channelId: string): Promise<void> {
    const database = await this.openDB()

    await database.run(`INSERT INTO register_report_channel VALUES ('${channelId}', '${guildId}')`)
    return
  }

  async getRegisterReportChannel(guildId: string): Promise<string[]> {
    const database = await this.openDB()

    const result: ReportChannel[] = await database.all(
      `SELECT channel_id FROM register_report_channel WHERE guild_id = '${guildId}'`
    )
    return result.map((obj: ReportChannel) => {
      return obj.channel_id
    })
  }

  async getAllReportChannels(): Promise<Map<string, string>> {
    const database = await this.openDB()

    const result = await database.all(`SELECT * FROM register_report_channel`)
    return result.reduce((map: Map<string, string>, obj: ReportChannel) => {
      map.set(obj.guild_id, obj.channel_id)
      return map
    }, new Map<string, string>())
  }
}
