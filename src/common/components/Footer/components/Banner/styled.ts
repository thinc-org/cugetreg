import styled from '@emotion/styled'
import { Stack, Typography } from '@material-ui/core'

// const useStyles = makeStyles((theme) => ({
//   banner: {
//     flexDirection: 'column',
//     height: '100%',
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//   },
//   bannerDetail: {
//     [theme.breakpoints.down('sm')]: {
//       flexDirection: 'column',
//     },
//     [theme.breakpoints.up('sm')]: {
//       flexDirection: 'row',
//     },
//   },
//   smallRow: {
//     flexGrow: 0,
//     width: 'auto',
//     padding: theme.spacing(0),
//     margin: theme.spacing(0),
//     justifyContent: 'flex-end',
//   },
//   bannerSubtitle: {
//     ...theme.typography.subtitle1,
//     [theme.breakpoints.down('sm')]: {
//       marginLeft: theme.spacing(2),
//     },
//     [theme.breakpoints.up('sm')]: {
//       margin: theme.spacing(0, 2),
//     },
//   },
//   divider: {
//     background: theme.palette.primary.contrastText,
//     [theme.breakpoints.down('sm')]: {
//       margin: theme.spacing(2, 0),
//       width: '90%',
//     },
//   },
//   logo: {
//     [theme.breakpoints.down('sm')]: {
//       marginLeft: theme.spacing(2),
//     },
//   },
//   bigLogo: {
//     [theme.breakpoints.down('sm')]: {
//       margin: theme.spacing(2),
//       maxWidth: '60%',
//     },
//     [theme.breakpoints.up('sm')]: {
//       marginBottom: theme.spacing(4),
//     },
//   },
//   link: {
//     display: 'flex',
//     flexDirection: 'row',
//     textDecoration: 'none',
//     color: 'inherit',
//   },
// }))

export const StyledStack = styled(Stack)`
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BannerContaienr = styled(StyledStack)`
  height: 100%;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: ${({ theme }) => theme.spacing(3)};
`

export const PrivacyLink = styled.div`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`

export const GithubLink = styled(Stack)`
  cursor: pointer;
`

export const BannerSubtitle = styled(Typography)`
  margin-right: ${({ theme }) => theme.spacing(1)};
`

BannerSubtitle.defaultProps = { variant: 'subtitle1' }
