import GeneralChip from '@/components/Chips'
import { DayChipKey, GenEdChipKey } from '@/components/Chips/config'
import { FilteredTagContext } from '@/context/FilteredTag'
import { Stack } from '@material-ui/core'
import React, { useContext } from 'react'

export interface TagListProps {}

export const TagList: React.FC<TagListProps> = () => {
  const { tags, removeTag } = useContext(FilteredTagContext)

  return (
    <Stack spacing={2} direction="row">
      {tags.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => removeTag(tag)} />
      ))}
    </Stack>
  )
}
