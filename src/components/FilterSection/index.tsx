import React from 'react'
import { useFilterBar } from './hooks'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes,
  createSpecialCheckboxes,
} from '@/components/FilterSection/constants'
import { Hidden, Paper, Stack } from '@material-ui/core'
import { useStyles } from '@/components/FilterSection/styled'
import { CheckboxGroup } from '@/components/FilterSection/components/CheckboxGroup'

export interface FilterSectionProps {}

export function FilterSection() {
  const classes = useStyles()
  const { checkboxes: genEdCheckboxes } = useFilterBar(createGenEdCheckboxes, 'genEdTypes')
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar(createDayOfWeekCheckboxes, 'dayOfWeeks')
  const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  return (
    <Hidden mdDown>
      <div>
        <Paper className={classes.paper} variant="outlined">
          <Stack spacing={4}>
            <CheckboxGroup title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />
            <CheckboxGroup title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
            <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} />
          </Stack>
        </Paper>
      </div>
    </Hidden>
  )
}
