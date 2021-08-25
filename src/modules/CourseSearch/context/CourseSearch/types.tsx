import { QueryResult } from '@apollo/client'

import { SearchCourseResponse, SearchCourseVars } from '@/services/apollo/query/searchCourse'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  courseSearchQuery?: QueryResult<SearchCourseResponse, SearchCourseVars>
}
