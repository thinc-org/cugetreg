import { KeyboardDatePicker } from '@material-ui/pickers'
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined'
import { useStyles } from './styles'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { useSharedStyles } from '@/styles/shared'

export interface DatePickProps {
  value: Date | null
  name: string
  onChange: (date: MaterialUiPickersDate) => void
}

export const DatePicker = ({ value, onChange, name }: DatePickProps) => {
  const classes = useStyles()
  const sharedClasses = useSharedStyles()

  return (
    <KeyboardDatePicker
      placeholder="dd/mm/yyyy"
      name={name}
      className={sharedClasses.inputField}
      keyboardIcon={<DateRangeOutlinedIcon />}
      value={value}
      disableFuture
      onChange={onChange}
      inputProps={{
        className: classes.input,
      }}
      InputProps={{
        disableUnderline: true,
      }}
      KeyboardButtonProps={{
        className: classes.dateIcon,
      }}
      format="dd/MM/yyyy"
    />
  )
}
