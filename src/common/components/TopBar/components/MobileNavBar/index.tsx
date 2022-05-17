import { Drawer } from '@mui/material'
import { default as MaterialLink } from '@mui/material/Link'
import { observer } from 'mobx-react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MdMenu } from 'react-icons/md'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/common/context/Analytics/components/LinkWithAnalytics'
import {
  REPORT_PROBLEM,
  NAVBAR_SEARCH_COURSE,
  NAVBAR_TIMETABLE,
  NAVBAR_ABOUT,
  NAVBAR_ANNOUNCEMENTS,
} from '@/common/context/Analytics/constants'
import { useDisclosure } from '@/common/hooks/useDisclosure'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { sessionIdStore } from '@/store/sessionIdStore'

import { NavBarItem } from '../NavBarItem'
import { UserButton } from '../UserButton'
import { MoreButton, DrawerContent, SectionSpacer, Logo } from './styled'

export const MobileNavBar = observer(() => {
  const { t } = useTranslation(['navBar', 'translation', 'configBar'])
  const { asPath } = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { buildLink } = useLinkBuilder()

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
          <Logo>
            <Image
              src="/assets/images/cgrLogoDark.svg"
              layout="fill"
              objectFit="contain"
              alt={t('translation:appName')}
            />
          </Logo>
          <div>
            <LinkWithAnalytics href={buildLink(`/courses`)} passHref elementName={NAVBAR_SEARCH_COURSE}>
              <NavBarItem onClick={onClose}>{t('navBar:searchCourses')}</NavBarItem>
            </LinkWithAnalytics>
          </div>
          <div>
            <LinkWithAnalytics href={buildLink(`/schedule`)} passHref elementName={NAVBAR_TIMETABLE}>
              <NavBarItem onClick={onClose}>{t('navBar:timetable')}</NavBarItem>
            </LinkWithAnalytics>
          </div>
          <div>
            <LinkWithAnalytics
              href={buildLink(`/announcements`, {}, false)}
              passHref
              elementName={NAVBAR_ANNOUNCEMENTS}
            >
              <NavBarItem onClick={onClose}>{t('navBar:announcements')}</NavBarItem>
            </LinkWithAnalytics>
          </div>
          <div>
            <LinkWithAnalytics href={buildLink(`/about`, {}, false)} passHref elementName={NAVBAR_ABOUT}>
              <NavBarItem onClick={onClose}>{t('navBar:about')}</NavBarItem>
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
