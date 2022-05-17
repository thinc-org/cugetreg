import { Divider, Stack, Typography } from '@mui/material'
import { formatRelative } from 'date-fns'
import { GetServerSideProps } from 'next'
import { getPlaiceholder, IGetPlaiceholderReturn } from 'plaiceholder'

import { Fragment } from 'react'

import { PageMeta } from '@/components/PageMeta'
import { CMS_URL } from '@/env'
import { initializeApollo, addApolloState } from '@/services/apollo'
import { GetAnnouncementResponse, GET_ANNOUNCEMENT, GetAnnouncementVars } from '@/services/apollo/query/getAnnouncement'
import { Announcement, AnnouncementComponentType } from '@/services/apollo/types/announcement'

import { MediaContent } from './components/MediaContent'
import { ParagraphContent } from './components/ParagraphContent'

interface BlurMedia {
  [contentId: string]: {
    base64: string
    img: IGetPlaiceholderReturn['img']
  }
}

interface AnnouncementPageProps {
  announcement?: Announcement
  blurMedias: BlurMedia
}

export const AnnouncementPage: React.FC<AnnouncementPageProps> = ({ announcement, blurMedias }) => {
  if (!announcement) {
    return (
      <Stack alignItems="center" justifyContent="center" flexGrow={1}>
        <Typography variant="h5">ไม่พบประกาศ</Typography>
      </Stack>
    )
  }

  const { title, created_at, contents } = announcement
  const createdAt = formatRelative(new Date(created_at), new Date())

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
        const { base64, img } = await getPlaiceholder(`${CMS_URL}${content.media.url}`)
        return { contentId: content.id, base64, img }
      }
      return undefined
    })
  )

  const blurMedias = plaiceholders.reduce((prev, curr) => {
    if (curr) prev[curr.contentId] = curr
    return prev
  }, {} as BlurMedia)

  // store into the apollo cache
  return addApolloState(apolloClient, {
    props: {
      announcement: data.announcements?.[0] ?? null,
      blurMedias,
    },
  })
}
