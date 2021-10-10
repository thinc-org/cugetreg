import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { FilterSection } from '@/modules/CourseSearch/components/FilterSection'
import { FilterSectionProps } from '@/modules/CourseSearch/components/FilterSection/types'

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
