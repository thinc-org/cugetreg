import { ICommand } from '../command/ICommand'
import { PingCommand } from '../command/ping'
import { RegisterReportChannelCommand } from '../command/registerReportChannel'

export const CUGetRegCommands: ICommand[] = [PingCommand, RegisterReportChannelCommand]
