import { FormControl, MenuItem, Select as MaterialSelect } from '@material-ui/core'
import { useSharedStyles } from '@/styles/shared'

import { useStyles } from './styles'

export interface SelectProps {
  items: string[]
  value: string
  name: string
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}

export const Select = ({ items, value, onChange, name }: SelectProps) => {
  const sharedClasses = useSharedStyles()
  const classes = useStyles()

  const Items = items.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))

  return (
    <FormControl className={`${sharedClasses.inputField} ${classes.select}`}>
      <MaterialSelect
        name={name}
        value={value}
        onChange={onChange}
        inputProps={{
          className: classes.input,
        }}
        disableUnderline={true}
      >
        {Items}
      </MaterialSelect>
    </FormControl>
  )
}
