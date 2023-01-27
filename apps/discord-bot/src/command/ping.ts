import { ChatInputCommandInteraction, Client } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'
import { ICommand } from './ICommand'

export const PingCommand: ICommand = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: (client: CUGetReg, interaction: ChatInputCommandInteraction): void => {
    interaction.reply('Pong!')
  },
}
