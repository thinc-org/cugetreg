import MuiDatePicker from '@mui/lab/DatePicker'
import { TextField } from '@mui/material'

export interface DatePickProps {
  value: Date | null
  name: string
  onChange: (date: Date | null) => void
}

export const DatePicker = ({ value, onChange, name }: DatePickProps) => {
  return (
    <MuiDatePicker
      value={value}
      disableFuture
      onChange={onChange}
      renderInput={(params) => <TextField name={name} {...params} helperText={null} />}
      inputFormat="dd/MM/yyyy"
      OpenPickerButtonProps={{
        'aria-label': 'change date',
        size: 'small',
      }}
    />
  )
}
