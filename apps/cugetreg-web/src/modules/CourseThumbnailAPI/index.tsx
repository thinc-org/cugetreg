import { createCanvas } from 'canvas'
import { NextApiRequest, NextApiResponse } from 'next'

import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'
import { parseCourseNoFromQuery } from '@web/common/utils/parseCourseNoFromQuery'
import { ENABLE_COURSE_THUMBNAIL } from '@web/env'
import { drawThumbnail } from '@web/modules/CourseThumbnailAPI/drawThumbnail'
import { createApolloServerClient } from '@web/services/apollo'
import {
  GET_COURSE_FOR_THUMBNAIL,
  GetCourseForThumbnailResponse,
} from '@web/services/apollo/query/getCourse'
import { getCachedImage } from '@web/utils/imageCache'

export async function CourseThumbnailAPI(req: NextApiRequest, res: NextApiResponse) {
  if (!ENABLE_COURSE_THUMBNAIL) {
    throw new Error('Course thumbnail is disabled')
  }
  try {
    const { courseNo, courseGroup } = parseCourseNoFromQuery(req.query)
    const key = `${courseNo}-${courseGroup.studyProgram}-${courseGroup.academicYear}-${courseGroup.semester}`
    if (!key.match(/^\d{7}-[STI]-\d{4}-\d$/)) {
      throw new Error('Invalid courseNo')
    }
    const imageBuffer = await getCachedImage(
      `courseThumbnail-${key}.png`,
      async () => await generateThumbnail(courseNo, courseGroup)
    )
    res.statusCode = 200
    res.setHeader('Content-Type', `image/png`)
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
    res.end(imageBuffer)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(e)
  }
}

async function generateThumbnail(courseNo: string, courseGroup: CourseGroup): Promise<Buffer> {
  const client = createApolloServerClient()
  const { data } = await client.query<GetCourseForThumbnailResponse>({
    query: GET_COURSE_FOR_THUMBNAIL,
    variables: { courseNo, courseGroup },
  })
  const canvas = createCanvas(1200, 630)
  await drawThumbnail(canvas, data.course)
  return canvas.toBuffer('image/png')
}
