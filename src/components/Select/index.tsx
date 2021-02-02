import { MenuItem, FormControl, Select as MaterialSelect } from '@material-ui/core'
import { useStyles } from './styles'
import { useSharedStyles } from '@/styles/shared'

export interface SelectProps {
  items: string[]
  value: string
  name: string
  onChange: (e: React.ChangeEvent<{ value: unknown }>) => void
}

export const Select = ({ items, value, onChange, name }: SelectProps) => {
  const classes = useStyles()
  const sharedClasses = useSharedStyles()

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
