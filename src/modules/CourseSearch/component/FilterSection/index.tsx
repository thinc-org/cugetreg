import React from 'react'
import { useFilterBar } from './hooks'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes,
  // createSpecialCheckboxes,
} from '@/modules/CourseSearch/component/FilterSection/constants'
import { Button as MuiButton, Dialog, DialogContent as MuiDialogContent, Hidden, Paper, Stack } from '@material-ui/core'
import { useStyles } from '@/modules/CourseSearch/component/FilterSection/styled'
import { CheckboxGroup } from '@/modules/CourseSearch/component/FilterSection/components/CheckboxGroup'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { DayChipKey, GenEdChipKey } from '@/components/Chips/config'
import { Analytics } from '@/context/analytics/components/Analytics'
import { DAY_FILTER, GENED_FILTER } from '@/context/analytics/components/const'

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

const Container = styled.div`
  min-width: 220px;
  position: sticky;
  top: 100px;
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

  const handleClose = () => {
    setOpen(false)
  }

  if (!open) return null

  return (
    <>
      <Hidden mdDown>
        <Container>
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
      </Hidden>
      <Hidden mdUp>
        <Dialog open onClose={handleClose} maxWidth="xl">
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
        </Dialog>
      </Hidden>
    </>
  )
}
