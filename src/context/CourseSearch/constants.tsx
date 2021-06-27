import { CourseSearchProps } from '@/context/CourseSearch/types'

export const LIMIT_QUERY_CONSTANT = 15

export const DEFAULT_COURSE_SEARCH_CONTEXT_VALUE: CourseSearchProps = {
  fetchMoreCourses: () => {},
  pageIndex: 0,
}
