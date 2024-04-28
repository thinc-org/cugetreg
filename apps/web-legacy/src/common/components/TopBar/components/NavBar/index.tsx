import { useTranslation } from 'react-i18next'

import { useMediaQuery, useTheme } from '@mui/material'

import cgrLogoDark from '@web/assets/images/cgrLogoDark.svg'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@web/common/context/Analytics/components/LinkWithAnalytics'
import {
  GETREG_LOGO,
  NAVBAR_ABOUT,
  NAVBAR_SEARCH_COURSE,
  NAVBAR_TIMETABLE,
  STUDY_PROGRAM_DROPDOWN,
} from '@web/common/context/Analytics/constants'
import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'
import { Spacer } from '@web/components/Spacer'

import { ConfigBarItem } from '../ConfigBar/styled'
import { MobileNavBar } from '../MobileNavBar'
import { NavBarItem } from '../NavBarItem'
import { StudyProgramDropdown } from '../StudyProgramDropdown'
import { TermDropdown } from '../TermDropdown'
import { UserButton } from '../UserButton'
import { FlexContainer } from '../styled'
import { Logo, NavBarLayout } from './styled'

export function NavBar() {
  const { t } = useTranslation(['navBar', 'translation'])
  const { buildLink } = useLinkBuilder()
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  const navbarItems = [
    {
      href: buildLink(`/courses`),
      elementName: NAVBAR_SEARCH_COURSE,
      label: t('navBar:searchCourses'),
    },
    {
      href: buildLink(`/schedule`),
      elementName: NAVBAR_TIMETABLE,
      label: t('navBar:timetable'),
    },
    {
      href: buildLink(`/about`, {}, false),
      elementName: NAVBAR_ABOUT,
      label: t('navBar:about'),
    },
  ]

  return (
    <NavBarLayout>
      <FlexContainer>
        <LinkWithAnalytics href={buildLink(`/courses`)} passHref elementName={GETREG_LOGO}>
          <Logo>
            <img src={cgrLogoDark.src} alt={t('translation:appName')} />
          </Logo>
        </LinkWithAnalytics>
        {isLargeScreen ? (
          <>
            {navbarItems.map(({ href, elementName, label }) => (
              <LinkWithAnalytics key={elementName} href={href} passHref elementName={elementName}>
                <NavBarItem>{label}</NavBarItem>
              </LinkWithAnalytics>
            ))}
            <Spacer />
            <UserButton />
          </>
        ) : (
          <>
            <Spacer />
            <Analytics elementName={STUDY_PROGRAM_DROPDOWN}>
              {({ log }) => <StudyProgramDropdown log={log} />}
            </Analytics>
            <ConfigBarItem>
              <TermDropdown />
            </ConfigBarItem>
            <MobileNavBar />
          </>
        )}
      </FlexContainer>
    </NavBarLayout>
  )
}
