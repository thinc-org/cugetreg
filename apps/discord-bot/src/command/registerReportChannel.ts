import { ChatInputCommandInteraction, Client, TextChannel } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'
import { ICommand } from './ICommand'

export const RegisterReportChannelCommand: ICommand = {
  name: 'register_report_channel',
  description: 'Register Channel for Retriving Reports',
  execute: async (client: CUGetReg, interaction: ChatInputCommandInteraction): Promise<void> => {
    await client.db.saveRegisterReportChannel(interaction.guildId, interaction.channelId)
    console.log(await client.db.getAllReportChannels())
    interaction.reply('Channel Registered!')
  },
}
