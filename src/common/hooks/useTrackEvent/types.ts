import { TrackCustomEventParams } from '@/common/tracker/types'

export interface UseTrackEventProps extends Omit<TrackCustomEventParams, 'screenName'> {}
