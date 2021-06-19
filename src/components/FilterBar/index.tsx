import React from 'react'
import { useFilterBar } from './hooks'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes,
  createSpecialCheckboxes,
} from '@/components/FilterBar/constants'
import { Paper, Stack } from '@material-ui/core'
import { useStyles } from '@/components/FilterBar/styled'
import { CheckboxGroup } from '@/components/FilterBar/components/CheckboxGroup'

export interface FilterBarProps {}

export function FilterBar() {
  const classes = useStyles()
  const { checkboxes: genEdCheckboxes } = useFilterBar(createGenEdCheckboxes)
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar(createDayOfWeekCheckboxes)
  const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  return (
    <Paper className={classes.paper} variant="outlined">
      <Stack spacing={4}>
        <CheckboxGroup title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />
        <CheckboxGroup title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
        <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} />
      </Stack>
    </Paper>
  )
}
