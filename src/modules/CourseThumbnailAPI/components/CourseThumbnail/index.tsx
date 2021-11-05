import { Global, css } from '@emotion/react'

import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

import { ThumbnailLayout } from './styled'

export interface CourseThumbnailProps {
  course: CourseThumbnailData
}

export function CourseThumbnail({ course }: CourseThumbnailProps) {
  return (
    <>
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
        <p>{course.genEdType}</p>
      </ThumbnailLayout>
    </>
  )
}
