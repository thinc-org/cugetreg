import { configuration as config } from './config'
import { CUGetReg } from './core/CUGetReg'

const token = config.discord.token
const client = new CUGetReg(token)
