import { configuration } from './config/config'
import { CUGetReg } from './core/CUGetReg'

const config = configuration()
const token = config.discord.token
const client = new CUGetReg(token)
