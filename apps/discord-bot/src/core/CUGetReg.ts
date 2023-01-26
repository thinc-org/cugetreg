import { AttachmentBuilder, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import * as cron from 'node-cron'

import { commands } from '../command'
import { ICommand } from '../command/ICommand'
import { database } from '../database'
import { IDatabase } from '../database/IDatabase'
import { hooks } from '../hook'
import { HookFunction } from '../hook/hook'
import { scheduler } from '../scheduler'
import { IScheduler } from '../scheduler/IScheduler'

export class CUGetReg extends Client {
  private _commandList = new Map<string, ICommand>()
  private _database: IDatabase = database

  constructor(token: string) {
    super({ intents: [GatewayIntentBits.Guilds] })
    this.login(token)
    this.addHook(hooks)
    this.registerCommand(commands)
    this.registerScheduler(scheduler)
  }

  addHook(hookFunctions: HookFunction[]): void {
    hookFunctions.forEach((hookFunction) => hookFunction(this))
  }

  registerCommand(commands: ICommand[]): void {
    commands.forEach((command) => {
      this._commandList.set(command.name, command)
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
    return this._commandList
  }

  get db(): IDatabase {
    return this._database
  }
}
