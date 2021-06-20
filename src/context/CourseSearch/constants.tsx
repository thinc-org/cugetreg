import { GenEdChipKey, DayChipKey } from '@/components/Chips/config'
import { SearchCourseResponse } from '@/utils/network/BackendGQLQueries'
import { ApolloError } from '@apollo/client'

export interface CourseSearchProps {
  tags: (GenEdChipKey | DayChipKey)[]
  addTag: (tag: GenEdChipKey | DayChipKey) => void
  removeTag: (tag: GenEdChipKey | DayChipKey) => void
  openFilterBar: boolean
  setOpenFilterBar: React.Dispatch<React.SetStateAction<boolean>>
  courses?: SearchCourseResponse
  loading: boolean
  error?: ApolloError
  searchInputRef: React.RefObject<HTMLInputElement> | null
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const DEFAULT_COURSE_SEARCH_CONTEXT_VALUE: CourseSearchProps = {
  tags: [],
  addTag: () => null,
  removeTag: () => null,
  openFilterBar: false,
  setOpenFilterBar: () => null,
  courses: {
    search: [],
  },
  loading: false,
  searchInputRef: null,
  onSubmit: () => null,
}
