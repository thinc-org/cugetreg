import { TextField } from '@material-ui/core'
import MuiDatePicker from '@material-ui/lab/DatePicker'

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
