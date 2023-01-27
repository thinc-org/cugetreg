import { ChatInputCommandInteraction } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'
import { ICommand } from './ICommand'

export const RegisterReportChannelCommand: ICommand = {
  name: 'register_report_channel',
  description: 'channel to receive reports',
  execute: async (client: CUGetReg, interaction: ChatInputCommandInteraction): Promise<void> => {
    await client.db.saveRegisterReportChannel(interaction.guildId, interaction.channelId)

    interaction.reply('Channel Registered!')
  },
}
