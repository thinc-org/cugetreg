import { Checkbox, CheckboxProps, FormControlLabel, makeStyles, Stack, Typography } from '@material-ui/core'
import React from 'react'

import { GeneralChipKey } from '@/common/components/Chips/config'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface EnhancedCheckBoxProps extends CheckboxProps {
  label: string
  value: GeneralChipKey
}

export interface CheckboxGroupProps {
  title: string
  checkboxes: EnhancedCheckBoxProps[]
  log: (_: unknown, value: string) => void
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primaryRange[100],
  },
}))

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, checkboxes, log }) => {
  const classes = useStyles()

  const { searchCourseQueryParams } = useSearchCourseQueryParams()

  const hasChecked = (tag: GeneralChipKey) => {
    const genEdTags: string[] = searchCourseQueryParams.filter?.genEdTypes ?? []
    const dayOfWeeks: string[] = searchCourseQueryParams.filter?.dayOfWeeks ?? []

    return genEdTags.includes(tag) || dayOfWeeks.includes(tag)
  }

  return (
    <Stack>
      <Typography variant="button" className={classes.title}>
        {title}
      </Typography>
      {checkboxes.map(({ label, ...checkbox }) => (
        <FormControlLabel
          key={label}
          onClick={() => log(null, label || '')}
          control={<Checkbox sx={{ fontFamily: 'Prompt' }} checked={hasChecked(checkbox.value)} {...checkbox} />}
          label={<Typography variant="subtitle1">{label}</Typography>}
        />
      ))}
    </Stack>
  )
}
