import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'

export default function PendingReviewHeader() {
  return (
    <>
      <Grid
        container
        sx={{ paddingX: 3, paddingY: 2 }}
        justifyContent={'space-between'}
        alignItems="center"
      >
        <Typography variant="h1" mb={{ xs: 1, lg: 0 }}>
          Review Approval
        </Typography>

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
    </>
  )
}
