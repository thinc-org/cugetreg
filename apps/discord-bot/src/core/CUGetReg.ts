import { Client, GatewayIntentBits } from 'discord.js'

import { ICommand } from '../command/ICommand'
import { HookFunction } from '../hook/hook'
import { CUGetRegCommands } from './CUGetRegCommands'
import { CUGetRegHooks } from './CUGetRegHooks'

export class CUGetReg extends Client {
  private commandList = new Map<string, ICommand>()

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

  get commands(): Map<string, ICommand> {
    return this.commandList
  }
}
