import React, { createContext, useState, useRef } from 'react'

import { DayChipKey, GenEdChipKey } from '@/components/Chips/config'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/context/CourseSearch/constants'
import useStudyPromgram from '@/utils/hooks/useStudyProgram'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useQuery } from '@apollo/client'
import usePeriod from '@/utils/hooks/usePeriod'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC = (props) => {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [openFilterBar, setOpenFilterBar] = useState<boolean>(false)

  const { period } = usePeriod()
  const { studyProgram } = useStudyPromgram()
  const [tags, setTags] = useState<(GenEdChipKey | DayChipKey)[]>([])

  const { data: courses, loading, error, refetch } = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    variables: {
      courseGroup: {
        studyProgram: studyProgram,
        academicYear: period.year,
        semester: period.sem,
      },
      filter: {
        keyword: searchInputRef.current?.value || '',
      },
    },
  })

  const addTag = (tag: GenEdChipKey | DayChipKey) => {
    setTags((tags) => [...tags, tag])
  }

  const removeTag = (tag: GenEdChipKey | DayChipKey) => {
    setTags((tags) => tags.filter((currentTag) => currentTag != tag))
  }

  const value = {
    tags,
    addTag,
    removeTag,
    openFilterBar,
    setOpenFilterBar,
    courses,
    loading,
    error,
    refetch,
    searchInputRef,
  }

  return <CourseSearchContext.Provider value={value} {...props} />
}
