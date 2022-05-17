import { gql } from '@apollo/client'
import { StudyProgram, StudyProgramEnum } from '@thinc-org/chula-courses'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

import { getCurrentTerm } from '@/common/utils/getCurrentTerm'
import { SITE_URL } from '@/env'
import { initializeApollo } from '@/services/apollo'
import { GetAllCoursesResponse, GET_ALL_COURSES } from '@/services/apollo/query/getAllCourses'

// TODO: dynamic this varaibles
const MAX_COURSES = 1000000

async function getAllCoursesFromStudyProgram(studyProgram: StudyProgram): Promise<ISitemapField[]> {
  const client = initializeApollo()
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
      loc: `${SITE_URL}/${studyProgram}/courses/${courseNo}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    })
  )
}

async function getAllAnnouncements(): Promise<ISitemapField[]> {
  const client = initializeApollo()
  const { data } = await client.query<{ announcements: { title: string; updated_at: string }[] }>({
    query: gql`
      query announcement {
        announcements {
          title
          updated_at
        }
      }
    `,
  })
  return data.announcements.map(
    ({ title, updated_at }): ISitemapField => ({
      loc: `${SITE_URL}/announcements/${title}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(updated_at).toISOString(),
    })
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const [field1, field2, field3, field4] = await Promise.all([
      await getAllCoursesFromStudyProgram(StudyProgramEnum.Semester),
      await getAllCoursesFromStudyProgram(StudyProgramEnum.Trisemter),
      await getAllCoursesFromStudyProgram(StudyProgramEnum.International),
      await getAllAnnouncements(),
    ])
    const fields = [...field1, ...field2, ...field3, ...field4]

    return getServerSideSitemap(context, fields)
  } catch (err) {
    throw err as Error
  }
}

// Default export to prevent next.js errors
export default () => <div />
