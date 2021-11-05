import { Global, css } from '@emotion/react'
import { ThemeProvider } from '@material-ui/core'

import { GenEdChip } from '@/common/components/Chips/catagories/GenEdChip'
import { lightTheme } from '@/configs/theme'
import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

import { ThumbnailLayout } from './styled'

export interface CourseThumbnailProps {
  course: CourseThumbnailData
}

export function CourseThumbnail({ course }: CourseThumbnailProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Global
        styles={css`
          body {
            margin: 0;
            font-family: Prompt;
          }
        `}
      />
      <ThumbnailLayout>
        <p>{course.courseNo}</p>
        <p>{course.abbrName}</p>
        <p>{course.courseNameTh}</p>
        <p>{course.courseNameEn}</p>
        {course.genEdType !== 'NO' ? <GenEdChip type={course.genEdType} /> : null}
      </ThumbnailLayout>
    </ThemeProvider>
  )
}
