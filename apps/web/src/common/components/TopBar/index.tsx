import { useRouter } from 'next/router'

import { AnnouncementBar } from './components/AnnouncementBar'
import {
  getAnnouncement1,
  getNotRegChulaWarning,
  term67Issue,
} from './components/AnnouncementBar/announcements'
import { ConfigBar } from './components/ConfigBar'
import { ConfigBarLayout } from './components/ConfigBar/styled'
import { NavBar } from './components/NavBar'
import { NavBarLayout } from './components/NavBar/styled'
import { StickyContainer, StickySpace, TopBarLayout } from './styled'

export function AnnouncementSection() {
  return (
    <>
      <AnnouncementBar announcement={getAnnouncement1()} />
      <AnnouncementBar announcement={getNotRegChulaWarning()} />
      <AnnouncementBar announcement={term67Issue()} />
    </>
  )
}

export function TopBar() {
  const { pathname } = useRouter()

  if (pathname === '/[studyProgram]/courses') {
    return (
      <>
        <ConfigBarLayout />
        <NavBarLayout />
        <StickyContainer>
          <TopBarLayout>
            <ConfigBar />
            <NavBar />
          </TopBarLayout>
          <StickySpace />
        </StickyContainer>
        <AnnouncementSection />
      </>
    )
  }

  return (
    <>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
      <AnnouncementSection />
    </>
  )
}
