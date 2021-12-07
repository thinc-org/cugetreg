import { gql, useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { Link, Typography } from '@mui/material'
import { Box } from '@mui/system'
import useGoogleOptimize from '@react-hook/google-optimize'
import { observer } from 'mobx-react'
import { FC, useEffect } from 'react'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { collectLogEvent } from '@/services/logging'
import { courseCartStore } from '@/store'

const RecommendationItem = styled(Link)`
  color: #211091;
  margin-left: 1em;
`

const RECOMMENDATION_QUERY = gql`
  query RecommendCourseText($req: CourseRecommendationRequest!) {
    recommend(req: $req) {
      course {
        courseNameEn
        key {
          semesterKey {
            semester
            studyProgram
          }
          courseNo
        }
      }
    }
  }
`

interface SemesterKey {
  studyProgram: string
  semester: string
  academicYear: string
}

interface CourseKey {
  semesterKey: SemesterKey
  courseNo: string
}

interface RecommendationParam {
  req: {
    variant: string
    semesterKey: SemesterKey
    selectedCourse: CourseKey[]
  }
}

interface RecommendationResponse {
  recommend: {
    course: {
      courseNameEn: string
      key: CourseKey
    }[]
  }
}

export const RecommendationText: React.FC<{variant: string}> = observer((props: { variant: string })  => {
  const variant = props.variant
  const courseGroup = useCourseGroup()
  const { data } = useQuery<RecommendationResponse, RecommendationParam>(RECOMMENDATION_QUERY, {
    variables: {
      req: {
        variant,
        semesterKey: courseGroup,
        selectedCourse: courseCartStore.shopItems.map((item) => ({
          courseNo: item.courseNo,
          semesterKey: {
            semester: item.semester,
            studyProgram: item.studyProgram,
            academicYear: item.academicYear,
          },
        })),
      },
    },
  })

  const visibleRecommendation = data && data.recommend.course.length > 0 ? data.recommend.course.slice(0, 6) : null

  useEffect(() => {
    const visibleRecommendation = data && data.recommend.course.length > 0 ? data.recommend.course.slice(0, 6) : null
    collectLogEvent({
      kind: 'track',
      message: 'displayed recommendation',
      additionalData: {
        variant,
        display: JSON.stringify(visibleRecommendation),
      },
    })
  }, [data, variant])

  if (visibleRecommendation) {
    return (
      <Box marginBottom="1em">
        <Typography variant="body2" color="#8170F1">
          คุณอาจสนใจวิชาเหล่านี้
          {visibleRecommendation.map((course) => (
            <Analytics
              key={course.key.courseNo}
              elementName="RecommendationLink"
              elementId={`RecommendationLink/${variant}/${course.key.semesterKey.studyProgram}/courses/${course.key.courseNo}`}
            >
              <RecommendationItem
                target="_blank"
                href={`/${course.key.semesterKey.studyProgram}/courses/${course.key.courseNo}`}
              >
                {course.key.courseNo} {course.courseNameEn}
              </RecommendationItem>
            </Analytics>
          ))}
        </Typography>
      </Box>
    )
  } else {
    return <></>
  }
})

export default function ExperimentalRecommendationText() {
  const recommendationVariant = useGoogleOptimize('KZLly-4DQ1CHxWOlVwOJ4g', ['NONE', 'RANDOM', 'COSINE']) || 'NONE'
  console.log('Variant ', recommendationVariant)
  if (recommendationVariant !== 'NONE')
    return <RecommendationText variant={recommendationVariant} /> 
  else
    return <></>
}
