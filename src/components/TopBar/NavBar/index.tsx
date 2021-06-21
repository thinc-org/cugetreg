import { useTranslation } from 'react-i18next'
import Link from 'next/link'
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

const NavBarLayout = styled.div`
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
        <Link href="/" passHref>
          <Logo>
            <img src={logo} alt={t('appName')} />
          </Logo>
        </Link>
        <Hidden smDown>
          <Link href={`/${studyProgram}/courses`} passHref>
            <NavBarItem>{t('navBar:searchCourses')}</NavBarItem>
          </Link>
          <Link href={`/${studyProgram}/schedule`} passHref>
            <NavBarItem>{t('navBar:timetable')}</NavBarItem>
          </Link>
          <FlexOne />
          <UserButton />
        </Hidden>
        <Hidden smUp>
          <FlexOne />
          <StudyProgramDropdown />
          <ConfigBarItem>
            {academicYear}/{semester}
          </ConfigBarItem>
          <MobileNavBar />
        </Hidden>
      </FlexContainer>
    </NavBarLayout>
  )
}
