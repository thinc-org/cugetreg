import { PaletteRange } from '@/configs/theme/palette'
import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { Button } from '@material-ui/core'

function primaryRange(lum: PaletteRange) {
  return ({ theme }: { theme: Theme }) => theme.palette.primaryRange[lum]
}

export const CardLayout = styled.div`
  display: flex;
  margin-top: 24px;
`

export const VisibilityToggle = styled(Button)<{ checked: boolean }>`
  width: 88px;
  font-size: 28px;
  color: ${primaryRange(100)};
  border: 1px solid ${primaryRange(50)};
  border-right: none;
  border-radius: 4px 0 0 4px;

  ${({ theme, checked }) => {
    const { primaryRange } = theme.palette
    if (checked) {
      return css`
        background-color: ${primaryRange[50]};
        &:hover {
          background-color: ${primaryRange[50]};
        }
      `
    } else {
      return css`
        background-color: ${primaryRange[10]};
        &:hover {
          background-color: ${primaryRange[10]};
        }
      `
    }
  }}
`

export const RightPane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 36px;
  border: 1px solid ${primaryRange(50)};
  border-left: none;
  border-radius: 0 4px 4px 0;
`

export const HeaderLayout = styled.div`
  display: flex;
  height: 64px;
  padding-right: 16px;
  align-items: center;
`

export const Spacer = styled.div`
  flex: 1;
`
