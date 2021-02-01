import React from 'react'
import { AnnouncementSearch, AnnouncementSearchProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

export default {
  title: 'Component/AnnouncementSearch',
  component: AnnouncementSearch,
} as Meta

export const AnnouncementSearchStory: Story<AnnouncementSearchProps> = (args) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={lightTheme}>
        <AnnouncementSearch {...args} />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

AnnouncementSearchStory.args = {
  categories: ['ทุกหมวดหมู่', 'test2'],
  faculties: ['ทุกคณะ', 'test11'],
  onSubmit: console.log,
}
