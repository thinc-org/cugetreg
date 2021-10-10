import { Drawer } from '@material-ui/core'
import { default as MaterialLink } from '@material-ui/core/Link'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MdMenu } from 'react-icons/md'

import logo from '@/assets/images/cgrLogoDark.svg'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import { REPORT_PROBLEM, NAVBAR_SEARCH_COURSE, NAVBAR_TIMETABLE } from '@/common/context/Analytics/constants'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { useDisclosure } from '@/common/hooks/useDisclosure'
import { sessionIdStore } from '@/store/sessionIdStore'

import { NavBarItem } from '../NavBarItem'
import { UserButton } from '../UserButton'
import { MoreButton, DrawerContent, SectionSpacer, Logo } from './styled'

export const MobileNavBar = observer(() => {
  const { t } = useTranslation()
  const { asPath } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { studyProgram } = useCourseGroup()

  const sessionId = sessionIdStore.sessionId
  const reportProblemLink = `https://airtable.com/shruwAAfn1763TgMU?prefill_Session_ID=${sessionId}`

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
            <LinkWithAnalytics href={`/${studyProgram}/courses`} passHref elementName={NAVBAR_SEARCH_COURSE}>
              <NavBarItem onClick={onClose}>{t('navBar:searchCourses')}</NavBarItem>
            </LinkWithAnalytics>
          </div>
          <div>
            <LinkWithAnalytics href={`/${studyProgram}/schedule`} passHref elementName={NAVBAR_TIMETABLE}>
              <NavBarItem onClick={onClose}>{t('navBar:timetable')}</NavBarItem>
            </LinkWithAnalytics>
          </div>
          <SectionSpacer />
          <div>
            <Analytics elementName={REPORT_PROBLEM}>
              <MaterialLink href={reportProblemLink} target="_blank" rel="noreferrer">
                <NavBarItem>{t('configBar:reportAProblem')}</NavBarItem>
              </MaterialLink>
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
