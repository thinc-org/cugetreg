import { Alert } from '@material-ui/core'
import React from 'react'

interface AnnouncementBarProps {
  show: boolean
  label: string
  onClose: () => void
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ show, onClose, label }) => {
  if (!show) return null

  return (
    <Alert onClose={onClose} severity="info">
      {label}
    </Alert>
  )
}
