import React from 'react'
import { FilterSection, FilterSectionProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

type StoryProps = FilterSectionProps

export default {
  title: 'Component/FilterBar',
  component: FilterSection,
  argTypes: {},
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return <FilterSection {...args} />
}

Default.args = {}
