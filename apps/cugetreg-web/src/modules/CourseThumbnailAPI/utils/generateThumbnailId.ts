import md5 from 'md5'

import { CourseThumbnailData } from '@cugetreg/course-utils'

import { thumbnailVersion } from '@web/modules/CourseThumbnailAPI/constants'

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
