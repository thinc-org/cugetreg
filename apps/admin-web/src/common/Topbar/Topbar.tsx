import { AppBar, Container, Typography, Box, Button } from '@mui/material'
import SingleLink from './components/singleLink'
import { StyledAppBar } from './styled'

// Todo: change route names
const pages = [
  { title: 'Pending Reviews', url: '/pendingReviews' },
  { title: 'Approved Reviews', url: '/approvedReviews' },
  { title: 'GenEd', url: '/genEd' },
]

export default function Topbar() {
  return (
    <StyledAppBar position="static">
      <Box>
        {pages.map((data) => (
          <SingleLink title={data.title} url={data.url} />
        ))}
      </Box>
    </StyledAppBar>
  )
}
