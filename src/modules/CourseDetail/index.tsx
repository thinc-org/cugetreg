import { ApolloError, useQuery } from '@apollo/client'
import { Grid, Typography } from '@material-ui/core'
import { getFaculty } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { BackButton } from '@/components/BackButton'
import { PageMeta } from '@/components/PageMeta'
import { Language } from '@/i18n'
import {
  Container,
  DescriptionTitle,
  GridContainer,
  SectionCardLayout,
  SectionContainer,
  Title,
  GridEnd,
} from '@/modules/CourseDetail/styled'
import { courseTypeStringFromCourse, parseVariablesFromQuery } from '@/modules/CourseDetail/utils'
import { getExamDate, getExamPeriod } from '@/utils/coruseExam'
import { groupBy } from '@/utils/groupBy'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import { GetCourseResponse, GetCourseVars, GET_COURSE } from '@/utils/network/BackendGQLQueries'
import { createApolloServerClient } from '@/utils/network/apollo'

function CourseDetailPage(props: { data: GetCourseResponse }) {
  const router = useRouter()
  const { i18n } = useTranslation()
  const { studyProgram } = useCourseGroup()

  const { data } = useQuery<GetCourseResponse, GetCourseVars>(GET_COURSE, {
    variables: parseVariablesFromQuery(router.query),
  })
  const cData = props.data || data

  const CourseList = groupBy(cData.course.sections, 'note', 'General').map((sectionGroup) => {
    const SectionGroup = sectionGroup.value.map((section) => (
      <SectionCardLayout key={section.sectionNo} section={section} course={cData.course} />
    ))
    return (
      <SectionContainer key={sectionGroup.group}>
        <Typography variant="h5">Group: {sectionGroup.group}</Typography>
        {SectionGroup}
      </SectionContainer>
    )
  })

  const faculty = getFaculty(cData.course.faculty)
  const finalDate = getExamDate(cData.course, true)
  const midtermDate = getExamDate(cData.course, false)
  const finalPeriod = getExamPeriod(cData.course, true)
  const midtermPeriod = getExamPeriod(cData.course, false)

  return (
    <Container>
      <PageMeta title={cData.course.abbrName} />
      <BackButton href={`/${studyProgram}/courses`} pathId={cData.course.courseNo} />
      <Title variant="h3">
        {cData.course.courseNo} {cData.course.abbrName}
      </Title>
      <Typography variant="h5">{cData.course.courseNameTh}</Typography>
      <Typography variant="h5">{cData.course.courseNameEn}</Typography>
      <GridContainer container>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">คณะ</DescriptionTitle>
          <Typography variant="h6">{i18n.language === Language.th ? faculty?.nameTh : faculty?.nameEn}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">ภาควิชา/กลุ่มวิชา/สาขาวิชา</DescriptionTitle>
          <Typography variant="h6">{cData.course.department || '-'}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">รูปแบบรายวิชา</DescriptionTitle>
          <Typography variant="h6">{courseTypeStringFromCourse(cData.course)}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">หน่วยกิต</DescriptionTitle>
          <Typography variant="h6">{cData.course.credit}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">สอบกลางภาค</DescriptionTitle>
          <Typography variant="h6">{cData.course.midterm ? `${midtermDate} ${midtermPeriod}` : 'TBA'}</Typography>
        </Grid>
        <GridEnd item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">สอบปลายภาค</DescriptionTitle>
          <Typography variant="h6">{cData.course.final ? `${finalDate} ${finalPeriod}` : 'TBA'}</Typography>
        </GridEnd>
        <Grid item xs={12} sm={6}>
          <DescriptionTitle variant="subtitle1">เงื่อนไขรายวิชา</DescriptionTitle>
          <Typography variant="h6">{cData.course.courseCondition}</Typography>
        </Grid>
      </GridContainer>
      {CourseList}
    </Container>
  )
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ data: GetCourseResponse }>> {
  try {
    const client = createApolloServerClient()
    const { data } = await client.query<GetCourseResponse>({
      query: GET_COURSE,
      variables: parseVariablesFromQuery(context.query),
    })
    return {
      props: { data },
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

export default CourseDetailPage
