import { CUGetReg } from '../core/CUGetReg'

export interface IScheduler {
  readonly cronTime: string
  readonly callbackFunction: (client: CUGetReg) => void
}
