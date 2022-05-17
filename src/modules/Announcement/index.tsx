import { Divider, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { formatRelative } from 'date-fns'
import { GetServerSideProps } from 'next'
import { IGetPlaiceholderReturn } from 'plaiceholder'

import { Fragment, useMemo } from 'react'

import { PageMeta } from '@/components/PageMeta'
import { CMS_URL, SITE_URL } from '@/env'
import { initializeApollo, addApolloState } from '@/services/apollo'
import { GetAnnouncementResponse, GET_ANNOUNCEMENT, GetAnnouncementVars } from '@/services/apollo/query/getAnnouncement'
import { Announcement, AnnouncementComponentType } from '@/services/apollo/types/announcement'

import { MediaContent } from './components/MediaContent'
import { ParagraphContent } from './components/ParagraphContent'

interface BlurMedia {
  base64: string
  img: IGetPlaiceholderReturn['img']
}
interface BlurMediaMap {
  [contentId: string]: BlurMedia
}

interface AnnouncementPageProps {
  announcement?: Announcement
  blurMedias: BlurMediaMap
}

const capitalize = (sentence: string) => {
  const [firstWord, ...rest] = sentence.split(' ')
  const capitalizedFirstWord = `${firstWord.charAt(0).toUpperCase()}${firstWord.slice(1)}`
  return `${capitalizedFirstWord} ${rest.join(' ')}`
}

export const AnnouncementPage: React.FC<AnnouncementPageProps> = ({ announcement, blurMedias }) => {
  const createdAt = useMemo(() => {
    if (!announcement?.created_at) return null
    return capitalize(formatRelative(new Date(announcement.created_at), new Date()))
  }, [announcement?.created_at])

  if (!announcement) {
    return (
      <Stack alignItems="center" justifyContent="center" flexGrow={1}>
        <Typography variant="h5">ไม่พบประกาศ</Typography>
      </Stack>
    )
  }

  const { title, contents } = announcement

  return (
    <Stack sx={{ maxWidth: '720px' }} flexGrow={1} mt={4} mb={12} mx="auto">
      <PageMeta title={title} />
      <Stack gap={2} flexGrow={1}>
        <Typography variant="h2">{title}</Typography>
        <Divider />
        <Stack direction="column" gap={2} alignItems="flex-end">
          <Typography variant="caption" color="primaryRange.100">
            {createdAt}
          </Typography>
        </Stack>
        {contents.map((content) => (
          <Fragment key={content.id}>
            {content.__typename === AnnouncementComponentType.Media ? (
              <MediaContent {...content} base64={blurMedias[content.id].base64} img={blurMedias[content.id].img} />
            ) : (
              <ParagraphContent {...content} />
            )}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps<AnnouncementPageProps> = async (context) => {
  const apolloClient = initializeApollo()
  const title = decodeURIComponent(context.query.title as string)

  const { data } = await apolloClient.query<GetAnnouncementResponse, GetAnnouncementVars>({
    query: GET_ANNOUNCEMENT,
    variables: {
      title,
    },
    context: {
      cms: true,
    },
  })

  const announcement = data.announcements?.[0] ?? null

  if (!announcement) {
    return { props: {} }
  }

  const plaiceholders = await Promise.all(
    announcement.contents.map(async (content) => {
      if (content.__typename === AnnouncementComponentType.Media) {
        const { data } = await axios.post<BlurMedia>(`${SITE_URL}/api/plaiceholder`, {
          url: `${CMS_URL}${content.media.url}`,
        })
        const { base64, img } = data
        return { contentId: content.id, base64, img }
      }
      return undefined
    })
  )

  const blurMedias = plaiceholders.reduce((prev, curr) => {
    if (curr) prev[curr.contentId] = curr
    return prev
  }, {} as BlurMediaMap)

  // store into the apollo cache
  return addApolloState(apolloClient, {
    props: {
      announcement: data.announcements?.[0] ?? null,
      blurMedias,
    },
  })
}
