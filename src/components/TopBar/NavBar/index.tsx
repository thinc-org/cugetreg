import { useTranslation } from 'react-i18next'
import logo from '@/assets/images/cgrLogoDark.svg'
import { NavBarItem } from './NavBarItem'
import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import UserButton from './UserButton'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import styled from '@emotion/styled'
import { Hidden } from '@material-ui/core'
import StudyProgramDropdown from '../components/StudyProgramDropdown'
import { ConfigBarItem } from '../ConfigBar/ConfigBarItem'
import { MobileNavBar } from '../MobileNavBar'
import { Analytics } from '@/context/analytics/components/Analytics'
import {
  GETREG_LOGO,
  NAVBAR_SEARCH_COURSE,
  NAVBAR_TIMETABLE,
  STUDY_PROGRAM_DROPDOWN,
} from '@/context/analytics/components/const'
import { LinkWithAnalytics } from '@/context/analytics/components/LinkWithAnalytics'

export const NavBarLayout = styled.div`
  width: 100%;
  height: 84px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.primary.main};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 60px;
  }
`

const Logo = styled.a`
  margin-left: -16px;
  padding: 0 16px;

  &,
  img {
    height: 40px;

    ${({ theme }) => theme.breakpoints.down('sm')} {
      height: 24px;
    }
  }
`

export function NavBar() {
  const { t } = useTranslation()
  const { studyProgram, academicYear, semester } = useCourseGroup()
  return (
    <NavBarLayout>
      <FlexContainer>
        <LinkWithAnalytics href={`/${studyProgram}/courses`} passHref elementName={GETREG_LOGO}>
          <Logo>
            <img src={logo} alt={t('appName')} />
          </Logo>
        </LinkWithAnalytics>

        <Hidden smDown>
          <LinkWithAnalytics href={`/${studyProgram}/courses`} passHref elementName={NAVBAR_SEARCH_COURSE}>
            <NavBarItem>{t('navBar:searchCourses')}</NavBarItem>
          </LinkWithAnalytics>

          <LinkWithAnalytics href={`/${studyProgram}/schedule`} passHref elementName={NAVBAR_TIMETABLE}>
            <NavBarItem>{t('navBar:timetable')}</NavBarItem>
          </LinkWithAnalytics>

          <FlexOne />
          <UserButton />
        </Hidden>
        <Hidden smUp>
          <FlexOne />
          <Analytics elementName={STUDY_PROGRAM_DROPDOWN}>{({ log }) => <StudyProgramDropdown log={log} />}</Analytics>
          <ConfigBarItem>
            {academicYear}/{semester}
          </ConfigBarItem>
          <MobileNavBar />
        </Hidden>
      </FlexContainer>
    </NavBarLayout>
  )
}
