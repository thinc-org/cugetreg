import React, { useCallback } from 'react'
import GeneralChip from '@/components/Chips'
import { Stack } from '@material-ui/core'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { DayChipKey, GenEdChipKey } from '@/components/Chips/config'

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

  return (
    <Stack spacing={2} direction="row">
      {genEdTypes?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => handleDeleteGenEdTag(tag)} />
      ))}
      {dayOfWeeks?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => handleDeleteDayOfWeekTag(tag)} />
      ))}
    </Stack>
  )
}
