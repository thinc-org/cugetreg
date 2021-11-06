import { Global, css } from '@emotion/react'
import { useTranslation } from 'react-i18next'
import { MdPerson } from 'react-icons/md'

import { getCapacityInfo } from '@/modules/CourseThumbnailAPI/utils/getCapacityInfo'
import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

import {
  ThumbnailLayout,
  Capacity,
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
  const { t } = useTranslation('courseThumbnail')
  const { current, max, status } = getCapacityInfo(course)

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
        <Capacity status={status}>
          <MdPerson />
          <span>{t(status, { current, max })}</span>
        </Capacity>
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
