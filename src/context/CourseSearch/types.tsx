import { QueryResult } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  courseSearchQuery?: QueryResult<SearchCourseResponse, SearchCourseVars>
}
