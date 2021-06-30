import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import styled from '@emotion/styled'
import { Drawer, IconButton } from '@material-ui/core'
import { default as MaterialLink } from '@material-ui/core/Link'
import { MdMenu } from 'react-icons/md'
import logo from '@/assets/images/cgrLogoDark.svg'
import { useTranslation } from 'react-i18next'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import Link from 'next/link'
import { NavBarItem } from '../NavBar/NavBarItem'
import UserButton from '../NavBar/UserButton'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Analytics } from '@/context/analytics/components/Analytics'
import { REPORT_PROBLEM, NAVBAR_SEARCH_COURSE, NAVBAR_TIMETABLE } from '@/context/analytics/components/const'
import { observer } from 'mobx-react'

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

// const NavbarItemLink = NavBarItem.withComponent('a')

export const MobileNavBar = observer(() => {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { studyProgram } = useCourseGroup()

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

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
            <Analytics elementName={NAVBAR_SEARCH_COURSE}>
              {({ log }) => (
                <Link href={`/${studyProgram}/courses`} passHref>
                  <NavBarItem
                    onClick={() => {
                      log()
                      onClose()
                    }}
                  >
                    {t('navBar:searchCourses')}
                  </NavBarItem>
                </Link>
              )}
            </Analytics>
          </div>
          <div>
            <Analytics elementName={NAVBAR_TIMETABLE}>
              {({ log }) => (
                <Link href={`/${studyProgram}/schedule`} passHref>
                  <NavBarItem
                    onClick={() => {
                      log()
                      onClose()
                    }}
                  >
                    {t('navBar:timetable')}
                  </NavBarItem>
                </Link>
              )}
            </Analytics>
          </div>
          <SectionSpacer />
          <div>
            <Analytics elementName={REPORT_PROBLEM}>
              {({ log }) => (
                <MaterialLink href={reportProblemLink} target="_blank" rel="noreferrer">
                  <NavBarItem onClick={log}>{t('configBar:reportAProblem')}</NavBarItem>
                </MaterialLink>
              )}
            </Analytics>
          </div>
          <div>
            <UserButton />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
})
