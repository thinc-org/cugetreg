import { Tooltip, Stack } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'

import { courseCartStore } from '@/store'

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
    case 'offline':
      return null
    case 'fail':
      return (
        <SyncStatus title={t('fail')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case 'syncing':
      return (
        <SyncStatus title={t('syncing')}>
          <MdCloudQueue />
        </SyncStatus>
      )
    case 'synced':
      return (
        <SyncStatus title={t('synced')}>
          <MdCloudDone />
        </SyncStatus>
      )
  }
})
