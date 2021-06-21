import { NavBar, NavBarLayout } from './NavBar'
import { ConfigBar, ConfigBarLayout } from './ConfigBar'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'

const StickyContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
`

const TopBarLayout = styled.div`
  position: sticky;
  top: 0;
  box-shadow: ${({ theme }) => theme.shadows[4]};
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
      </>
    )
  }

  return (
    <TopBarLayout>
      <ConfigBar />
      <NavBar />
    </TopBarLayout>
  )
}
