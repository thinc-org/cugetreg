import { MenuItem, Select, Stack, Typography, makeStyles, Checkbox } from '@material-ui/core'

import { useSelectTime } from './hooks/useSelectTime'

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primaryRange[100],
  },
}))

export const SelectTime = () => {
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
      <div>
        <Checkbox
          color="primary"
          name="เวลาเรียน"
          sx={{ fontFamily: 'Prompt' }}
          checked={checked}
          onChange={onCheckboxChange}
        />
        <div>
          ในช่วง
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
        </div>

        <div>
          ถึง
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
        </div>
      </div>
    </Stack>
  )
}
