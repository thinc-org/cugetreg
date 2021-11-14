import { ThemeProvider } from '@mui/material'
import { NextApiRequest, NextApiResponse } from 'next'
import ReactDOMServer from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'

import { CourseGroup } from '@/common/hooks/useCourseGroup/types'
import { i18n } from '@/common/i18n'
import { parseCourseNoFromQuery } from '@/common/utils/parseCourseNoFromQuery'
import { lightTheme } from '@/configs/theme'
import { CourseThumbnail } from '@/modules/CourseThumbnailAPI/components/CourseThumbnail'
import { createApolloServerClient } from '@/services/apollo'
import { GetCourseForThumbnailResponse, GET_COURSE_FOR_THUMBNAIL } from '@/services/apollo/query/getCourse'

import { getScreenshot } from './_lib/chromium'

const isHtmlDebug = false

export async function CourseThumbnailAPI(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { courseNo, courseGroup } = parseCourseNoFromQuery(req.query)
    const html = await getHtml(courseNo, courseGroup)
    if (isHtmlDebug) {
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
      return
    }
    const file = await getScreenshot(html, 'png', true)
    res.statusCode = 200
    res.setHeader('Content-Type', `image/png`)
    res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal Error</h1><p>Sorry, there was a problem</p>')
    console.error(e)
  }
}

async function getHtml(courseNo: string, courseGroup: CourseGroup): Promise<string> {
  const client = createApolloServerClient()
  const { data } = await client.query<GetCourseForThumbnailResponse>({
    query: GET_COURSE_FOR_THUMBNAIL,
    variables: { courseNo, courseGroup },
  })
  return ReactDOMServer.renderToString(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={lightTheme}>
        <ThumbnailHeader />
        <CourseThumbnail course={data.course} />
      </ThemeProvider>
    </I18nextProvider>
  )
}

function ThumbnailHeader() {
  return (
    <head>
      <meta charSet="utf-8" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" />
    </head>
  )
}
