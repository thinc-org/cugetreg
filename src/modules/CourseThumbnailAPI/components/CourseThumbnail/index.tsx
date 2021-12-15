import { Global, css } from '@emotion/react'

import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

import {
  ThumbnailLayout,
  CourseInfo,
  CourseNo,
  CourseAbbr,
  CustomGenEdChip,
  CourseNameContainer,
  CourseName,
  GenEdColorStrip,
} from './styled'

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
        <CourseInfo>
          <CourseNo>{course.courseNo}</CourseNo>
          <CourseAbbr>
            {course.abbrName}
            {course.genEdType !== 'NO' ? (
              <>
                <CustomGenEdChip type={course.genEdType} />
              </>
            ) : null}
          </CourseAbbr>
          <CourseNameContainer>
            <CourseName>{course.courseNameTh}</CourseName>
            <CourseName>{course.courseNameEn}</CourseName>
          </CourseNameContainer>
        </CourseInfo>
        {course.genEdType !== 'NO' ? (
          <>
            <GenEdColorStrip type={course.genEdType} />
          </>
        ) : null}
      </ThumbnailLayout>
    </>
  )
}
