import { MenuItem, Select, Stack, Typography, makeStyles, Checkbox, FormControlLabel, Box } from '@material-ui/core'

import { useSelectTime } from './hooks/useSelectTime'

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primaryRange[100],
  },
}))

interface SelectTimeProps {
  log: (_: unknown, value: string) => void
}

export const SelectTime = ({ log }: SelectTimeProps) => {
  const {
    selectedStartTime,
    selectedEndTime,
    startTimeChoices,
    endTimeChoices,
    onStartTimeChange,
    onEndTimeChange,
    checked,
    onCheckboxChange,
  } = useSelectTime('06:00', '22:00')
  const classes = useStyles()

  return (
    <Stack>
      <Typography variant="button" className={classes.title}>
        เวลาเรียน
      </Typography>
      <FormControlLabel
        key="periodRange"
        onClick={() => log(null, 'periodRange')}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
        control={
          <Checkbox
            color="primary"
            name="เวลาเรียน"
            sx={{ fontFamily: 'Prompt' }}
            checked={checked}
            onChange={onCheckboxChange}
          />
        }
        label={
          <Box>
            <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
              <Typography mr={2} variant="subtitle1">
                ในช่วง
              </Typography>
              <Select
                disabled={!checked}
                value={selectedStartTime}
                onChange={(e) => {
                  const startTime = e.target.value as string
                  onStartTimeChange(startTime)
                }}
                name="startTime"
              >
                {startTimeChoices.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography mr={2} variant="subtitle1">
                ถึง
              </Typography>
              <Select
                disabled={!checked}
                value={selectedEndTime}
                onChange={(e) => {
                  const endTime = e.target.value as string
                  onEndTimeChange(endTime)
                }}
                name="endTime"
              >
                {endTimeChoices.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        }
      />
    </Stack>
  )
}
