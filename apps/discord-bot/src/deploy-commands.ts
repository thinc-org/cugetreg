import { REST, Routes, SlashCommandBuilder } from 'discord.js'

import { configuration as config } from './config/config'
import { CUGetRegCommands } from './core/CUGetRegCommands'

const commands = CUGetRegCommands.map((command) => {
  return new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .toJSON()
})

const rest = new REST({ version: '10' }).setToken(config.discord.token)

;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    const data = Array(
      await rest.put(Routes.applicationCommands(config.discord.clientID), {
        body: commands,
      })
    )

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()
