import { useContext } from 'react'
import { EnhancedCheckBoxProps } from '@/components/FilterBar/components/CheckboxGroup'
import { CourseSearchContext } from '@/context/CourseSearch'
import { DayChipKey, GenEdChipKey, GeneralChipKey } from '@/components/Chips/config'
import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CreateCheckbox<Value> {
  label: string
  value: Value
}

export function useFilterBar<TagValue extends GeneralChipKey = GeneralChipKey>(
  initCheckboxes: CreateCheckbox<TagValue>[],
  type?: keyof Pick<SearchCourseVars['filter'], 'genEdTypes' | 'dayOfWeeks'>
) {
  const { addTag, removeTag, setSearchCourseVars, refetch, setOffset } = useContext(CourseSearchContext)

  const onCheckboxClick = (tag: TagValue) => (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const checked = (event.target as HTMLInputElement).checked
    const newTags = checked ? addTag(tag) : removeTag(tag)

    setSearchCourseVars((currentVars) => {
      if (type === 'genEdTypes') {
        currentVars.filter.genEdTypes = newTags as GenEdChipKey[]
      } else if (type == 'dayOfWeeks') {
        currentVars.filter.dayOfWeeks = newTags as DayChipKey[]
      }
      currentVars.filter = { ...currentVars.filter, limit: 0, offset: 0 }
      refetch(currentVars)
      return currentVars
    })

    setOffset(0)
  }

  const checkboxes: EnhancedCheckBoxProps[] = initCheckboxes.map((value) => ({
    ...value,
    name: value.label,
    onClick: onCheckboxClick(value.value),
  }))

  return { checkboxes }
}
