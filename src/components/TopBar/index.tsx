import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

  const currentAnnoucement = getCurrentAnnoucement()

  const [show, setShow] = useState(false)

  useEffect(() => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnoucementItem[]>(StorageKey.SeenAnnoucements) ?? []
    const seen = seenAnnoucements.some(({ id }) => id === currentAnnoucement.id)
    setShow(!seen)
  }, [currentAnnoucement])

  const handleClose = () => {
    const storage = new Storage('localStorage')
    const seenAnnoucements = storage.get<AnnoucementItem[]>(StorageKey.SeenAnnoucements) ?? []
    storage.set<AnnoucementItem[]>(StorageKey.SeenAnnoucements, [...seenAnnoucements, currentAnnoucement])
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
        <AnnouncementBar show={show} onClose={handleClose} label={currentAnnoucement.label} />
      </>
    )
  }

  return (
    <>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
      <AnnouncementBar show={show} onClose={handleClose} label={currentAnnoucement.label} />
    </>
  )
}
