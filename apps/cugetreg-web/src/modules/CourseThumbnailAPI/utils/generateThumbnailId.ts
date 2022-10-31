import md5 from 'md5'

import { thumbnailVersion } from '@web/modules/CourseThumbnailAPI/constants'

import { CourseThumbnailData } from '@libs/course-utils'

import { getDaysOfWeek } from './getDaysOfWeek'

export function generateThumbnailId(course: CourseThumbnailData): string {
  return md5(
    JSON.stringify({
      courseNo: course.courseNo,
      abbrName: course.abbrName,
      courseNameEn: course.courseNameEn,
      courseNameTh: course.courseNameTh,
      daysOfWeek: getDaysOfWeek(course),
      version: thumbnailVersion,
    })
  )
}
