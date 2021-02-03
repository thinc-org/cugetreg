import React from 'react'
import { Select, SelectProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

export default {
  title: 'Component/Select',
  component: Select,
} as Meta

export const SelectPropsStory: Story<SelectProps> = (args) => {
  return <Select {...args} />
}

SelectPropsStory.args = {
  value: 'test1',
  items: ['test1', 'test2', 'test3'],
}
