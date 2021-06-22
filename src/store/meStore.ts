import { GetMeResponse } from '@/utils/network/auth'
import { observable } from 'mobx'

export const meStore = observable<{ me: null | GetMeResponse }>({
  me: null,
})
