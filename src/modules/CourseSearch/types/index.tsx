import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CourseSearchPagePrefetchData {
  vars: SearchCourseVars
  data: SearchCourseResponse
}
