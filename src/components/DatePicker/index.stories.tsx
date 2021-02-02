import React from 'react'
import { DatePicker, DatePickProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

export default {
  title: 'Component/DatePicker',
  component: DatePicker,
  argTypes: {
    value: { control: 'date' },
  },
} as Meta

export const AnnouncementSearchStory: Story<DatePickProps> = (args) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={lightTheme}>
        <DatePicker {...args} />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

AnnouncementSearchStory.args = {
  value: new Date(),
}
