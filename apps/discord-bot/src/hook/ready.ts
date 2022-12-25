import { Events } from 'discord.js'

import { CUGetReg } from '../core/CUGetReg'
import { HookFunction } from './hook'

export const ReadyHook: HookFunction = (client: CUGetReg): void => {
  client.once(Events.ClientReady, async () => {
    console.log(`${client.user.username} Online!`)
  })
}
