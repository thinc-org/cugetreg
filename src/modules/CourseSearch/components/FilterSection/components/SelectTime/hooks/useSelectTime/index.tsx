import React, { useMemo } from 'react'

import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

import { generateTimeAround } from '../../utils/generateTimeAround'

/**
 * format of defaultStartTime and defaultEndTime must be in `HH:MM` string. MM can only be `30` or `00`, HH is not padded by `0`, for example, `09:00`
 * @param defaultStartTime
 * @param defaultEndTime
 * @returns
 */
export const useSelectTime = (defaultStartTime: string, defaultEndTime: string) => {
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()

  const selectedStartTime = searchCourseQueryParams.filter.periodRange?.start ?? defaultStartTime
  const selectedEndTime = searchCourseQueryParams.filter.periodRange?.end ?? defaultEndTime

  const checked =
    !!searchCourseQueryParams.filter.periodRange?.start && !!searchCourseQueryParams.filter.periodRange?.end

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    if (!checked) {
      setFilter({ ...searchCourseQueryParams.filter, periodRange: undefined })
    } else {
      setFilter({ ...searchCourseQueryParams.filter, periodRange: { start: selectedStartTime, end: selectedEndTime } })
    }
  }

  const onStartTimeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const startTime = event.target.value as string
    setFilter({
      ...searchCourseQueryParams.filter,
      periodRange: { start: startTime, end: selectedEndTime },
    })
  }

  const onEndTimeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const endTime = event?.target.value as string
    setFilter({
      ...searchCourseQueryParams.filter,
      periodRange: { start: selectedStartTime, end: endTime },
    })
  }

  const startTimeChoices = useMemo(() => generateTimeAround(defaultStartTime, selectedEndTime), [
    defaultStartTime,
    selectedEndTime,
  ])
  const endTimeChoices = useMemo(() => generateTimeAround(selectedStartTime, defaultEndTime), [
    defaultEndTime,
    selectedStartTime,
  ])

  return {
    selectedStartTime,
    onStartTimeChange,
    selectedEndTime,
    onEndTimeChange,
    startTimeChoices,
    endTimeChoices,
    checked,
    onCheckboxChange,
  }
}
