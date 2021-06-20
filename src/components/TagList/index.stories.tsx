import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'

import { TagList } from '.'
import { FilteredTagContext } from '@/context/FilteredTag'
import { FilteredTagProps, DEFAULT_FILTERED_TAG_CONTEXT_VALUE } from '@/context/FilteredTag/constants'

type StoryProps = FilteredTagProps

export default {
  title: 'Component/TagList',
  component: TagList,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return (
    <FilteredTagContext.Provider value={{ ...DEFAULT_FILTERED_TAG_CONTEXT_VALUE, tags: args.tags }}>
      <TagList />
    </FilteredTagContext.Provider>
  )
}

Default.args = {
  tags: ['MO', 'IN', 'SC'],
}
