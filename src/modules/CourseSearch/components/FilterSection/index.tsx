import { useTheme } from '@emotion/react'
import { DialogContent, Stack, useMediaQuery } from '@material-ui/core'

import { DayChipKey, GenEdChipKey } from '@/common/components/Chips/config'
import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { DAY_FILTER, GENED_FILTER } from '@/common/context/Analytics/constants'
import { CheckboxGroup } from '@/modules/CourseSearch/components/CheckboxGroup'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes, // createSpecialCheckboxes,
} from '@/modules/CourseSearch/components/FilterSection/constants'
import { useFilterBar } from '@/modules/CourseSearch/components/FilterSection/hooks'
import { Button, StickyPaper, Box } from '@/modules/CourseSearch/components/FilterSection/styles'
import { FilterSectionProps } from '@/modules/CourseSearch/components/FilterSection/types'
import { useHasTags } from '@/modules/CourseSearch/components/TagList'

export const FilterSection: React.FC<FilterSectionProps> = ({ open, setOpen }) => {
  const { checkboxes: genEdCheckboxes } = useFilterBar<GenEdChipKey>(createGenEdCheckboxes, 'genEdTypes')
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar<DayChipKey>(createDayOfWeekCheckboxes, 'dayOfWeeks')
  // const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  const hasTags = useHasTags()

  const handleClose = () => {
    setOpen(false)
  }

  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('sm'))

  return match ? (
    open ? (
      <StickyPaper hasTags={hasTags} variant="outlined">
        <Stack spacing={4}>
          <Analytics elementName={GENED_FILTER}>
            {({ log }) => <CheckboxGroup log={log} title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />}
          </Analytics>
          <Analytics elementName={DAY_FILTER}>
            {({ log }) => <CheckboxGroup log={log} title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />}
          </Analytics>
          {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
        </Stack>
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
