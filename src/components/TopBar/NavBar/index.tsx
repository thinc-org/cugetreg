import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import logo from '@/assets/images/logo.svg'
import { NavItem } from './NavItem'
import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'

const useStyles = makeStyles((theme) => ({
  navBar: {
    width: '100%',
    height: 83,
    color: theme.palette.primary.main,
  },
  logo: {
    // Extend horizontal hit target
    marginLeft: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
}))

export function NavBar() {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <div className={classes.navBar}>
      <FlexContainer>
        <Link href="/">
          <a className={classes.logo}>
            <img src={logo} alt={t('appName')} />
          </a>
        </Link>
        {/* TODO: replace with actual links */}
        <NavItem>{t('navBar:news')}</NavItem>
        <NavItem>{t('navBar:searchCourses')}</NavItem>
        <NavItem>{t('navBar:timetable')}</NavItem>
        <FlexOne />
        <NavItem>{t('navBar:signin')}</NavItem>
      </FlexContainer>
    </div>
  )
}
