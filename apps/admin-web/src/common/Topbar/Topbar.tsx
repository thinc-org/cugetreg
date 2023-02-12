import { AppBar, Container, Typography, Box, Button } from '@mui/material'
import SingleLink from './components/singleLink'

const pages = [
  { title: 'Pending Reviews', url: '/pendingReviews' },
  { title: 'Approved Reviews', url: '/approvedReviews' },
  { title: 'GenEd', url: '/genEd' },
]

export default function Topbar() {
  return (
    // Todo: use other CSS library
    // Todo: change route names
    // <ul className={styles.navbar}>
    //   <li className={styles.navbarItem}>
    //     <Link href="/pendingReviews">Pending Reviews</Link>
    //   </li>
    //   <li>
    //     <Link href="/approvedReviews">Approved Reviews</Link>
    //   </li>
    //   <li>
    //     <Link href="/genEd">GenEd</Link>
    //   </li>
    // </ul>

    <AppBar position="static" sx={{ backgroundColor: '#000' }}>
      <Container maxWidth="xl">
        <Box>
          {pages.map((data) => (
            <SingleLink title={data.title} url={data.url} />
          ))}
        </Box>
      </Container>
    </AppBar>
  )
}
