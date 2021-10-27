import { Hidden, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import logo from '@/assets/images/cgrLogoDark.svg'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import {
  GETREG_LOGO,
  NAVBAR_ABOUT,
  NAVBAR_SEARCH_COURSE,
  NAVBAR_TIMETABLE,
  STUDY_PROGRAM_DROPDOWN,
} from '@/common/context/Analytics/constants'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { Spacer } from '@/components/Spacer'

import { ConfigBarItem } from '../ConfigBar/styled'
import { MobileNavBar } from '../MobileNavBar'
import { NavBarItem } from '../NavBarItem'
import { StudyProgramDropdown } from '../StudyProgramDropdown'
import { TermDropdown } from '../TermDropdown'
import { UserButton } from '../UserButton'
import { FlexContainer } from '../styled'
import { NavBarLayout, Logo } from './styled'

export function NavBar() {
  const { t } = useTranslation()
  const { studyProgram, academicYear, semester } = useCourseGroup()

  const navbarItems = [
    {
      href: `/${studyProgram}/courses`,
      elementName: NAVBAR_SEARCH_COURSE,
      label: t('navBar:searchCourses'),
    },
    {
      href: `/${studyProgram}/schedule`,
      elementName: NAVBAR_TIMETABLE,
      label: t('navBar:timetable'),
    },
    {
      href: `/about`,
      elementName: NAVBAR_ABOUT,
      label: t('navBar:about'),
    },
  ]

  return (
    <NavBarLayout>
      <FlexContainer>
        <LinkWithAnalytics href={`/${studyProgram}/courses`} passHref elementName={GETREG_LOGO}>
          <Logo>
            <img src={logo} alt={t('appName')} />
          </Logo>
        </LinkWithAnalytics>

        <Hidden mdDown>
          {navbarItems.map(({ href, elementName, label }) => (
            <LinkWithAnalytics key={elementName} href={href} passHref elementName={elementName}>
              <NavBarItem>{label}</NavBarItem>
            </LinkWithAnalytics>
          ))}
          <Spacer />
          <UserButton />
        </Hidden>
        <Hidden mdUp>
          <Spacer />
          <Analytics elementName={STUDY_PROGRAM_DROPDOWN}>{({ log }) => <StudyProgramDropdown log={log} />}</Analytics>
          <ConfigBarItem>
            <TermDropdown />
          </ConfigBarItem>
          <MobileNavBar />
        </Hidden>
      </FlexContainer>
    </NavBarLayout>
  )
}
