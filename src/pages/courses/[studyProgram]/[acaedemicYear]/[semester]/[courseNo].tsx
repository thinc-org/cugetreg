import { ApolloError, useQuery } from '@apollo/client'
import { Course, StudyProgram } from '@thinc-org/chula-courses'
import gql from 'graphql-tag'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { client } from '@/utils/network/apollo'
import { Box, Grid, Typography } from '@material-ui/core'

interface CourseGroup {
  semester: string
  academicYear: string
  studyProgram: StudyProgram
}

interface GetCourseVars {
  courseNo: string
  courseGroup: CourseGroup
}

interface GetCourseResponse {
  course: Course
}

const GET_COURSE = gql`
  query GetCourseInfo($courseNo: String!, $courseGroup: CourseGroupInput!) {
    course(courseNo: $courseNo, courseGroup: $courseGroup) {
      studyProgram
      semester
      academicYear
      courseNo
      abbrName
      courseNameTh
      courseNameEn
      faculty
      credit
      creditHours
      courseCondition
      genEdType
      rating
      sections {
        sectionNo
        closed
        capacity {
          current
          max
        }
        note
        classes {
          type
          dayOfWeek
          period {
            start
            end
          }
          building
          teachers
        }
      }
    }
  }
`

function parseVariablesFromQuery(q: any): GetCourseVars {
  const query = q as {
    studyProgram: string
    acaedemicYear: string
    semester: string
    courseNo: string
  }
  return {
    courseNo: query.courseNo,
    courseGroup: {
      studyProgram: query.studyProgram as StudyProgram,
      academicYear: query.acaedemicYear,
      semester: query.semester,
    },
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

  const { data } = useQuery<GetCourseResponse, GetCourseVars>(GET_COURSE, {
    variables: parseVariablesFromQuery(router.query),
  })
  const cData = props.data || data

  return (
    <>
      <Typography variant="h2">
        {cData.course.courseNo} {cData.course.abbrName}
      </Typography>
      <Typography variant="h4">{cData.course.courseNameTh}</Typography>
      <Typography variant="h4">{cData.course.courseNameEn}</Typography>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="subtitle1">คณะ</Typography>
          {cData.course.faculty}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">รูปแบบรายวิชา</Typography>
          {courseTypeStringFromCourse(cData.course)}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">สอบกลางภาค</Typography>
          {cData.course.midterm
            ? `${cData.course.midterm.date} ${cData.course.midterm.period.start} - ${cData.course.midterm.period.end}`
            : 'TBA'}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">เงื่อนไขรายวิชา</Typography>
          {cData.course.courseCondition}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">ภาควิชา/กลุ่มวิชา/สาขาวิชา</Typography>
          {cData.course.department}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">หน่วยกิต</Typography>
          {cData.course.credit}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">สอบปลายภาค</Typography>
          {cData.course.final
            ? `${cData.course.final.date} ${cData.course.final.period.start} - ${cData.course.final.period.end}`
            : 'TBA'}
        </Grid>
      </Grid>
    </>
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
