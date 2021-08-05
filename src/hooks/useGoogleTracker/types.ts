import { EventArgs } from 'react-ga'

import { TrackingCategory, TrackingAction } from './constants'

export interface useGoogleTrackerProps extends EventArgs {
  category: TrackingCategory
  action: TrackingAction
}
