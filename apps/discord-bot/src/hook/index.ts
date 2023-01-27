import { CommandHook } from './command'
import { ReadyHook } from './ready'
import { HookFunction } from './type'

export const hooks: HookFunction[] = [ReadyHook, CommandHook]
