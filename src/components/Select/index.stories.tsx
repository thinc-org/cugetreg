import React from 'react'
import { Select, SelectProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/Select',
  component: Select,
} as Meta

export const SelectPropsStory: Story<SelectProps> = (args) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Select {...args} />
    </ThemeProvider>
  )
}

SelectPropsStory.args = {
  value: 'test1',
  items: ['test1', 'test2', 'test3'],
}
