import { QueryResult } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CourseSearchProps {
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  courseSearchQuery?: QueryResult<SearchCourseResponse, SearchCourseVars>
}
