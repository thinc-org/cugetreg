import {
  AppBar,
  Container,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import SingleLink from './components/singleLink'
import { StyledListItem, StyledList } from './styled'

// Todo: change route names
const pages = [
  { title: 'Pending Reviews', url: '/pendingReviews' },
  { title: 'Approved Reviews', url: '/approvedReviews' },
  { title: 'GenEd', url: '/genEd' },
]

export default function SideBar() {
  return (
    <>
      <nav>
        <StyledList sx={{ width: '240px' }}>
          <Typography>Review</Typography>
          <StyledListItem disablePadding>
            <ListItemButton sx={{ width: '100%' }}>
              <ListItemText primary="Review Approval" />
            </ListItemButton>
            <ListItemButton sx={{ width: '100%' }}>
              <ListItemText sx={{ textAlign: 'right' }} primary="All Reviews" />
            </ListItemButton>
          </StyledListItem>
        </StyledList>

        <StyledList sx={{ width: '240px' }}>
          <Typography>GenEd</Typography>
          <StyledListItem disablePadding>
            <ListItemButton sx={{ width: '100%' }}>
              <ListItemText primary="All Types" />
            </ListItemButton>
            <ListItemButton sx={{ width: '100%' }}>
              <ListItemText primary="HU (มนุษย์)" />
            </ListItemButton>
          </StyledListItem>
        </StyledList>
      </nav>
    </>
    // <StyledAppBar position="static">
    //   <Box>
    //     {pages.map((data) => (
    //       <SingleLink title={data.title} url={data.url} />
    //     ))}
    //   </Box>
    // </StyledAppBar>
  )
}
