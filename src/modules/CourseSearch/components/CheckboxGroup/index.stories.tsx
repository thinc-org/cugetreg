import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { CheckboxGroup, CheckboxGroupProps } from '.'

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
    value: 'SC',
  },
  {
    label: 'หมวดสังคม',
    value: 'SO',
  },
  {
    label: 'หมวดมนุษย์',
    value: 'HU',
  },
]

Default.args = {
  title: 'หมวดหมู่ GenEd',
  checkboxes,
}
