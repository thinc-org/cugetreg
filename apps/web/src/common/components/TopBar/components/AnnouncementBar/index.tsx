import React from 'react'
import { useEffect, useState } from 'react'

import { Alert, Container, styled } from '@mui/material'
import { Storage } from '@web/common/storage'
import { StorageKey } from '@web/common/storage/constants'

import { getCurrentAnnoucement } from './announcements'
import { AnnoucementItem } from './types'

const AlertContainer = styled(Container)`
  padding-top: 16px;
`

export const AnnouncementBar: React.FC = () => {
  const currentAnnoucement = getCurrentAnnoucement()

  const [show, setShow] = useState(false)

  useEffect(() => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnoucementItem[]>(StorageKey.SeenAnnoucements) ?? []
    const seen = seenAnnoucements.some(({ id }) => id === currentAnnoucement.id)
    setShow(!seen)
  }, [currentAnnoucement])

  const handleClose = () => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnoucementItem[]>(StorageKey.SeenAnnoucements) ?? []
    storage.set<AnnoucementItem[]>(StorageKey.SeenAnnoucements, [
      ...seenAnnoucements,
      currentAnnoucement,
    ])
    setShow(false)
  }

  if (!show) {
    return null
  }

  return (
    <AlertContainer>
      <Alert onClose={handleClose} severity="info">
        {currentAnnoucement.label}
      </Alert>
    </AlertContainer>
  )
}
