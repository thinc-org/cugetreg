import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Button as MuiButton, DialogContent as MuiDialogContent, Paper, Stack, useMediaQuery } from '@material-ui/core'
import React from 'react'

import { DayChipKey, GenEdChipKey } from '@/common/components/Chips/config'
import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { Analytics } from '@/context/Analytics/components/Analytics'
import { DAY_FILTER, GENED_FILTER } from '@/context/Analytics/components/const'
import { CheckboxGroup } from '@/modules/CourseSearch/component/FilterSection/components/CheckboxGroup'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes, // createSpecialCheckboxes,
} from '@/modules/CourseSearch/component/FilterSection/constants'
import { useStyles } from '@/modules/CourseSearch/component/FilterSection/styled'

import { useHasTags } from '../TagList'
import { useFilterBar } from './hooks'

const DialogContent = styled(MuiDialogContent)`
  padding: ${({ theme }) => theme.spacing(4)};
`

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-of-type {
    ${({ theme }) => {
      return css`
        margin-right: ${theme.spacing(12)};
        ${theme.breakpoints.down('sm')} {
          margin-right: ${theme.spacing(2)};
        }
      `
    }};
  }
`

const Container = styled.div<{ hasTags: boolean }>`
  min-width: 220px;
  position: sticky;
  top: ${({ hasTags }) => (hasTags ? '124px' : '100px')};
  z-index: ${({ theme }) => theme.zIndex.appBar + 2};
  height: fit-content;
`

const Button = styled(MuiButton)`
  margin-top: ${({ theme }) => theme.spacing(2)}; ;
`
export interface FilterSectionProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FilterSection: React.FC<FilterSectionProps> = ({ open, setOpen }) => {
  const classes = useStyles()
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
      <Container hasTags={hasTags}>
        <Paper className={classes.paper} variant="outlined">
          <Stack spacing={4}>
            <Analytics elementName={GENED_FILTER}>
              {({ log }) => <CheckboxGroup log={log} title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />}
            </Analytics>
            <Analytics elementName={DAY_FILTER}>
              {({ log }) => <CheckboxGroup log={log} title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />}
            </Analytics>
            {/* <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} /> */}
          </Stack>
        </Paper>
      </Container>
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
