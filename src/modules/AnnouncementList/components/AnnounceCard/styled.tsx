import { styled } from '@mui/material'

export const Card = styled('div')`
  min-height: 240px;
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.highlight.deepGray[300]};
  transition: ${({ theme }) => theme.transitions.create('background-color')};
  &:hover {
    background-color: #fafafa; // TODO: configure palette to have some kind of hover color
  }
`

export const ImageContainer = styled('div')`
  display: block;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

export const Content = styled('div')`
  height: 50px;
`
