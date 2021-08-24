import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { DatePicker, DatePickProps } from '.'

export default {
  title: 'Component/DatePicker',
  component: DatePicker,
  argTypes: {
    value: { control: 'date' },
  },
} as Meta

export const AnnouncementSearchStory: Story<DatePickProps> = (args) => {
  return <DatePicker {...args} />
}

AnnouncementSearchStory.args = {
  value: new Date(),
}
