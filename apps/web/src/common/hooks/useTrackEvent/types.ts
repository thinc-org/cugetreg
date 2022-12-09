import { TrackCustomEventParams } from '@web/common/tracker/types'

export type UseTrackEventProps = Omit<TrackCustomEventParams, 'screenName'>
