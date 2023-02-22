import { DialogContent, Stack, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import useGoogleOptimize from '@react-hook/google-optimize'

import { DayChipKey, GenEdChipKey } from '@web/common/components/Chips/config'
import { ResponsiveDialog } from '@web/common/components/ResponsiveDialog'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import {
  DAY_FILTER,
  GENED_FILTER,
  PERIOD_RANGE_FILTER,
} from '@web/common/context/Analytics/constants'
import { GOOGLE_OPTIMIZA_FILTER_ORDER } from '@web/env'
import { CheckboxGroup } from '@web/modules/CourseSearch/components/CheckboxGroup'
import {
  createDayOfWeekCheckboxes, // createSpecialCheckboxes,
  createGenEdCheckboxes,
} from '@web/modules/CourseSearch/components/FilterSection/constants'
import { FilterSectionProps } from '@web/modules/CourseSearch/components/FilterSection/types'
import { tail } from '@web/utils/tail'

import { useHasTags } from '../TagList'
import { SelectTime } from './components/SelectTime'
import { useFilterBar } from './hooks/useFilterBar'
import { Button, StickyPaper } from './styled'

export const FilterSection: React.FC<FilterSectionProps> = ({ open, handleClose }) => {
  const { checkboxes: genEdCheckboxes } = useFilterBar<GenEdChipKey>(
    createGenEdCheckboxes,
    'genEdTypes'
  )
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar<DayChipKey>(
    createDayOfWeekCheckboxes,
    'dayOfWeeks'
  )
  // const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  const hasTags = useHasTags()

  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('sm'))
  const isExperimentOrder = useGoogleOptimize(GOOGLE_OPTIMIZA_FILTER_ORDER, [false, true])

  const filters = [
    <Analytics key={1} elementName={GENED_FILTER}>
      {({ log }) => (
        <CheckboxGroup
          log={log}
          id="genEdFilter"
          title="หมวดหมู่ GenEd"
          checkboxes={genEdCheckboxes}
        />
      )}
    </Analytics>,
    <Analytics key={2} elementName={DAY_FILTER}>
      {({ log }) => (
        <CheckboxGroup
          log={log}
          id="dayOfWeekFilter"
          title="วันในสัปดาห์"
          checkboxes={dayOfWeekCheckboxes}
        />
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
                <CheckboxGroup
                  id="genEdFilter"
                  log={log}
                  title="หมวดหมู่ GenEd"
                  checkboxes={genEdCheckboxes}
                />
              )}
            </Analytics>
            <Analytics elementName={DAY_FILTER}>
              {({ log }) => (
                <CheckboxGroup
                  id="dayOfWeekFilter"
                  log={log}
                  title="วันในสัปดาห์"
                  checkboxes={dayOfWeekCheckboxes}
                />
              )}
            </Analytics>
          </Stack>
          <Analytics elementName={PERIOD_RANGE_FILTER}>
            {({ log }) => <SelectTime log={log} />}
          </Analytics>
          {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
        </Stack>
        <Button color="primary" variant="outlined" fullWidth onClick={handleClose}>
          เลือกตัวกรอง
        </Button>
      </DialogContent>
    </ResponsiveDialog>
  )
}
