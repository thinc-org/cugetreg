import GeneralChip from '@/components/Chips'
import { CourseSearchContext } from '@/context/CourseSearch'
import { Stack } from '@material-ui/core'
import React, { useContext } from 'react'

export interface TagListProps {}

export const TagList: React.FC<TagListProps> = () => {
  const { tags, removeTag } = useContext(CourseSearchContext)

  return (
    <Stack spacing={2} direction="row">
      {tags.map((tag) => (
        <GeneralChip key={tag} type={tag} onDelete={() => removeTag(tag)} />
      ))}
    </Stack>
  )
}
