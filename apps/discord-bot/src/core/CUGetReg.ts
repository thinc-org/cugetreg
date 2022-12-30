import { Client, GatewayIntentBits, TextChannel } from 'discord.js'

import { ICommand } from '../command/ICommand'
import { IDatabase } from '../database/IDatabase'
import { HookFunction } from '../hook/hook'
import { CUGetRegCommands } from './CUGetRegCommands'
import { CUGetRegDatabase } from './CUGetRegDatabase'
import { CUGetRegHooks } from './CUGetRegHooks'

export class CUGetReg extends Client {
  private commandList = new Map<string, ICommand>()
  private database: IDatabase = CUGetRegDatabase

  constructor(token: string) {
    super({ intents: [GatewayIntentBits.Guilds] })
    this.login(token)
    this.addHook(CUGetRegHooks)
    this.registerCommand(CUGetRegCommands)
  }

  addHook(hookFunctions: HookFunction[]): void {
    hookFunctions.forEach((hookFunction) => hookFunction(this))
  }

  registerCommand(commands: ICommand[]): void {
    commands.forEach((command) => {
      this.commandList.set(command.name, command)
    })
  }

  sendMessage(channelID: string, message: string): void {
    const textChannel = this.channels.cache.get(channelID) as TextChannel

    textChannel.send(message)
  }

  get commands(): Map<string, ICommand> {
    return this.commandList
  }

  get db(): IDatabase {
    return this.database
  }
}
