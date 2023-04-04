import { useGetPendingReviewsQuery } from '@cgr/codegen'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import PendingReviewHeader from './pendingReviewHeader'
import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const { loading, error, data } = useGetPendingReviewsQuery()

  return (
    <>
      <Container>
        <PendingReviewHeader />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '24px' }}>
                <Typography fontWeight={700}>CourseNo.</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography fontWeight={700}>Year</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography fontWeight={700}>Semester</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography fontWeight={700}>Star</Typography>
              </TableCell>
              <TableCell sx={{ width: '100%', padding: '24px' }}></TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography fontWeight={700}>Approval</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? // Todo: Reduce gaps between each skeleton
                // Todo: Add more skeleton (dynamically?)
                // <Grid spacing={0} direction="column">
                //   <Skeleton height={200} />
                //   <Skeleton height={200} />
                //   <Skeleton height={200} />
                // </Grid>
                // TODO: THiS Cause ERROR
                null
              : data?.pendingReviews.map((data) => (
                  <SinglePendingReview key={data._id} data={data} />
                ))}
          </TableBody>
        </Table>
      </Container>
    </>
  )
}
