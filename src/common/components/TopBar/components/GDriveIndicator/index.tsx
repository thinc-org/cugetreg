import { Tooltip, Stack } from '@mui/material'
import { observer } from 'mobx-react'

import { useTranslation } from 'react-i18next'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'

import { courseCartStore, CourseCartSyncState } from '@/store'

const SyncStatus: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <Tooltip title={title}>
      <Stack alignItems="center">{children}</Stack>
    </Tooltip>
  )
}

export const GDriveIndicator = observer(() => {
  const { t } = useTranslation('syncStatus')
  console.log('Sync state', courseCartStore.syncState)
  switch (courseCartStore.syncState) {
    case CourseCartSyncState.OFFLINE:
      return null
    case CourseCartSyncState.FAIL:
      return (
        <SyncStatus title={t('syncerr')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case CourseCartSyncState.SYNCING:
      return (
        <SyncStatus title={t('syncing')}>
          <MdCloudQueue />
        </SyncStatus>
      )
    case CourseCartSyncState.SYNCED:
      return (
        <SyncStatus title={t('synced')}>
          <MdCloudDone />
        </SyncStatus>
      )
  }
})
