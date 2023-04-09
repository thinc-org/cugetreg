import { ReactNode } from 'react'

import { FormControl, InputLabel, MenuItem, SelectChangeEvent } from '@mui/material'

import { StyledInputLabel, StyledSelect } from './styled'

interface SelectFormProps {
  name: string
  data: { text: string; value: string }[]
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectForm(props: SelectFormProps) {
  const { name, data, value, setValue } = props

  const handleChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    setValue(event.target?.value)
  }

  //   TODO: Beautify this
  return (
    <FormControl size="small" sx={{ minWidth: '120px' }}>
      <StyledInputLabel id={`${name}-select-label`}>{name}</StyledInputLabel>
      <StyledSelect
        labelId={`${name}-select-label`}
        value={value}
        id={`${name}-select`}
        label={name}
        onChange={handleChange}
      >
        {data.map((d) => (
          <MenuItem key={`${name}${d.text}${d.value}`} value={d.value}>
            {d.text}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}
