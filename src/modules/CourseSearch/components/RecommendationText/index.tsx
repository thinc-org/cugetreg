import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import { Link, Typography } from '@mui/material'
import useGoogleOptimize from '@react-hook/google-optimize'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { collectLogEvent } from '@/services/logging'
import { courseCartStore } from '@/store'
import { RecommendationParam, RecommendationResponse, RECOMMENDATION_QUERY } from '@/services/apollo/query/recommendation'
import { useTheme } from '@emotion/react'
import { useCourseSearchProvider } from '@/modules/CourseSearch/context/CourseSearch/hooks/useCourseSearchProvider'

const RecommendationItem = styled(Link)`
  color: ${({theme}) => theme.palette.highlight.indigo[700]};
  margin-left: 1em;
`

const RecommendationText: React.FC<{variant: string}> = observer((props: { variant: string })  => {
  const variant = props.variant
  const courseGroup = useCourseGroup()
  const selectedCourses =courseCartStore.shopItems.map((item) => ({
    courseNo: item.courseNo,
    semesterKey: {
      semester: item.semester,
      studyProgram: item.studyProgram,
      academicYear: item.academicYear,
    },
  }))
  const courseSearch = useCourseSearchProvider()
  const [freezedSelectedCourse, setFreezedSelectedCourse] = useState(selectedCourses)
  const { data } = useQuery<RecommendationResponse, RecommendationParam>(RECOMMENDATION_QUERY, {
    variables: {
      req: {
        variant,
        semesterKey: courseGroup,
        selectedCourses: freezedSelectedCourse,
      },
    },
  })

  const visibleRecommendation = data && data.recommend.courses.length > 0 ? data.recommend.courses.slice(0, 6) : null

  useEffect(() => {
    const visibleRecommendation = data && data.recommend.courses.length > 0 ? data.recommend.courses.slice(0, 6) : null
    collectLogEvent({
      kind: 'track',
      message: 'displayed recommendation',
      additionalData: {
        variant,
        display: JSON.stringify(visibleRecommendation),
      },
    })
  }, [data, variant])

  useEffect(() => {
    setFreezedSelectedCourse(selectedCourses)
  }, [courseSearch.courseSearchQuery])

  if (!visibleRecommendation)
    return null

  const theme = useTheme()

  return (
      <Typography marginBottom="1em" color={theme.palette.highlight.indigo[500]} variant="subtitle1">
        คุณอาจสนใจวิชาเหล่านี้:
        {visibleRecommendation.map((course) => (
          <Analytics
            key={course.key.courseNo}
            elementName="RecommendationLink"
            elementId={`RecommendationLink/${variant}/${course.key.semesterKey.studyProgram}/${course.key.semesterKey.academicYear}/${course.key.semesterKey.semester}/courses/${course.key.courseNo}`}
          >
            <RecommendationItem
              id={`RecommendationLink/${variant}/${course.key.semesterKey.studyProgram}/courses/${course.key.courseNo}`}
              target="_blank"
              href={`/${course.key.semesterKey.studyProgram}/courses/${course.key.courseNo}`}
            >
              {course.key.courseNo} {course.courseNameEn}
            </RecommendationItem>
          </Analytics>
        ))}
      </Typography>
  )
})

export function ExperimentalRecommendationText() {
  const recommendationVariant = useGoogleOptimize('KZLly-4DQ1CHxWOlVwOJ4g', ['NONE', 'RANDOM', 'COSINE']) || 'NONE'
  if (recommendationVariant !== 'NONE')
    return <RecommendationText variant={recommendationVariant} /> 
  else
    return <></>
}
