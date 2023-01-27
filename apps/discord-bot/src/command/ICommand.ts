import { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'

export interface ICommand extends ChatInputApplicationCommandData {
  readonly name: string
  readonly description: string
  execute: (client: CUGetReg, interaction: ChatInputCommandInteraction) => void
}
