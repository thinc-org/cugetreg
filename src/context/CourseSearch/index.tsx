import React, { createContext, useState } from 'react'

import useSemester from '@/utils/hooks/useSemester'
import { GeneralChipKey } from '@/components/Chips/config'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/context/CourseSearch/constants'
import { useStudyProgram } from '@/utils/hooks/useStudyProgram'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { useQuery } from '@apollo/client'

export const LIMIT_CONSTANT = 10

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC = (props) => {
  const [offset, setOffset] = useState(0)
  const [openFilterBar, setOpenFilterBar] = useState<boolean>(false)

  const { semester } = useSemester()
  const { studyProgram } = useStudyProgram()
  const [tags, setTags] = useState<GeneralChipKey[]>([])

  const [searchCourseVars, setSearchCourseVars] = useState<SearchCourseVars>({
    courseGroup: {
      studyProgram: studyProgram,
      academicYear: semester.year,
      semester: semester.sem,
    },
    filter: {
      limit: LIMIT_CONSTANT,
    },
  })

  const { data: courses, loading, error, refetch } = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    variables: searchCourseVars,
  })

  function addTag<TagKey extends GeneralChipKey>(tag: TagKey) {
    const newTags = [...tags, tag]
    setTags(newTags)
    return newTags
  }

  function removeTag<TagKey extends GeneralChipKey>(tag: TagKey) {
    const newTags = tags.filter((currentTag) => currentTag != tag)
    setTags(newTags)
    return newTags
  }

  const value = {
    tags,
    addTag,
    removeTag,
    offset,
    setOffset,
    openFilterBar,
    setOpenFilterBar,
    courses,
    loading,
    error,
    searchCourseVars,
    setSearchCourseVars,
    refetch,
  }

  return <CourseSearchContext.Provider value={value} {...props} />
}
