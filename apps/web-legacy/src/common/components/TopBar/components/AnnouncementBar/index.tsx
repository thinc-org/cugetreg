import { FC, useEffect, useState } from 'react'

import { Alert, Container, styled } from '@mui/material'

import { Storage } from '@web/common/storage'
import { StorageKey } from '@web/common/storage/constants'

import { AnnouncementItem } from './types'

const AlertContainer = styled(Container)`
  padding-top: 16px;
`

type AnnouncementBarProps = { announcement: AnnouncementItem }

export const AnnouncementBar: FC<AnnouncementBarProps> = ({ announcement }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnouncementItem[]>(StorageKey.SeenAnnoucements) ?? []
    const seen = seenAnnoucements.some(({ id }) => id === announcement.id)
    setShow(!seen)
  }, [announcement])

  const handleClose = () => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnouncementItem[]>(StorageKey.SeenAnnoucements) ?? []
    storage.set<AnnouncementItem[]>(StorageKey.SeenAnnoucements, [
      ...seenAnnoucements,
      announcement,
    ])
    setShow(false)
  }

  if (!show) {
    return null
  }

  return (
    <AlertContainer>
      <Alert onClose={handleClose} severity={announcement.severity}>
        {announcement.label}
      </Alert>
    </AlertContainer>
  )
}
