import { FormControl, MenuItem, Select as MaterialSelect } from '@material-ui/core'

import { SelectProps } from './types'

export const Select = ({ items, value, onChange, name }: SelectProps) => {
  const Items = items.map((item) => (
    <MenuItem key={item} value={item}>
      {item}
    </MenuItem>
  ))

  return (
    <FormControl fullWidth size="small" variant="outlined">
      <MaterialSelect name={name} value={value} onChange={onChange} disableUnderline={true}>
        {Items}
      </MaterialSelect>
    </FormControl>
  )
}
