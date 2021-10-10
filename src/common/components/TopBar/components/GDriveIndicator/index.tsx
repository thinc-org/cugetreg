import { Tooltip, Stack } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'

import { grantGdriveSync } from '@/services/googleDrive'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'

const SyncStatus: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <Tooltip title={title}>
      <Stack alignItems="center">{children}</Stack>
    </Tooltip>
  )
}

export const GDriveIndicator = observer(() => {
  const { t } = useTranslation('syncStatus')
  switch (gDriveStore.gDriveState) {
    case GDriveSyncState.IDLE:
      return null
    case GDriveSyncState.FAIL:
      return (
        <SyncStatus title={t('fail')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCING:
      return (
        <SyncStatus title={t('syncing')}>
          <MdCloudQueue />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCED:
      return (
        <SyncStatus title={t('synced')}>
          <MdCloudDone />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCERR:
      return (
        <SyncStatus title={t('syncerr')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case GDriveSyncState.NOGRANT:
      return (
        <SyncStatus title={t('nogrant')}>
          <MdCloudOff onClick={() => grantGdriveSync()} />
        </SyncStatus>
      )
  }
})
