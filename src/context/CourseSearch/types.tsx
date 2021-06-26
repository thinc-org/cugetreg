import { QueryResult } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CourseSearchProps {
  fetchMoreCourses: () => void
  resetOffset: () => void
  courseSearchQuery?: QueryResult<SearchCourseResponse, SearchCourseVars>
  pageIndex: number
}
