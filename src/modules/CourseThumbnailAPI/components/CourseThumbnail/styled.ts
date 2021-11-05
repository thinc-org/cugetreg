import styled from '@emotion/styled'

import thumbnailBackground from '@/assets/images/thumbnailBackground.png'
import { site_url } from '@/utils/env'

export const ThumbnailLayout = styled.div`
  width: 1200px;
  height: 630px;
  background-image: url(${site_url}${thumbnailBackground});
`
