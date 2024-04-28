import { SearchCourseQueryResult } from '@cgr/codegen'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  courseSearchQuery?: SearchCourseQueryResult
}
