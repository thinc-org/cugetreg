import React from 'react'
import { useFilterBar } from './hooks'
import {
  createGenEdCheckboxes,
  createDayOfWeekCheckboxes,
  createSpecialCheckboxes,
} from '@/components/FilterSection/constants'
import { Button as MuiButton, Dialog, DialogContent as MuiDialogContent, Hidden, Paper, Stack } from '@material-ui/core'
import { useStyles } from '@/components/FilterSection/styled'
import { CheckboxGroup } from '@/components/FilterSection/components/CheckboxGroup'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const DialogContent = styled(MuiDialogContent)`
  padding: ${({ theme }) => theme.spacing(4)};
`

const Box = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-child {
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

const Button = styled(MuiButton)`
  margin-top: ${({ theme }) => theme.spacing(2)}; ;
`
export interface FilterSectionProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FilterSection: React.FC<FilterSectionProps> = ({ open, setOpen }) => {
  const classes = useStyles()
  const { checkboxes: genEdCheckboxes } = useFilterBar(createGenEdCheckboxes, 'genEdTypes')
  const { checkboxes: dayOfWeekCheckboxes } = useFilterBar(createDayOfWeekCheckboxes, 'dayOfWeeks')
  const { checkboxes: specialCheckboxes } = useFilterBar(createSpecialCheckboxes)

  const handleClose = () => {
    setOpen(false)
  }

  if (!open) return null

  return (
    <>
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
      <Hidden mdUp>
        <Dialog open onClose={handleClose} maxWidth="xl">
          <DialogContent>
            <Box>
              <CheckboxGroup title="หมวดหมู่ GenEd" checkboxes={genEdCheckboxes} />
              <CheckboxGroup title="วันในสัปดาห์" checkboxes={dayOfWeekCheckboxes} />
            </Box>
            <CheckboxGroup title="แสดงผลพิเศษ" checkboxes={specialCheckboxes} />
            <Button color="primary" variant="outlined" fullWidth onClick={handleClose}>
              เลือกตัวกรอง
            </Button>
          </DialogContent>
        </Dialog>
      </Hidden>
    </>
  )
}
