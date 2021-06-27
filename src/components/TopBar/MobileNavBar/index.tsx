import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import styled from '@emotion/styled'
import { Drawer, IconButton } from '@material-ui/core'
import { MdMenu } from 'react-icons/md'
import logo from '@/assets/images/cgrLogoDark.svg'
import { useTranslation } from 'react-i18next'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import Link from 'next/link'
import { NavBarItem } from '../NavBar/NavBarItem'
import UserButton from '../NavBar/UserButton'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const MoreButton = styled(IconButton)`
  margin-left: 12px;
  margin-right: -12px;
  color: ${({ theme }) => theme.palette.primary.main};
`

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 48px;
  padding-left: 28px;
  padding-right: 56px;
  padding-bottom: 48px;
`

const Logo = styled.img`
  height: 40px;
  margin-left: 8px;
  margin-bottom: 42px;
`

const SectionSpacer = styled.div`
  height: 24px;
`

export function MobileNavBar() {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { studyProgram } = useCourseGroup()

  const { asPath } = useRouter()
  useEffect(() => {
    onClose()
  }, [asPath, onClose])

  return (
    <>
      <MoreButton onClick={onOpen}>
        <MdMenu />
      </MoreButton>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <DrawerContent>
          <Logo src={logo} alt={t('appName')} />
          <div>
            <Link href={`/${studyProgram}/courses`} passHref>
              <NavBarItem>{t('navBar:searchCourses')}</NavBarItem>
            </Link>
          </div>
          <div>
            <Link href={`/${studyProgram}/schedule`} passHref>
              <NavBarItem>{t('navBar:timetable')}</NavBarItem>
            </Link>
          </div>
          <SectionSpacer />
          <div>
            <NavBarItem>{t('configBar:reportAProblem')}</NavBarItem>
          </div>
          <div>
            <UserButton />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
