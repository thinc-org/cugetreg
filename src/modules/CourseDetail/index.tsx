import { ApolloError } from '@apollo/client'
import { Grid, Typography } from '@mui/material'
import { getFaculty } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { NextSeoProps } from 'next-seo/lib/types'
import React from 'react'
import { useTranslation } from 'react-i18next'

import defaultSEO from '@/../next-seo.config'
import { BackButton } from '@/common/components/BackButton'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { Language } from '@/common/i18n'
import { getExamDate } from '@/common/utils/getExamData'
import { getExamPeriod } from '@/common/utils/getExamPeriod'
import { PageMeta } from '@/components/PageMeta'
import { createApolloServerClient } from '@/services/apollo'
import { GetCourseResponse, GET_COURSE } from '@/services/apollo/query/getCourse'

import {
  Container,
  DescriptionTitle,
  GridContainer,
  SectionCardLayout,
  SectionContainer,
  Title,
  GridEnd,
  CourseDescription,
} from './styled'
import { courseTypeStringFromCourse } from './utils/courseTypeStringFromCourse'
import { groupBy } from './utils/groupBy'
import { parseVariablesFromQuery } from './utils/parseVariablesFromQuery'

export function CourseDetailPage(props: { data: GetCourseResponse }) {
  const { i18n } = useTranslation()
  const { buildLink } = useLinkBuilder()
  const { course } = props.data

  const SEOConfig: NextSeoProps = {
    ...defaultSEO,
    title: course.abbrName,
    description: course.courseDescTh + '\n' + course.courseDescEn ?? defaultSEO.description,
    openGraph: {
      title: `${course.abbrName} | CU Get Reg`,
      description: course.courseDescTh + '\n' + course.courseDescEn ?? defaultSEO.openGraph.description,
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
  const finalDate = getExamDate(course, true)
  const midtermDate = getExamDate(course, false)
  const finalPeriod = getExamPeriod(course, true)
  const midtermPeriod = getExamPeriod(course, false)

  return (
    <Container>
      <PageMeta {...SEOConfig} />
      <BackButton href={buildLink(`/courses`)} pathId={course.courseNo} />
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
        {(course.courseDescTh || course.courseDescEn) && (
          <Grid item xs={12} sm={12}>
            <DescriptionTitle variant="subtitle1">คำอธิบายรายวิชา</DescriptionTitle>
            {course.courseDescTh && <CourseDescription variant="h6">{course.courseDescTh}</CourseDescription>}
            {course.courseDescEn && <CourseDescription variant="h6">{course.courseDescEn}</CourseDescription>}
          </Grid>
        )}
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
