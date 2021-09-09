import styled from '@emotion/styled'

export const StickyContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
`

export const TopBarLayout = styled.div`
  position: sticky;
  top: 0;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  z-index: 100;
`

export const StickySpace = styled.div`
  height: 68px;
`
