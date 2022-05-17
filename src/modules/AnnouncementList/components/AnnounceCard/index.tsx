import { Stack, Typography } from '@mui/material'
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

import { Card, SkeletonImage, ImageContainer } from './styled'

interface AnnounceCardProps extends Announcement {}

export const AnnounceCard = memo(({ title, created_at, contents }: AnnounceCardProps) => {
  const createdAt = formatRelative(new Date(created_at), new Date())

  const firstMedia = useMemo(() => {
    const mediaContent = contents.find((content) => {
      if (content.__typename === AnnouncementComponentType.Media) return content.media.url
    }) as AnnouncementComponentArticleMedia | undefined
    return mediaContent?.media
  }, [contents])

  console.log(firstMedia)

  return (
    <Link href={`/announcements/${encodeURIComponent(title)}`} passHref>
      <Card p={[2, 3]} boxShadow={2} borderRadius={1} gap={2}>
        {firstMedia ? (
          <ImageContainer>
            <Image
              src={`${CMS_URL}${firstMedia.url}`}
              alt={title}
              width={firstMedia.width}
              height={firstMedia.height}
            />
          </ImageContainer>
        ) : (
          <SkeletonImage />
        )}
        <Typography variant="h5">{title}</Typography>
        <Stack alignItems="flex-end">
          <Typography variant="body2">created {createdAt}</Typography>
        </Stack>
      </Card>
    </Link>
  )
})
