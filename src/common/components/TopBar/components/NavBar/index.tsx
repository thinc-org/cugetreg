import { Hidden } from '@mui/material'
import Image from 'next/image'

import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import {
  GETREG_LOGO,
  NAVBAR_ABOUT,
  NAVBAR_ANNOUNCEMENTS,
  NAVBAR_SEARCH_COURSE,
  NAVBAR_TIMETABLE,
  STUDY_PROGRAM_DROPDOWN,
} from '@/common/context/Analytics/constants'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
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
  const { t } = useTranslation(['navBar', 'translation'])
  const { buildLink } = useLinkBuilder()

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
    // {
    //   href: buildLink(`/announcements`, {}, false),
    //   elementName: NAVBAR_ANNOUNCEMENTS,
    //   label: t('navBar:announcements'),
    // },
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
            <img src="/assets/images/cgrLogoDark.svg" alt={t('translation:appName')} />
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
