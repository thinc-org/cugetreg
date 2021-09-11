import { useCallback, useMemo } from 'react'

import { DayChipKey, GenEdChipKey, GeneralChipKey } from '@/common/components/Chips/config'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { SearchCourseVars } from '@/services/apollo/query/searchCourse'

import { EnhancedCheckBoxProps } from '../../../CheckboxGroup'
import { addTag } from '../../utils/addTag'
import { removeTag } from '../../utils/removeTag'

export interface CreateCheckbox<Value> {
  label: string
  value: Value
}

export function useFilterBar<TagValue extends GeneralChipKey = GeneralChipKey>(
  initCheckboxes: CreateCheckbox<TagValue>[],
  type?: keyof Pick<SearchCourseVars['filter'], 'genEdTypes' | 'dayOfWeeks'>
) {
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()

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
