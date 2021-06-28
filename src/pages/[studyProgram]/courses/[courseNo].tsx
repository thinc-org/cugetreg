import React from 'react'
import Link from 'next/link'
import { ApolloError, useQuery } from '@apollo/client'
import { Course, getFaculty } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { client } from '@/utils/network/apollo'
import { Grid, Typography, Container as MuiContainer } from '@material-ui/core'
import { GetCourseResponse, GetCourseVars, GET_COURSE } from '@/utils/network/BackendGQLQueries'
import { ParsedUrlQuery } from 'querystring'
import { parseCourseGroup } from '@/utils/courseGroup'
import { SectionCard } from '@/components/SectionCard'
import { groupBy } from '@/utils/groupBy'
import styled from '@emotion/styled'
import { createAnalyticsButton } from '@/components/BackButton'
import { useTranslation } from 'react-i18next'
import { Language } from '@/i18n'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'
import { getExamDate, getExamPeriod } from '@/components/ExamSchedule/components/ExamCard/utils'

const SectionCardLayout = styled(SectionCard)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

const SectionContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(9)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
`

const Title = styled(Typography)`
  margin: ${({ theme }) => theme.spacing(2, 0, 2, 0)};
`

const DescriptionTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.primaryRange['100']};
`

const GridContainer = styled(Grid)`
  margin: ${({ theme }) => theme.spacing(4, 0, 6, 0)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: ${({ theme }) => theme.spacing(3, 0, 2, 0)};
  }
  div {
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding-bottom: ${({ theme }) => theme.spacing(1)};
    }
  }
`

const GridEnd = styled(Grid)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-bottom: ${({ theme }) => theme.spacing(3)} !important;
  }
`

const Container = styled(MuiContainer)`
  margin-top: ${({ theme }) => theme.spacing(10)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: ${({ theme }) => theme.spacing(4)};
  }
`

function parseVariablesFromQuery(q: ParsedUrlQuery): GetCourseVars {
  const query = q as {
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: parseCourseGroup(q),
  }
}

function courseTypeStringFromCourse(c: Course) {
  const sec = c.sections
  const t = sec.flatMap((s) => s.classes.map((c) => c.type))
  const tu = t.filter((v, i) => t.indexOf(v) == i)
  return tu.join('/')
}

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

  const Back = createAnalyticsButton(Link)

  return (
    <Container>
      <Back href={`/${studyProgram}/courses`} pathId={cData.course.courseNo} />
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
    const { data } = await client.query<GetCourseResponse>({
      query: GET_COURSE,
      variables: parseVariablesFromQuery(context.query),
    })
    return {
      props: {
        data,
      },
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
