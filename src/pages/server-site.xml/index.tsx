import { StudyProgram, StudyProgramEnum } from '@thinc-org/chula-courses'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

import { getCurrentTerm } from '@/common/utils/getCurrentTerm'
import { createApolloServerClient } from '@/services/apollo'
import { GetAllCoursesResponse, GET_ALL_COURSES } from '@/services/apollo/query/getAllCourses'
import { site_url } from '@/utils/env'

// TODO: dynamic this varaibles
const MAX_COURSES = 1000000

async function getAllCoursesFromStudyProgram(studyProgram: StudyProgram): Promise<ISitemapField[]> {
  const client = createApolloServerClient()
  const { data } = await client.query<GetAllCoursesResponse>({
    query: GET_ALL_COURSES,
    variables: {
      courseGroup: {
        studyProgram: studyProgram,
        academicYear: getCurrentTerm().academicYear,
        semester: getCurrentTerm().semester,
      },
      filter: {
        offset: 0,
        limit: MAX_COURSES,
      },
    },
  })

  return data.search.map(
    ({ courseNo }): ISitemapField => ({
      loc: `${site_url}/${studyProgram}/courses/${courseNo}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const field1 = await getAllCoursesFromStudyProgram(StudyProgramEnum.Semester)
    const field2 = await getAllCoursesFromStudyProgram(StudyProgramEnum.Trisemter)
    const field3 = await getAllCoursesFromStudyProgram(StudyProgramEnum.International)
    const fields = [...field1, ...field2, ...field3]

    return getServerSideSitemap(context, fields)
  } catch (err) {
    throw err as Error
  }
}

// Default export to prevent next.js errors
export default () => <div />
