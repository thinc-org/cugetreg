import { useRouter } from 'next/router'

import { ConfigBar } from './components/ConfigBar'
import { ConfigBarLayout } from './components/ConfigBar/styled'
import { NavBar } from './components/NavBar'
import { NavBarLayout } from './components/NavBar/styled'
import { StickyContainer, TopBarLayout, StickySpace } from './styled'

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
      </>
    )
  }

  return (
    <>
      <TopBarLayout>
        <ConfigBar />
        <NavBar />
      </TopBarLayout>
    </>
  )
}
