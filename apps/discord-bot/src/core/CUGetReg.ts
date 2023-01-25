import { AttachmentBuilder, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import * as cron from 'node-cron'

import { ICommand } from '../command/ICommand'
import { IDatabase } from '../database/IDatabase'
import { HookFunction } from '../hook/hook'
import { IScheduler } from '../scheduler/IScheduler'
import { CUGetRegCommands } from './CUGetRegCommands'
import { CUGetRegDatabase } from './CUGetRegDatabase'
import { CUGetRegHooks } from './CUGetRegHooks'
import { CUGetRegScheduler } from './CUGetRegScheduler'

export class CUGetReg extends Client {
  private commandList = new Map<string, ICommand>()
  private database: IDatabase = CUGetRegDatabase

  constructor(token: string) {
    super({ intents: [GatewayIntentBits.Guilds] })
    this.login(token)
    this.addHook(CUGetRegHooks)
    this.registerCommand(CUGetRegCommands)
    this.registerScheduler(CUGetRegScheduler)
  }

  addHook(hookFunctions: HookFunction[]): void {
    hookFunctions.forEach((hookFunction) => hookFunction(this))
  }

  registerCommand(commands: ICommand[]): void {
    commands.forEach((command) => {
      this.commandList.set(command.name, command)
    })
  }

  registerScheduler(schedulers: IScheduler[]) {
    schedulers.forEach((scheduler) => {
      cron.schedule(scheduler.cronTime, () => scheduler.callbackFunction(this))
    })
  }

  sendMessage(channelID: string, message: string): void {
    const textChannel = this.channels.cache.get(channelID) as TextChannel

    textChannel.send(message)
  }

  sendImage(channelID: string, imgBuffer: Buffer): void {
    const textChannel = this.channels.cache.get(channelID) as TextChannel
    const attachment = new AttachmentBuilder(imgBuffer)

    textChannel.send({ files: [attachment] })
  }

  get commands(): Map<string, ICommand> {
    return this.commandList
  }

  get db(): IDatabase {
    return this.database
  }
}
