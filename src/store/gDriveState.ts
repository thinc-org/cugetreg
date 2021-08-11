import { observable } from 'mobx'

export enum GDriveSyncState {
  FAIL,
  IDLE,
  SYNCING,
  SYNCED,
  SYNCERR,
  NOGRANT,
}

export const gDriveStore = observable({
  gDriveState: GDriveSyncState.IDLE,
})
