import { SearchCourseQueryResult } from '@cugetreg/codegen'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  courseSearchQuery?: SearchCourseQueryResult
}
