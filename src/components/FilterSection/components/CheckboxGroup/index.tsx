import { Checkbox, CheckboxProps, FormControlLabel, makeStyles, Stack, Typography } from '@material-ui/core'
import React from 'react'

export interface EnhancedCheckBoxProps extends CheckboxProps {
  label: string
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

  return (
    <Stack>
      <Typography variant="button" className={classes.title}>
        {title}
      </Typography>
      {checkboxes.map(({ label, ...checkbox }) => (
        <FormControlLabel
          key={label}
          control={<Checkbox sx={{ fontFamily: 'Prompt' }} {...checkbox} />}
          label={<Typography variant="subtitle1">{label}</Typography>}
        />
      ))}
    </Stack>
  )
}
