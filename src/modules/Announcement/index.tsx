import { Divider, Stack, Typography } from '@mui/material'
import { formatRelative } from 'date-fns'
import { GetServerSideProps } from 'next'

import { Fragment } from 'react'

import { PageMeta } from '@/components/PageMeta'
import { initializeApollo, addApolloState } from '@/services/apollo'
import { GetAnnouncementResponse, GET_ANNOUNCEMENT, GetAnnouncementVars } from '@/services/apollo/query/getAnnouncement'
import { Announcement, AnnouncementComponentType } from '@/services/apollo/types/announcement'

import { MediaContent } from './components/MediaContent'
import { ParagraphContent } from './components/ParagraphContent'

interface AnnouncementPageProps extends Announcement {}

export const AnnouncementPage: React.FC<AnnouncementPageProps> = ({ title, created_at, contents }) => {
  const createdAt = formatRelative(new Date(created_at), new Date())

  return (
    <Stack sx={{ maxWidth: '720px' }} flexGrow={1} mt={4} mb={12} mx="auto">
      <PageMeta title={title} />
      <Stack gap={2} flexGrow={1}>
        <Typography variant="h2">{title}</Typography>
        <Divider />
        <Stack direction="column" gap={2} alignItems="flex-end" flexGrow={1}>
          <Typography variant="caption" color="primaryRange.100">
            {createdAt}
          </Typography>
        </Stack>
        {contents.map((content) => (
          <Fragment key={content.id}>
            {content.__typename === AnnouncementComponentType.Media ? (
              <MediaContent {...content} />
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

  // store into the apollo cache
  return addApolloState(apolloClient, {
    props: {
      ...data.announcements?.[0],
    },
  })
}
