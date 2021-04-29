import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

export interface DatePickProps {
  value: Date | null
  name: string
  onChange: (date: MaterialUiPickersDate) => void
}

export const DatePicker = ({ value, onChange, name }: DatePickProps) => {
  return (
    <KeyboardDatePicker
      placeholder="dd/mm/yyyy"
      name={name}
      keyboardIcon={<DateRangeOutlinedIcon />}
      value={value}
      disableFuture
      onChange={onChange}
      // TODO: add size=small later when MUI support
      inputProps={{ sx: { py: 1.0625 } }}
      KeyboardButtonProps={{ size: 'small' }}
      format="dd/MM/yyyy"
    />
  )
}
