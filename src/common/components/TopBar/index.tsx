import styled from '@emotion/styled'
import { useRouter } from 'next/router'

import { AnnouncementBar } from '@/common/components/TopBar/components/AnnouncementBar'

import { ConfigBar, ConfigBarLayout } from './components/ConfigBar'
import { NavBar, NavBarLayout } from './components/NavBar'

const StickyContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
`

const TopBarLayout = styled.div`
  position: sticky;
  top: 0;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  z-index: 100;
`

const StickySpace = styled.div`
  height: 68px;
`

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
        <AnnouncementBar />
      </>
    )
  }

  return (
    <>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
      <AnnouncementBar />
    </>
  )
}