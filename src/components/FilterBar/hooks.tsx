import { useContext } from 'react'
import { EnhancedCheckBoxProps } from '@/components/FilterBar/components/CheckboxGroup'
import { CourseSearchContext, LIMIT_CONSTANT } from '@/context/CourseSearch'
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
        currentVars.filter.genEdTypes = newTags ? (newTags as GenEdChipKey[]) : undefined
      } else if (type == 'dayOfWeeks') {
        currentVars.filter.dayOfWeeks = newTags ? (newTags as DayChipKey[]) : undefined
      }
      currentVars.filter = { ...currentVars.filter, limit: LIMIT_CONSTANT, offset: 0 }
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
