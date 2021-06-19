import React from 'react'
import { FilterBar, FilterBarProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

type StoryProps = FilterBarProps

export default {
  title: 'Component/FilterBar',
  component: FilterBar,
  argTypes: {},
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return <FilterBar {...args} />
}

Default.args = {}
