import { ScreenName } from '@web/common/hooks/useScreenName/constants'

import { TrackAction, TrackCategory, TrackEvent } from './constants'

export interface TrackCustomEventParams<T = undefined> {
  event: TrackEvent
  category?: TrackCategory
  action?: TrackAction
  label?: string
  screenName?: ScreenName
  custom?: T
}
