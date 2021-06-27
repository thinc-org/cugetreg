import React from 'react'
import { Checkbox, CheckboxProps, FormControlLabel, makeStyles, Stack, Typography } from '@material-ui/core'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { GeneralChipKey } from '@/components/Chips/config'

export interface EnhancedCheckBoxProps extends CheckboxProps {
  label: string
  value: GeneralChipKey
}

export interface CheckboxGroupProps {
  title: string
  checkboxes: EnhancedCheckBoxProps[]
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primaryRange[100],
  },
}))

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, checkboxes }) => {
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
          control={<Checkbox sx={{ fontFamily: 'Prompt' }} checked={hasChecked(checkbox.value)} {...checkbox} />}
          label={<Typography variant="subtitle1">{label}</Typography>}
        />
      ))}
    </Stack>
  )
}
