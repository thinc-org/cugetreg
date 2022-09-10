import { SearchDocument, SearchQuery, SearchQueryVariables, StudyProgram } from '@cugetreg/codegen'
import { GetServerSideProps } from 'next'
import { ISitemapField, getServerSideSitemap } from 'next-sitemap'

import { getCurrentTerm } from '@web/common/utils/getCurrentTerm'
import { SITE_URL } from '@web/env'
import { createApolloServerClient } from '@web/services/apollo'

// TODO: dynamic this varaibles
const MAX_COURSES = 1000000

async function getAllCoursesFromStudyProgram(studyProgram: StudyProgram): Promise<ISitemapField[]> {
  const client = createApolloServerClient()
  const { data } = await client.query<SearchQuery, SearchQueryVariables>({
    query: SearchDocument,
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
      loc: `${SITE_URL}/${studyProgram}/courses/${courseNo}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const field1 = await getAllCoursesFromStudyProgram(StudyProgram.S)
    const field2 = await getAllCoursesFromStudyProgram(StudyProgram.T)
    const field3 = await getAllCoursesFromStudyProgram(StudyProgram.I)
    const fields = [...field1, ...field2, ...field3]

    return getServerSideSitemap(context, fields)
  } catch (err) {
    throw err as Error
  }
}

// Default export to prevent next.js errors
const Sitemap = () => <div />
export default Sitemap
