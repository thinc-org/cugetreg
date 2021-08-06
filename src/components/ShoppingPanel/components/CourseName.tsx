import styled from '@emotion/styled'
import { Hidden, Typography as MuiTypography } from '@material-ui/core'
import React from 'react'

import { genEdChipConfig, GenEdChipKey } from '@/components/Chips/config'
import { ChipFilledHighlightColor, ChipOutlinedHighlightColor } from '@/configs/theme/overrides/chip'

export interface CourseNameProps {
  courseName: string
  type: GenEdChipKey
}

interface TypographyProps {
  $color: ChipFilledHighlightColor | ChipOutlinedHighlightColor
}

const Typography = styled(MuiTypography)<TypographyProps>`
  color: ${({ $color, theme }) => theme.palette[$color].main};
`

export const CourseName: React.FC<CourseNameProps> = ({ courseName, type }) => {
  const color = genEdChipConfig[type].color

  return (
    <>
      <Hidden smUp>
        <Typography variant="body1" $color={color}>
          {courseName}
        </Typography>
      </Hidden>
      <Hidden smDown>
        <MuiTypography variant="body1">{courseName}</MuiTypography>
      </Hidden>
    </>
  )
}
