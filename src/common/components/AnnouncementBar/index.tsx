import { Alert, styled, Container, Button } from '@mui/material'
import { format } from 'date-fns'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'

import { Storage } from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'
import { Announcement } from '@/services/apollo/types/announcement'

import { useCurrentAnnouncement } from './announcements'

interface AnnouncementItem extends Pick<Announcement, 'id' | 'title'> {}

const AlertContainer = styled(Container)`
  cursor: pointer;
  padding-top: ${({ theme }) => theme.spacing(2)};
  .MuiAlert-message {
    display: flex;
    direction: row;
    flex-grow: 1;
    justify-content: space-between;
  }
  .MuiAlert-action {
    padding-top: 0;
  }
`

export const AnnouncementBar: React.FC = () => {
  const [show, setShow] = useState(true)
  const { data, loading, error } = useCurrentAnnouncement()
  const createdAt = data?.created_at ? format(new Date(data?.created_at), 'dd/MM/yyyy, kk:mm') : null

  useEffect(() => {
    const storage = new Storage('localStorage')
    const seenAnnouncements = storage.get<AnnouncementItem[]>(StorageKey.SeenAnnouncements) ?? []
    const seen = seenAnnouncements.some(({ id }) => id === data?.id)
    setShow(!seen)
  }, [data])

  const handleClick = () => {
    const storage = new Storage('localStorage')
    const seenAnnouncements = storage.get<AnnouncementItem[]>(StorageKey.SeenAnnouncements) ?? []
    if (data)
      storage.set<AnnouncementItem[]>(StorageKey.SeenAnnouncements, [
        ...seenAnnouncements,
        {
          id: data.id,
          title: data.title,
        },
      ])
    setShow(false)
  }

  if (loading || error || !data || !show) return null

  return (
    <AlertContainer>
      <Alert
        severity="info"
        action={
          <Link passHref href={`/announcements/${encodeURIComponent(data.title)}`}>
            <Button color="inherit" size="small" onClick={handleClick}>
              View
            </Button>
          </Link>
        }
      >
        <div>{data.title}</div>
        <div>{createdAt}</div>
      </Alert>
    </AlertContainer>
  )
}
