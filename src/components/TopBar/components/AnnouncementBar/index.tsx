import { Alert } from '@material-ui/core'
import React from 'react'

interface AnnouncementBarProps {
  label: string
  onClose: () => void
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onClose, label }) => {
  return (
    <Alert onClose={onClose} severity="info">
      {label}
    </Alert>
  )
}
