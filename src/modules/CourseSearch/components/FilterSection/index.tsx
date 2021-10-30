import { useTheme } from '@emotion/react'
import { DialogContent, Grid } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useGoogleOptimize from '@react-hook/google-optimize'

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
import { Button, StickyPaper, Box } from './styled'

export const FilterSection: React.FC<FilterSectionProps> = ({ open, handleClose }) => {
  const { checkboxes: genEdCheckboxes } = useFilterBar<GenEdChipKey>(createGenEdCheckboxes, 'genEdTypes')
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar<DayChipKey>(createDayOfWeekCheckboxes, 'dayOfWeeks')
  // const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  const hasTags = useHasTags()

  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('sm'))
  const isExperimentOrder = useGoogleOptimize(google_optimize_filter_order, [false, true])

  return match ? (
    open ? (
      <StickyPaper hasTags={hasTags} variant="outlined">
        <Grid container spacing={4}>
          <Grid item sx={{ order: isExperimentOrder ? 3 : 1 }}>
            <Analytics elementName={GENED_FILTER}>
              {({ log }) => <CheckboxGroup log={log} title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />}
            </Analytics>
          </Grid>
          <Grid item sx={{ order: isExperimentOrder ? 1 : 2 }}>
            <Analytics elementName={DAY_FILTER}>
              {({ log }) => <CheckboxGroup log={log} title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />}
            </Analytics>
          </Grid>
          {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
          <Grid item sx={{ order: isExperimentOrder ? 2 : 3 }}>
            <Analytics elementName={PERIOD_RANGE_FILTER}>{({ log }) => <SelectTime log={log} />}</Analytics>
          </Grid>
        </Grid>
      </StickyPaper>
    ) : null
  ) : (
    <ResponsiveDialog open={open} onClose={handleClose}>
      <DialogContent>
        <Box>
          <Analytics elementName={GENED_FILTER}>
            {({ log }) => <CheckboxGroup log={log} title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />}
          </Analytics>
          <Analytics elementName={DAY_FILTER}>
            {({ log }) => <CheckboxGroup log={log} title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />}
          </Analytics>
        </Box>
        {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
        <Button color="primary" variant="outlined" fullWidth onClick={handleClose}>
          เลือกตัวกรอง
        </Button>
      </DialogContent>
    </ResponsiveDialog>
  )
}
