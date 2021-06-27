import { useCallback, useContext, useMemo } from 'react'
import { EnhancedCheckBoxProps } from '@/components/FilterSection/components/CheckboxGroup'
import { CourseSearchContext } from '@/context/CourseSearch'
import { DayChipKey, GenEdChipKey, GeneralChipKey } from '@/components/Chips/config'
import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'

export interface CreateCheckbox<Value> {
  label: string
  value: Value
}

export function useFilterBar<TagValue extends GeneralChipKey = GeneralChipKey>(
  initCheckboxes: CreateCheckbox<TagValue>[],
  type?: keyof Pick<SearchCourseVars['filter'], 'genEdTypes' | 'dayOfWeeks'>
) {
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()

  const addTag = (array: string[] | undefined, tag: string) => {
    if (array) return [...array, tag]
    return [tag]
  }

  const removeTag = (array: string[] | undefined, tag: string) => {
    if (array) return array.filter((value) => value !== tag)
    return [tag]
  }

  const onCheckboxChange = useCallback(
    (tag: TagValue) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked

      if (type === 'genEdTypes') {
        const genEdTypes: GenEdChipKey[] = checked
          ? (addTag(searchCourseQueryParams.filter.genEdTypes, tag) as GenEdChipKey[])
          : (removeTag(searchCourseQueryParams.filter.genEdTypes, tag) as GenEdChipKey[])

        setFilter({ ...searchCourseQueryParams.filter, genEdTypes: genEdTypes })
      } else if (type == 'dayOfWeeks') {
        const dayOfWeeks: DayChipKey[] = checked
          ? (addTag(searchCourseQueryParams.filter.dayOfWeeks, tag) as DayChipKey[])
          : (removeTag(searchCourseQueryParams.filter.dayOfWeeks, tag) as DayChipKey[])

        setFilter({ ...searchCourseQueryParams.filter, dayOfWeeks: dayOfWeeks })
      }
    },
    [searchCourseQueryParams.filter, setFilter, type]
  )

  const checkboxes: EnhancedCheckBoxProps[] = useMemo(() => {
    return initCheckboxes.map(({ value, label, ...rest }) => ({
      ...rest,
      label,
      value,
      name: label,
      onChange: onCheckboxChange(value),
    }))
  }, [onCheckboxChange, initCheckboxes])

  return { checkboxes }
}
