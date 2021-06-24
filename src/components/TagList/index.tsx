import React from 'react'
import GeneralChip from '@/components/Chips'
import { Stack } from '@material-ui/core'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'

export interface TagListProps {}

export const TagList: React.FC<TagListProps> = () => {
  const { searchCourseQueryParams } = useSearchCourseQueryParams()
  const { filter } = searchCourseQueryParams
  const { genEdTypes, dayOfWeeks } = filter

  return (
    <Stack spacing={2} direction="row">
      {genEdTypes?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => {}} />
      ))}
      {dayOfWeeks?.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => {}} />
      ))}
    </Stack>
  )
}
