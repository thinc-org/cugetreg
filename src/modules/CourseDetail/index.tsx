import { ApolloError } from '@apollo/client'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { Course, getFaculty } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { NextSeoProps } from 'next-seo/lib/types'
import dynamic from 'next/dynamic'

import { useTranslation } from 'react-i18next'
import { MdEdit, MdStar } from 'react-icons/md'

import defaultSEO from '@/../next-seo.config'
import { BackButton } from '@/common/components/BackButton'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { Language } from '@/common/i18n'
import { Review } from '@/common/types/reviews'
import { getExamDate } from '@/common/utils/getExamDate'
import { getExamPeriod } from '@/common/utils/getExamPeriod'
import { PageMeta } from '@/components/PageMeta'
import { scrollToReviewForm } from '@/modules/CourseDetail/components/ReviewForm/functions'
import { ReviewList } from '@/modules/CourseDetail/components/ReviewList'
import { ReviewProvider } from '@/modules/CourseDetail/context/Review'
import { createApolloServerClient } from '@/services/apollo'
import { GetCourseResponse, GET_COURSE } from '@/services/apollo/query/getCourse'
import { GetReviewsResponse, GetReviewsVars, GET_REVIEWS } from '@/services/apollo/query/getReviews'

import {
  Container,
  DescriptionTitle,
  GridContainer,
  SectionCardLayout,
  SectionContainer,
  Title,
  GridEnd,
} from './styled'
import { courseTypeStringFromCourse } from './utils/courseTypeStringFromCourse'
import { groupBy } from './utils/groupBy'
import { parseVariablesFromQuery } from './utils/parseVariablesFromQuery'

const ReviewForm = dynamic(
  async () =>
    (
      await import(
        /* webpackChunkName: "ReviewForm" */
        '@/modules/CourseDetail/components/ReviewForm'
      )
    ).ReviewForm,
  { ssr: false }
)

interface CourseDetailPageProps {
  course: Course
  reviews: Review[]
}

export function CourseDetailPage({ course, reviews }: CourseDetailPageProps) {
  const { i18n } = useTranslation()
  const { buildLink } = useLinkBuilder()

  const courseDesc = [course.courseDescTh, course.courseDescEn].filter((desc) => !!desc).join('\n')
  const SEOConfig: NextSeoProps = {
    ...defaultSEO,
    title: course.abbrName,
    description: courseDesc || defaultSEO.description,
    openGraph: {
      title: `${course.abbrName} | CU Get Reg`,
      description: courseDesc || defaultSEO.openGraph.description,
    },
    additionalMetaTags: [
      ...defaultSEO.additionalMetaTags,
      {
        property: 'keywords',
        content:
          defaultSEO.additionalMetaTags[0].content +
          [course.abbrName, course.genEdType, course.academicYear, course.faculty, course.courseNo].join(','),
      },
    ],
  }

  const CourseList = groupBy(course.sections, 'note', 'General').map((sectionGroup) => {
    const SectionGroup = sectionGroup.value.map((section) => (
      <SectionCardLayout key={section.sectionNo} section={section} course={course} />
    ))
    return (
      <SectionContainer key={sectionGroup.group}>
        <Typography variant="h5">Group: {sectionGroup.group}</Typography>
        {SectionGroup}
      </SectionContainer>
    )
  })

  const faculty = getFaculty(course.faculty)
  const { finalDate, midtermDate } = getExamDate(course)
  const { midtermPeriod, finalPeriod } = getExamPeriod(course)

  return (
    <Container>
      <PageMeta {...SEOConfig} />
      <Stack direction="row" justifyContent="space-between">
        <BackButton href={buildLink(`/courses`)} pathId={course.courseNo} />
        <Stack direction="row" spacing={[2, 4]} alignItems="center">
          {course.rating && (
            <Stack direction="row" spacing={1} alignItems="center">
              <MdStar size={24} />
              <Typography color="primary" variant="h5" sx={{ display: 'inline-block' }}>
                {course.rating}
              </Typography>
            </Stack>
          )}
          <Button variant="outlined" onClick={scrollToReviewForm} startIcon={<MdEdit />}>
            เขียนรีวิว
          </Button>
        </Stack>
      </Stack>
      <Title variant="h3">
        {course.courseNo} {course.abbrName}
      </Title>
      <Typography variant="h5">{course.courseNameTh}</Typography>
      <Typography variant="h5">{course.courseNameEn}</Typography>
      <GridContainer container>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">คณะ</DescriptionTitle>
          <Typography variant="h6">{i18n.language === Language.th ? faculty?.nameTh : faculty?.nameEn}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">ภาควิชา/กลุ่มวิชา/สาขาวิชา</DescriptionTitle>
          <Typography variant="h6">{course.department || '-'}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">รูปแบบรายวิชา</DescriptionTitle>
          <Typography variant="h6">{courseTypeStringFromCourse(course)}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">หน่วยกิต</DescriptionTitle>
          <Typography variant="h6">{course.credit}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">สอบกลางภาค</DescriptionTitle>
          <Typography variant="h6">{course.midterm ? `${midtermDate} ${midtermPeriod}` : 'TBA'}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">สอบปลายภาค</DescriptionTitle>
          <Typography variant="h6">{course.final ? `${finalDate} ${finalPeriod}` : 'TBA'}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={12}>
          <DescriptionTitle variant="subtitle1">เงื่อนไขรายวิชา</DescriptionTitle>
          <Typography variant="h6">{course.courseCondition}</Typography>
        </Grid>
        {course.courseDescTh && (
          <Grid item xs={12} sm={12}>
            <DescriptionTitle variant="subtitle1">คำอธิบายรายวิชา (ภาษาไทย)</DescriptionTitle>
            <Typography variant="h6">{course.courseDescTh}</Typography>
          </Grid>
        )}
        {course.courseDescEn && (
          <Grid item xs={12} sm={12}>
            <DescriptionTitle variant="subtitle1">คำอธิบายรายวิชา (ภาษาอังกฤษ)</DescriptionTitle>
            <Typography variant="h6">{course.courseDescEn}</Typography>
          </Grid>
        )}
      </GridContainer>
      {CourseList}
      <ReviewProvider courseNo={course.courseNo} initialReviews={reviews}>
        <ReviewForm />
        <ReviewList />
      </ReviewProvider>
    </Container>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<CourseDetailPageProps>> {
  try {
    const { courseNo, courseGroup } = parseVariablesFromQuery(context.query)
    const client = createApolloServerClient()
    const { data: courseData } = await client.query<GetCourseResponse>({
      query: GET_COURSE,
      variables: {
        courseNo,
        courseGroup,
      },
    })
    const { data: reviewsData } = await client.query<GetReviewsResponse, GetReviewsVars>({
      query: GET_REVIEWS,
      variables: {
        courseNo,
        studyProgram: courseGroup.studyProgram,
      },
    })
    return {
      props: { course: courseData.course, reviews: reviewsData.reviews },
    }
  } catch (e) {
    if (e instanceof ApolloError) {
      return {
        notFound: true,
      }
    } else {
      throw e
    }
  }
}
