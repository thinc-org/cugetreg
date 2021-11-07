import md5 from 'md5'

import { thumbnailVersion } from '@/modules/CourseThumbnailAPI/constants'
import { CourseThumbnailData } from '@/services/apollo/query/getCourse'

export function generateThumbnailId(course: CourseThumbnailData): string {
  let contents = ''
  contents += course.courseNo
  contents += course.abbrName
  contents += course.courseNameEn
  contents += course.courseNameTh
  contents += `v${thumbnailVersion}`

  return md5(contents)
}
