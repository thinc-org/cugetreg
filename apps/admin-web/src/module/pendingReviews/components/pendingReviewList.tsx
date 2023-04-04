import {
  Container,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Stack,
} from '@mui/material'
import { useGetPendingReviewsQuery } from '@cgr/codegen'
import SinglePendingReview from './singlePendingReview'
import PendingReviewHeader from './pendingReviewHeader'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()
  console.log(reviewQuery.loading)
  return (
    <>
      <Container disableGutters>
        <PendingReviewHeader />
        {reviewQuery.loading
          ? // Todo: Reduce gaps between each skeleton
            // Todo: Add more skeleton (dynamically?)
            // <Grid spacing={0} direction="column">
            //   <Skeleton height={200} />
            //   <Skeleton height={200} />
            //   <Skeleton height={200} />
            // </Grid>
            // TODO: THiS Cause ERROR
            null
          : reviewQuery.data?.pendingReviews.map((data) => (
              <SinglePendingReview key={data._id} data={data} />
            ))}
      </Container>
    </>
  )
}
