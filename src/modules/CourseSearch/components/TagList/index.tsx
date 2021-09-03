import React from 'react'

import { GeneralChip } from '@/common/components/Chips'
import { DayChipKey, GenEdChipKey } from '@/common/components/Chips/config'
import { StyledStack } from '@/modules/CourseSearch/components/TagList/styled'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface TagListProps {}

export const TagList: React.FC<TagListProps> = () => {
  const { searchCourseQueryParams, setFilter } = useSearchCourseQueryParams()
  const { filter } = searchCourseQueryParams
  const { genEdTypes, dayOfWeeks } = filter

  const handleDeleteGenEdTag = (tag: GenEdChipKey) => {
    if (!genEdTypes) return
    const modifiedGenEdTags = genEdTypes.filter((currentTag) => currentTag !== tag)
    setFilter({ ...searchCourseQueryParams.filter, genEdTypes: modifiedGenEdTags })
  }

  const handleDeleteDayOfWeekTag = (tag: DayChipKey) => {
    if (!dayOfWeeks) return
    const modifiedDayOfWeekTags = dayOfWeeks.filter((currentTag) => currentTag !== tag)
    setFilter({ ...searchCourseQueryParams.filter, dayOfWeeks: modifiedDayOfWeekTags })
  }

  if (!genEdTypes?.length && !dayOfWeeks?.length) {
    return null
  }

  return (
    <StyledStack spacing={2} direction="row">
      {genEdTypes?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => handleDeleteGenEdTag(tag)} />
      ))}
      {dayOfWeeks?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => handleDeleteDayOfWeekTag(tag)} />
      ))}
    </StyledStack>
  )
}

export function useHasTags() {
  const { searchCourseQueryParams } = useSearchCourseQueryParams()
  const { filter } = searchCourseQueryParams
  const { genEdTypes, dayOfWeeks } = filter
  return !!(genEdTypes?.length || dayOfWeeks?.length)
}

export function NoTagListLayout() {
  if (useHasTags()) {
    return null
  }

  return <StyledStack />
}
