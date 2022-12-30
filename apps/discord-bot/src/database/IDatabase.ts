export interface IDatabase {
  saveRegisterReportChannel(guildId: string, channelId: string): Promise<void>
  getRegisterReportChannel(guildId: string): Promise<string[]>
  getAllReportChannels(): Promise<Map<string, string>>
}
