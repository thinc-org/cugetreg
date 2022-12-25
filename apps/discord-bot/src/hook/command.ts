import { ChatInputCommandInteraction, Events } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'
import { HookFunction } from './hook'

export const CommandHook: HookFunction = (client: CUGetReg): void => {
  client.on(Events.InteractionCreate, async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`Command ${interaction.commandName} not found!`)
      return
    }

    try {
      await command.execute(client, interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  })
}
