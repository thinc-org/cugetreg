import { useEffect, useMemo, useState } from 'react'

import { Link, Typography, styled, useTheme } from '@mui/material'
import { observer } from 'mobx-react'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { useCourseSearchProvider } from '@web/modules/CourseSearch/context/CourseSearch/hooks/useCourseSearchProvider'
import { useSearchCourseQueryParams } from '@web/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { collectLogEvent } from '@web/services/logging'
import { courseCartStore } from '@web/store'

import { SearchCourseQueryVariables, useRecommendCourseTextLazyQuery } from '@cgr/codegen'

import { SelectedCourse } from './types'

const RecommendationItem = styled(Link)`
  color: ${({ theme }) => theme.palette.highlight.indigo[700]};
  margin-left: 1em;
  cursor: pointer;
`

interface RecommendationTextProps {
  variant: string
  selectedCourses: SelectedCourse[]
}

const RecommendationText: React.FC<RecommendationTextProps> = (props: RecommendationTextProps) => {
  const variant = props.variant
  const selectedCourses = props.selectedCourses
  const courseGroup = useCourseGroup()

  const { courseSearchQuery } = useCourseSearchProvider()
  const { setFilter } = useSearchCourseQueryParams()
  const [lastSearchQuery, setLastSearchQuery] = useState<SearchCourseQueryVariables | undefined>(
    undefined
  )

  const [fetchRecommendation, { data }] = useRecommendCourseTextLazyQuery()

  const visibleRecommendation = useMemo(() => data?.recommend?.courses?.slice(0, 6) ?? [], [data])
  const theme = useTheme()

  useEffect(() => {
    const visibleRecommendation =
      data && data.recommend.courses.length > 0 ? data.recommend.courses.slice(0, 6) : null
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
    if (JSON.stringify(courseSearchQuery.variables) === JSON.stringify(lastSearchQuery)) return
    fetchRecommendation({
      variables: {
        req: {
          variant,
          semesterKey: courseGroup,
          selectedCourses: selectedCourses,
        },
      },
    })
    setLastSearchQuery(courseSearchQuery.variables)
  }, [
    courseSearchQuery.variables,
    selectedCourses,
    courseGroup,
    fetchRecommendation,
    lastSearchQuery,
    variant,
  ])

  if (!visibleRecommendation || visibleRecommendation.length === 0) return null

  return (
    <Typography marginBottom="1em" color={theme.palette.highlight.indigo[500]} variant="subtitle1">
      คุณอาจสนใจวิชาเหล่านี้:
      {visibleRecommendation.map((course) => {
        const { semesterKey, courseNo } = course.key
        const { studyProgram, academicYear, semester } = semesterKey

        return (
          <Analytics
            key={course.key.courseNo}
            elementName="RecommendationLink"
            elementId={`RecommendationLink/${variant}/${studyProgram}/${academicYear}/${semester}/courses/${courseNo}`}
          >
            <RecommendationItem
              id={`RecommendationLink/${variant}/${studyProgram}/courses/${courseNo}`}
              onClick={() => setFilter({ keyword: courseNo })}
            >
              {courseNo} {course.courseNameEn}
            </RecommendationItem>
          </Analytics>
        )
      })}
    </Typography>
  )
}

export const WrappedRecommendationText = observer(() => {
  const selectedCourses = courseCartStore.shopItems.map((item) => ({
    courseNo: item.courseNo,
    semesterKey: {
      semester: item.semester,
      studyProgram: item.studyProgram,
      academicYear: item.academicYear,
    },
  }))

  if (!selectedCourses || selectedCourses.length === 0) return null

  return (
    <RecommendationText variant="COSINE" selectedCourses={selectedCourses as SelectedCourse[]} />
  )
})
