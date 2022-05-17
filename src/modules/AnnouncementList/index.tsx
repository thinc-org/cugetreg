import { Grid, Pagination, Stack, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

import { PageMeta } from '@/components/PageMeta'
import { initializeApollo, addApolloState } from '@/services/apollo'
import {
  GetAllAnnouncementsResponse,
  GetAllAnnouncementsVars,
  GET_ALL_ANNOUNCEMENTS,
} from '@/services/apollo/query/getAllAnnouncements'

import { AnnounceCard } from './components/AnnounceCard'
import { ANNOUNCEMENTS_LIMIT } from './constants'

interface AnnouncementListPageProps {
  announcements: GetAllAnnouncementsResponse['announcements']
  totalCount: number
}

export const AnnouncementListPage: React.FC<AnnouncementListPageProps> = ({ announcements, totalCount }) => {
  const router = useRouter()
  const page = parseInt(router.query.page as string, 10) || 1
  const maxPageNumber = Math.ceil(totalCount / ANNOUNCEMENTS_LIMIT)

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    router.push(`/announcements?page=${page}`)
  }

  if (announcements.length === 0) {
    return (
      <Stack alignItems="center" justifyContent="center" flexGrow={1}>
        <Typography variant="h5">ไม่พบประกาศ</Typography>
      </Stack>
    )
  }

  return (
    <Stack direction="column" gap={2} alignItems="center" my={4} flexGrow={1}>
      <PageMeta title="ประกาศ" />
      <Typography variant="h2" alignSelf="flex-start">
        ประกาศ
      </Typography>
      <Grid container spacing={[2, 4]}>
        {announcements.map((announcement) => (
          <Grid item key={announcement.id} xs={12} sm={6} md={4}>
            <AnnounceCard {...announcement} />
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={maxPageNumber}
        page={page}
        variant="outlined"
        shape="rounded"
        onChange={handlePageChange}
        sx={{ mt: 4 }}
      />
    </Stack>
  )
}

export const getServerSideProps: GetServerSideProps<AnnouncementListPageProps> = async (ctx) => {
  const page = parseInt(ctx.query.page as string, 10) || 1
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<GetAllAnnouncementsResponse, GetAllAnnouncementsVars>({
    query: GET_ALL_ANNOUNCEMENTS,
    variables: {
      limit: ANNOUNCEMENTS_LIMIT,
      start: (page - 1) * ANNOUNCEMENTS_LIMIT,
    },
    context: {
      cms: true,
    },
  })

  // store into the apollo cache
  return addApolloState(apolloClient, {
    props: {
      announcements: data.announcements,
      totalCount: data.announcementsConnection.aggregate.totalCount,
    },
  })
}
