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
} from '@mui/material'
import { useGetPendingReviewsQuery } from '@cgr/codegen'
import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()

  return (
    <>
      <Container>
        <Grid container paddingY={5} justifyContent={'space-between'} alignItems="center">
          <Typography fontSize={32}>Review Approval</Typography>

          <Grid item>
            <Grid container gap={3}>
              <Grid item>
                <FormControl
                  size="small"
                  sx={{
                    width: 120,
                    height: 40,
                  }}
                >
                  <InputLabel>Year</InputLabel>
                  <Select label="Year">
                    <MenuItem value={2564}>2564</MenuItem>
                    <MenuItem value={2565}>2565</MenuItem>
                    <MenuItem value={2566}>2566</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl
                  size="small"
                  sx={{
                    width: 120,
                    height: 40,
                    //marginLeft: 3,
                  }}
                >
                  <InputLabel>Sem</InputLabel>
                  <Select label="Semester">
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-basic"
                  label="Search"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: 240,
                    height: 40,
                    // marginLeft: 3,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          // paddingY={16}
          // paddingX={24}
          justifyContent="space-between"
          alignItems="center"
        >
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
        </Grid>

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
      </Container>
    </>
  )
}
