import { styled, Stack } from '@mui/material'

export const Card = styled(Stack)`
  width: 100%;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.create('background-color')};
  &:hover {
    background-color: #fafafa; // TODO: configure palette to have some kind of hover color
  }
`

export const SkeletonImage = styled('div')`
  background-color: #f0f0f0; // TODO: configure palette to have some kind of hover color
  width: 100%;
  height: auto;
  display: block;
  position: relative;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`

export const ImageContainer = styled(SkeletonImage)`
  background: none;
  img {
    object-fit: cover;
  }
`
