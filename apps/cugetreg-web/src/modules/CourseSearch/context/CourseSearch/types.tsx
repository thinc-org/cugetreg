import { SearchCourseQueryResult } from '@libs/codegen'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  courseSearchQuery?: SearchCourseQueryResult
}
