import { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client } from 'discord.js'

export interface ICommand extends ChatInputApplicationCommandData {
  readonly name: string
  readonly description: string
  execute: (client: Client, interaction: ChatInputCommandInteraction) => void
}
