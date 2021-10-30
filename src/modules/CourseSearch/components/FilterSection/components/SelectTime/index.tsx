import { MenuItem, Select, Stack, Typography, Checkbox, FormControlLabel, Box } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import { useSelectTime } from './hooks/useSelectTime'
import { SelectTimeTitle } from './styled'

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
  const { t } = useTranslation('filterBar')

  return (
    <Stack>
      <SelectTimeTitle variant="button">{t('periodRange')}</SelectTimeTitle>
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
                {t('fromTime')}
              </Typography>
              <Select disabled={!checked} value={selectedStartTime} onChange={onStartTimeChange} name="startTime">
                {startTimeChoices.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography mr={2} variant="subtitle1">
                {t('toTime')}
              </Typography>
              <Select disabled={!checked} value={selectedEndTime} onChange={onEndTimeChange} name="endTime">
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
