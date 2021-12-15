import { Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { GenEdType } from '@thinc-org/chula-courses'

import thumbnailBackground from '@/assets/images/thumbnailBackground.png'
import { GenEdChip } from '@/common/components/Chips/catagories/GenEdChip'
import { getPaletteRange } from '@/common/utils/getPaletteRange'
import { CapacityStatus } from '@/modules/CourseThumbnailAPI/utils/getCapacityInfo'
import { site_url } from '@/utils/env'

type ColorFunc = (theme: Theme) => string

const capacityStyle: Record<
  CapacityStatus,
  {
    backgroundColor: ColorFunc
    color: ColorFunc
  }
> = {
  available: {
    backgroundColor: (theme) => theme.palette.highlight.green[300],
    color: (theme) => theme.palette.highlight.green[700],
  },
  full: {
    backgroundColor: (theme) => theme.palette.highlight.red[300],
    color: (theme) => theme.palette.highlight.red[700],
  },
  closed: {
    backgroundColor: (theme) => theme.palette.highlight.red[500],
    color: () => 'white',
  },
}

export const ThumbnailLayout = styled.div`
  position: relative;
  width: 1200px;
  height: 630px;
  background-image: url(${site_url}${thumbnailBackground});
`

export const Capacity = styled.div<{ status: CapacityStatus }>`
  display: flex;
  position: absolute;
  top: 64px;
  left: 64px;
  padding: 12px 24px;
  align-items: center;

  background-color: ${({ theme, status }) => capacityStyle[status].backgroundColor(theme)};
  border-radius: 8px;
  color: ${({ theme, status }) => capacityStyle[status].color(theme)};

  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 48px;

  svg {
    width: 48px;
    height: 48px;
    margin-right: 10px;
  }

  span {
    transform: translateY(2px);
  }
`

export const CourseInfo = styled.div`
  position: absolute;
  left: 64px;
  top: 217px;
`

export const CourseNo = styled.div`
  color: ${({ theme }) => theme.palette.primaryRange[100]};
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 56px;
`

export const CourseAbbr = styled.div`
  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.palette.primaryRange[500]};
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 60px;
  line-height: 90px;
`

export const CustomGenEdChip = styled(GenEdChip)`
  height: 48px;
  margin-left: 26px;
  padding-left: 24px;
  padding-right: 24px;

  border-width: 3px;
  border-radius: 24px;
  font-size: 24px;
`

export const CourseNameContainer = styled.div`
  margin-top: 16px;
`

export const CourseName = styled.div`
  color: ${({ theme }) => theme.palette.primaryRange[500]};
  font-family: Prompt;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 45px;
`

export const GenEdColorStrip = styled.div<{ type: GenEdType }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 56px;
  background: ${({ theme, type }) => getPaletteRange(theme, type)[700]};
`
