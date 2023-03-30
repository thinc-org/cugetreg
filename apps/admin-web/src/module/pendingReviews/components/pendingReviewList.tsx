import {
  Container,
  Skeleton,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { useGetPendingReviewsQuery } from '@cgr/codegen'
import SinglePendingReview from './singlePendingReview'
import PendingReviewHeader from './pendingReviewHeader'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()

  return (
    <>
      <Container>
        <PendingReviewHeader />
        {/* <Grid container padding={3} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Grid container gap={8}>
              <Grid item>
                <Typography>CourseNo.</Typography>
              </Grid>
              <Grid item>
                <Typography>Year</Typography>
              </Grid>
              <Grid item>
                <Typography>Semester</Typography>
              </Grid>
              <Grid item>
                <Typography>Star</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography>Approval</Typography>
          </Grid>
        </Grid> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '24px' }}>
                <Typography>CourseNo.</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography>Year</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography>Semester</Typography>
              </TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography>Star</Typography>
              </TableCell>
              <TableCell sx={{ width: '100%', padding: '24px' }}></TableCell>
              <TableCell sx={{ padding: '24px' }}>
                <Typography>Approval</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {reviewQuery.loading ? (
            // Todo: Reduce gaps between each skeleton
            // Todo: Add more skeleton (dynamically?)
            <Grid spacing={0} direction="column">
              <Skeleton height={200} />
              <Skeleton height={200} />
              <Skeleton height={200} />
            </Grid>
          ) : (
            reviewQuery.data?.pendingReviews.map((data) => <SinglePendingReview data={data} />)
          )}
        </Table>
      </Container>
    </>
  )
}
