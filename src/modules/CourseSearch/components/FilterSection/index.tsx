import { useTheme } from '@emotion/react'
import { DialogContent, Stack } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useGoogleOptimize from '@react-hook/google-optimize'
import { tail } from 'lodash'

import { DayChipKey, GenEdChipKey } from '@/common/components/Chips/config'
import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { DAY_FILTER, GENED_FILTER, PERIOD_RANGE_FILTER } from '@/common/context/Analytics/constants'
import { CheckboxGroup } from '@/modules/CourseSearch/components/CheckboxGroup'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes, // createSpecialCheckboxes,
} from '@/modules/CourseSearch/components/FilterSection/constants'
import { FilterSectionProps } from '@/modules/CourseSearch/components/FilterSection/types'
import { google_optimize_filter_order } from '@/utils/env'

import { useHasTags } from '../TagList'
import { SelectTime } from './components/SelectTime'
import { useFilterBar } from './hooks/useFilterBar'
import { Button, StickyPaper } from './styled'

export const FilterSection: React.FC<FilterSectionProps> = ({ open, handleClose }) => {
  const { checkboxes: genEdCheckboxes } = useFilterBar<GenEdChipKey>(createGenEdCheckboxes, 'genEdTypes')
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar<DayChipKey>(createDayOfWeekCheckboxes, 'dayOfWeeks')
  // const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  const hasTags = useHasTags()

  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('sm'))
  const isExperimentOrder = useGoogleOptimize(google_optimize_filter_order, [false, true])

  const filters = [
    <Analytics key={1} elementName={GENED_FILTER}>
      {({ log }) => <CheckboxGroup log={log} id="genEdFilter" title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />}
    </Analytics>,
    <Analytics key={2} elementName={DAY_FILTER}>
      {({ log }) => (
        <CheckboxGroup log={log} id="dayOfWeekFilter" title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
      )}
    </Analytics>,
    <Analytics key={3} elementName={PERIOD_RANGE_FILTER}>
      {({ log }) => <SelectTime log={log} />}
    </Analytics>,
  ]
  const orderedFilters = isExperimentOrder ? [...tail(filters), filters[0]] : filters

  return match ? (
    open ? (
      <StickyPaper hasTags={hasTags} variant="outlined">
        <Stack spacing={4} p={4} pr={2} overflow="auto">
          {orderedFilters}
          {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
        </Stack>
      </StickyPaper>
    ) : null
  ) : (
    <ResponsiveDialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Analytics elementName={GENED_FILTER}>
              {({ log }) => (
                <CheckboxGroup id="genEdFilter" log={log} title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />
              )}
            </Analytics>
            <Analytics elementName={DAY_FILTER}>
              {({ log }) => (
                <CheckboxGroup id="dayOfWeekFilter" log={log} title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
              )}
            </Analytics>
          </Stack>
          <Analytics elementName={PERIOD_RANGE_FILTER}>{({ log }) => <SelectTime log={log} />}</Analytics>
          {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
        </Stack>
        <Button color="primary" variant="outlined" fullWidth onClick={handleClose}>
          เลือกตัวกรอง
        </Button>
      </DialogContent>
    </ResponsiveDialog>
  )
}
