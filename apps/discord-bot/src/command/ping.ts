import { ChatInputCommandInteraction, Client } from 'discord.js'

import { ICommand } from './ICommand'

export const PingCommand: ICommand = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: (client: Client, interaction: ChatInputCommandInteraction): void => {
    interaction.reply('Pong!')
  },
}
