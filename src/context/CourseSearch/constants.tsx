import { GeneralChipKey } from '@/components/Chips/config'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'
import { ApolloError, ApolloQueryResult } from '@apollo/client'

export interface CourseSearchProps {
  tags: GeneralChipKey[]
  addTag: (tag: GeneralChipKey) => GeneralChipKey[]
  removeTag: (tag: GeneralChipKey) => GeneralChipKey[]
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  openFilterBar: boolean
  setOpenFilterBar: React.Dispatch<React.SetStateAction<boolean>>
  courses?: SearchCourseResponse
  loading: boolean
  error?: ApolloError
  searchCourseVars: SearchCourseVars
  setSearchCourseVars: React.Dispatch<React.SetStateAction<SearchCourseVars>>
  refetch(variables?: Partial<SearchCourseVars>): Promise<ApolloQueryResult<SearchCourseResponse>>
}

export const DEFAULT_COURSE_SEARCH_CONTEXT_VALUE: CourseSearchProps = {
  tags: [],
  addTag: () => ['MO'],
  removeTag: () => ['MO'],
  offset: 0,
  setOffset: () => 0,
  openFilterBar: false,
  setOpenFilterBar: () => null,
  courses: {
    search: [],
  },
  loading: false,
  searchCourseVars: {
    courseGroup: {
      studyProgram: 'S',
      academicYear: '',
      semester: '',
    },
    filter: {},
  },
  setSearchCourseVars: () => null,
  refetch: () => new Promise(() => null),
}
