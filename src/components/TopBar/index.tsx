import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { AnnouncementBar } from '@/components/TopBar/components/AnnouncementBar'

import { ConfigBar, ConfigBarLayout } from './ConfigBar'
import { NavBar, NavBarLayout } from './NavBar'

const StickyContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
`

const TopBarContainer = styled.div`
  z-index: 100;
  position: sticky;
  top: 0;
`

const TopBarLayout = styled.div`
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows[4]};
`

const StickySpace = styled.div`
  height: 68px;
`

export function TopBar() {
  const { pathname } = useRouter()

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
  }

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
        <AnnouncementBar show={show} onClose={handleClose} />
      </>
    )
  }

  return (
    <TopBarContainer>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
      <AnnouncementBar show={show} onClose={handleClose} />
    </TopBarContainer>
  )
}
