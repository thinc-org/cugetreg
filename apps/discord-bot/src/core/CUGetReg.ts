import { Client } from 'discord.js'

import { ReadyHook } from '../hook/hook'

export class CUGetReg extends Client {
  constructor(token: string) {
    super({ intents: [] })
    this.login(token)
    this.addHook(ReadyHook)
  }

  addHook(hookFunction: (client: Client) => void) {
    hookFunction(this)
  }
}
