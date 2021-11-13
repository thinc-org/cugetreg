import { Checkbox, CheckboxProps, FormControlLabel, Stack, Typography } from '@mui/material'
import React from 'react'

import { GeneralChipKey } from '@/common/components/Chips/config'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface EnhancedCheckBoxProps extends CheckboxProps {
  label: string
  value: GeneralChipKey
}

export interface CheckboxGroupProps {
  title: string
  id: string
  checkboxes: EnhancedCheckBoxProps[]
  log: (_: unknown, value: string) => void
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, checkboxes, log, id }) => {
  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const hasChecked = (tag: GeneralChipKey) => {
    const genEdTags: string[] = searchCourseQueryParams.filter?.genEdTypes ?? []
    const dayOfWeeks: string[] = searchCourseQueryParams.filter?.dayOfWeeks ?? []

    return genEdTags.includes(tag) || dayOfWeeks.includes(tag)
  }

  return (
    <Stack>
      <Typography variant="button" color="primaryRange.100">
        {title}
      </Typography>
      {checkboxes.map(({ label, ...checkbox }) => (
        <FormControlLabel
          key={label}
          onClick={() => log(null, label || '')}
          control={
            <Checkbox
              id={id}
              color="primary"
              sx={{ fontFamily: 'Prompt' }}
              checked={hasChecked(checkbox.value)}
              {...checkbox}
            />
          }
          label={<Typography variant="subtitle1">{label}</Typography>}
        />
      ))}
    </Stack>
  )
}
