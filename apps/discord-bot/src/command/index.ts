import { ICommand } from './ICommand'
import { PingCommand } from './ping'
import { RegisterReportChannelCommand } from './registerReportChannel'

export const commands: ICommand[] = [PingCommand, RegisterReportChannelCommand]
