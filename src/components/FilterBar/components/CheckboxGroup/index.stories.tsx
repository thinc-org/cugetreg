import React from 'react'
import { CheckboxGroup, CheckboxGroupProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

type StoryProps = CheckboxGroupProps

export default {
  title: 'Component/FilterBar/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    value: { control: 'date' },
  },
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return <CheckboxGroup {...args} />
}

const checkboxes: CheckboxGroupProps['checkboxes'] = [
  {
    label: 'หมวดวิทย์',
    value: 'Exmaple 1',
  },
  {
    label: 'หมวดสังคม',
    value: 'Exmaple 2',
  },
  {
    label: 'หมวดมนุษย์',
    value: 'Exmaple 3',
  },
]

Default.args = {
  title: 'หมวดหมู่ GenEd',
  checkboxes,
}
