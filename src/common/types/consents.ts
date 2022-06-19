import { ConsentMode } from '../constants/consents'

export interface Consents {
  [ConsentMode.AD_STORAGE]?: boolean
  [ConsentMode.ANALYTICS_STORAGE]?: boolean
  checked?: boolean
}
