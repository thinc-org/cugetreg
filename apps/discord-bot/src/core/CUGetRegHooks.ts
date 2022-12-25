import { CommandHook } from '../hook/command'
import { HookFunction } from '../hook/hook'
import { ReadyHook } from '../hook/ready'

export const CUGetRegHooks: HookFunction[] = [ReadyHook, CommandHook]
