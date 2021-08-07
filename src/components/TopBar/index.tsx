import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Storage from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'

import { ConfigBar, ConfigBarLayout } from './ConfigBar'
import { NavBar, NavBarLayout } from './NavBar'
import { AnnouncementBar } from './components/AnnouncementBar'
import { AnnoucementItem } from './types'
import { getCurrentAnnoucement } from './utils'

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
  z-index: ${({ theme }) => theme.zIndex.drawer};
  position: sticky;
  top: 0;
`

const Container = styled.div`
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows[4]};
`

const StickySpace = styled.div`
  height: 68px;
`

export function TopBar() {
  const { pathname } = useRouter()

  const storage = new Storage('localStorage')
  const seenAnnoucements = storage.get<AnnoucementItem[]>(StorageKey.SeenAnnoucements)
  const currentAnnoucement = getCurrentAnnoucement()

  const [show, setShow] = useState(() => {
    console.log(seenAnnoucements, !seenAnnoucements?.find(({ id }) => id === currentAnnoucement.id))
    return !seenAnnoucements?.find(({ id }) => id === currentAnnoucement.id)
  })

  const handleClose = () => {
    const prevAnnoucements = seenAnnoucements ?? []
    storage.set<AnnoucementItem[]>(StorageKey.SeenAnnoucements, [...prevAnnoucements, currentAnnoucement])
    setShow(false)
  }

  if (pathname === '/[studyProgram]/courses') {
    return (
      <>
        <ConfigBarLayout />
        <NavBarLayout />
        <StickyContainer>
          <TopBarLayout>
            <Container>
              <ConfigBar />
              <NavBar />
            </Container>
          </TopBarLayout>
          <StickySpace />
        </StickyContainer>
        <AnnouncementBar show={show} onClose={handleClose} label={currentAnnoucement.label} />
      </>
    )
  }

  return (
    <TopBarContainer>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
      <AnnouncementBar show={show} onClose={handleClose} label={currentAnnoucement.label} />
    </TopBarContainer>
  )
}
