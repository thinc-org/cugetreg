import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { Button } from '@material-ui/core'
import { motion } from 'framer-motion'

import { PaletteRange } from '@/configs/theme/palette'

function primaryRange(lum: PaletteRange) {
  return ({ theme }: { theme: Theme }) => theme.palette.primaryRange[lum]
}

export const CardLayout = styled.div`
  position: relative;
  margin-top: 24px;
  background: ${({ theme }) => theme.palette.background.default};
  border-radius: 4px;
  overflow: hidden;

  &:focus {
    outline: none;
  }
`

export const CardContent = styled(motion.div)`
  display: flex;
  ${({ theme }) => theme.breakpoints.down('md')} {
    width: calc(100% + 40px);
  }
`

export const CardBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid ${primaryRange(50)};
  border-radius: 4px;
  pointer-events: none;
`

export const OverlappingCardBorder = styled(CardBorder)`
  border: 3px solid ${({ theme }) => theme.palette.highlight.red[500]};
`

export const VisibilityToggle = styled(Button)<{ checked: boolean }>`
  color: ${primaryRange(100)};
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

  ${({ theme }) => theme.breakpoints.down('md')} {
    border-radius: 4px 0 0 0;
  }
`

export const DeleteButton = styled(Button)`
  color: white;
  border-radius: 0 0 0 4px;

  background-color: ${({ theme }) => theme.palette.highlight.red[500]};
  &:hover {
    background-color: ${({ theme }) => theme.palette.highlight.red[500]};
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: none;
  }
`

export const LeftPane = styled.div`
  display: flex;
  flex-direction: column;

  & button {
    flex: 1;
    width: 88px;
    font-size: 28px;
    border-radius: 4px;

    ${({ theme }) => theme.breakpoints.down('md')} {
      min-width: 40px;
      width: 40px;
      font-size: 20px;
    }
  }
`

export const MiddlePane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 24px;
`

export const HeaderLayout = styled.div`
  display: flex;
  height: 64px;
  padding-right: 16px;
  align-items: center;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: initial;
    padding-top: 16px;
    flex-direction: column;
    align-items: initial;

    & h6 {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  }
`

export const Spacer = styled.div`
  flex: 1;
`

export const GridSpacer = styled.div`
  width: 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

export const StyledLink = styled.a`
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: 0.2s ease-in-out;
  :hover {
    text-decoration-color: ${({ theme }) => theme.palette.primary.main};
  }
`
