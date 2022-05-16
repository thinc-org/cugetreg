import { useQuery } from '@apollo/client'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'

import { PageMeta } from '@/components/PageMeta'
import { initializeApollo, addApolloState } from '@/services/apollo'
import {
  GetAllAnnouncementsResponse,
  GetAllAnnouncementsVars,
  GET_ALL_ANNOUNCEMENTS,
} from '@/services/apollo/query/getAllAnnouncements'

import { AnnounceCard } from './components/AnnounceCard'
import { ANNOUNCEMENTS_LIMIT } from './constants'

export const AnnouncementListPage: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<GetAllAnnouncementsResponse, GetAllAnnouncementsVars>(
    GET_ALL_ANNOUNCEMENTS,
    {
      variables: {
        limit: ANNOUNCEMENTS_LIMIT,
        start: 0,
      },
      context: {
        cms: true,
      },
    }
  )

  const onLoadMore = async () => {
    await fetchMore({
      variables: {
        start: data?.announcements.length,
      },
    })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error</p>

  return (
    <Stack direction="column" gap={2} alignItems="center" my={4} flexGrow={1}>
      <PageMeta title="ประกาศ" />
      <Typography variant="h2" alignSelf="flex-start">
        ประกาศ
      </Typography>
      <Grid container spacing={[2, 4]}>
        {data?.announcements.map((announcement) => (
          <Grid item key={announcement.id} xs={12} sm={6} md={4}>
            <AnnounceCard {...announcement} />
          </Grid>
        ))}
      </Grid>
      <div>
        <Button onClick={onLoadMore}>Load More</Button>
      </div>
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo()

  await apolloClient.query<GetAllAnnouncementsResponse, GetAllAnnouncementsVars>({
    query: GET_ALL_ANNOUNCEMENTS,
    variables: {
      limit: ANNOUNCEMENTS_LIMIT,
      start: 0,
    },
    context: {
      cms: true,
    },
  })

  // store into the apollo cache
  return addApolloState(apolloClient, {
    props: {},
  })
}
