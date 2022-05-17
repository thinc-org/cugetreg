import styled from '@emotion/styled'

export const FooterContainer = styled.div`
  max-height: 300px;
  height: 100%;
  align-self: flex-end;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  position: relative;
  width: 100%;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 240px;
  }
`
