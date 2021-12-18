import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { Button, ButtonProps, NativeSelect } from '@mui/material'
import { m } from 'framer-motion'

import { forwardRef } from 'react'

import { deepAssign } from '@/common/utils/deepAssign'
import { PaletteRange } from '@/configs/theme/palette'

function primaryRange(lum: PaletteRange) {
  return ({ theme }: { theme: Theme }) => theme.palette.primaryRange[lum]
}

export const CardLayout = styled.div`
  position: relative;
  margin-top: 24px;
  background: ${({ theme }) => theme.palette.background.default};
  overflow: hidden;

  &:focus {
    outline: none;
  }
`

export const CardContent = styled(m.div)`
  position: relative;
  display: flex;
  z-index: 1;
  background-color: white;
  left: 88px;
  width: calc(100% - 88px);
  border-radius: 4px;
  ${({ theme }) => theme.breakpoints.down('md')} {
    width: calc(100% - 40px);
    left: 40px;
  }
`

export const CardBorder = styled.div`
  position: absolute;
  z-index: 1;
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

export const Pane = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;

  & button {
    flex: 1;
    width: 88px;
    font-size: 28px;

    ${({ theme }) => theme.breakpoints.down('md')} {
      min-width: 40px;
      width: 40px;
      font-size: 20px;
    }
  }
`

export const LeftPane = styled(Pane)`
  right: auto;
  & button {
    border-radius: 4px 0 0 4px;
  }
`

export const RightPane = styled(Pane)`
  left: auto;
  & button {
    border-radius: 0 4px 4px 0;
  }
`

export const MiddlePane = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing(3)};
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

export const StyledNativeSelect = styled(NativeSelect)`
  &&& select {
    height: 24px;
    padding: 4px 32px 4px 16px;
    border: 1.5px solid ${({ theme }) => theme.palette.primaryRange[50]};
    border-radius: 4px;

    &:focus {
      border-radius: 4px;
      background: none;
    }
  }

  svg {
    margin-right: 8px;
  }

  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
`

export const ColorPickerButton = forwardRef<HTMLButtonElement, ButtonProps>(function ColorPickerButton(
  { sx, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      sx={deepAssign(
        {
          whiteSpace: 'nowrap',
          height: { xs: 48, md: 'fit-content' },
          minWidth: { xs: 48, md: 'fit-content' },
          backgroundColor: { md: 'primaryRange.10' },
        },
        sx
      )}
      {...props}
    />
  )
})
