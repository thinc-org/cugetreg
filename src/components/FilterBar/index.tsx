import React from 'react'
import { useFilterBar } from './hooks'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes,
  createSpecialCheckboxes,
} from '@/components/FilterBar/constants'
import { Stack } from '@material-ui/core'
import { CheckboxGroup } from './components/CheckboxGroup'

export interface FilterBarProps {}

export function FilterBar() {
  const { checkboxes: genEdCheckboxes } = useFilterBar(createGenEdCheckboxes)
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar(createDayOfWeekCheckboxes)
  const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  return (
    <Stack spacing={4}>
      <CheckboxGroup title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />
      <CheckboxGroup title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
      <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} />
    </Stack>
  )
}
