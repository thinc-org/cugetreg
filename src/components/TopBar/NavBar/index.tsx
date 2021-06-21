import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import logo from '@/assets/images/cgrLogoDark.svg'
import { NavBarItem } from './NavBarItem'
import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import UserButton from './UserButton'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

const useStyles = makeStyles((theme) => ({
  navBar: {
    width: '100%',
    height: 83,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
  },
  logo: {
    // Extend horizontal hit target
    marginLeft: -16,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
  },
}))

export function NavBar() {
  const { t } = useTranslation()
  const classes = useStyles()
  const { studyProgram } = useCourseGroup()
  return (
    <div className={classes.navBar}>
      <FlexContainer>
        <Link href="/">
          <a className={classes.logo}>
            <img src={logo} alt={t('appName')} height="40" />
          </a>
        </Link>
        <Link href={`/${studyProgram}/courses`} passHref>
          <NavBarItem>{t('navBar:searchCourses')}</NavBarItem>
        </Link>
        <Link href={`/${studyProgram}/schedule`} passHref>
          <NavBarItem>{t('navBar:timetable')}</NavBarItem>
        </Link>
        <FlexOne />
        <UserButton />
      </FlexContainer>
    </div>
  )
}
