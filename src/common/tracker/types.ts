import { ScreenName } from '@/common/hooks/useScreenName/constants'
import { TrackEvent, TrackCategory, TrackAction } from './constants'

export interface TrackCustomEventParams<T = undefined> {
  event: TrackEvent
  category?: TrackCategory
  action?: TrackAction
  label?: string
  screenName?: ScreenName
  custom?: T
}
