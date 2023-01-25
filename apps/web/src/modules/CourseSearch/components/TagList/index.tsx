import React from 'react'
import { useTranslation } from 'react-i18next'

import { GeneralChip } from '@web/common/components/Chips'
import { DayChipKey, GenEdChipKey, OtherEnum } from '@web/common/components/Chips/config'
import { StyledStack } from '@web/modules/CourseSearch/components/TagList/styled'
import { useSearchCourseQueryParams } from '@web/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface TagListProps {}

export const TagList: React.FC<TagListProps> = () => {
  const { searchCourseQueryParams, setFilter } = useSearchCourseQueryParams()
  const { filter } = searchCourseQueryParams
  const { genEdTypes, dayOfWeeks, periodRange } = filter
  const { t } = useTranslation('tagList')

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

  const handleDeletePeriodRange = () => {
    setFilter({ ...searchCourseQueryParams.filter, periodRange: undefined })
  }

  if (!genEdTypes?.length && !dayOfWeeks?.length && !periodRange) {
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
      {periodRange && (
        <GeneralChip
          key="periodRange"
          type={OtherEnum['other']}
          label={`${t('inRange')} ${periodRange.start} - ${periodRange.end}`.replace(':', '.')}
          onDelete={handleDeletePeriodRange}
        />
      )}
    </StyledStack>
  )
}
