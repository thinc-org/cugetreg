import { CommandHook } from './command'
import { HookFunction } from './hook'
import { ReadyHook } from './ready'

export const hooks: HookFunction[] = [ReadyHook, CommandHook]
