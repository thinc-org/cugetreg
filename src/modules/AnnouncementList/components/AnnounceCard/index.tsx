import { Typography } from '@mui/material'
import { formatRelative } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import { memo, useMemo } from 'react'

import { CMS_URL } from '@/env'
import {
  Announcement,
  AnnouncementComponentType,
  AnnouncementComponentArticleMedia,
} from '@/services/apollo/types/announcement'

import { Card, ImageContainer, Content } from './styled'

interface AnnounceCardProps extends Announcement {}

export const AnnounceCard = memo(({ title, created_at, contents }: AnnounceCardProps) => {
  const createdAt = formatRelative(new Date(created_at), new Date())

  const firstMedia = useMemo(() => {
    const mediaContent = contents.find((content) => {
      if (content.__typename === AnnouncementComponentType.Media) return content.media.url
    }) as AnnouncementComponentArticleMedia | undefined
    return mediaContent?.media
  }, [contents])

  console.log(title, firstMedia)

  return (
    <Link href={`/announcements/${encodeURIComponent(title)}`} passHref>
      <Card>
        {firstMedia ? (
          <ImageContainer>
            <Image
              src={`${CMS_URL}${firstMedia.url}`}
              alt={title}
              width={firstMedia.width}
              height={firstMedia.height}
              layout="responsive"
            />
          </ImageContainer>
        ) : (
          <ImageContainer>
            <Image src="/cover2.jpg" alt={title} width={480} height={240} layout="responsive" />
          </ImageContainer>
        )}
        <Content>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body2">Created {createdAt}</Typography>
        </Content>
      </Card>
    </Link>
  )
})
