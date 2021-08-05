import { Alert } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface AnnouncementBarProps {
  show: boolean
  onClose: () => void
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ show, onClose }) => {
  const { t } = useTranslation('announcement')

  if (!show) return null

  return (
    <Alert onClose={onClose} severity="info">
      {t('announcement')}
    </Alert>
  )
}
