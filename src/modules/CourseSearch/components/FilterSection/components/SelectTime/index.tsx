import { MenuItem, Select, Stack, Typography, Checkbox, FormControlLabel } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import { useSelectTime } from './hooks/useSelectTime'
import { SelectTimeTitle } from './styled'

interface SelectTimeProps {
  log: (_: unknown, value: string) => void
}

const DEFAULT_START_TIME = '06:00'
const DEFAULT_END_TIME = '22:00'

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
  } = useSelectTime(DEFAULT_START_TIME, DEFAULT_END_TIME)
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
            id="periodRangeFilter"
            color="primary"
            name={t('periodRange')}
            sx={{ fontFamily: 'Prompt' }}
            checked={checked}
            onChange={onCheckboxChange}
          />
        }
        label={
          <Stack spacing={2} direction={{ xs: 'row', sm: 'column' }}>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
              <Typography variant="subtitle1" noWrap>
                {t('fromTime')}
              </Typography>
              <Select disabled={!checked} value={selectedStartTime} onChange={onStartTimeChange} name="startTime">
                {startTimeChoices.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
              <Typography variant="subtitle1">{t('toTime')}</Typography>
              <Select disabled={!checked} value={selectedEndTime} onChange={onEndTimeChange} name="endTime">
                {endTimeChoices.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>
        }
      />
    </Stack>
  )
}
