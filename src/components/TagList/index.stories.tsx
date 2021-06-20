import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'

import { TagList } from '.'
import { CourseSearchContext } from '@/context/CourseSearch'
import { CourseSearchProps, DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/context/CourseSearch/constants'

type StoryProps = CourseSearchProps

export default {
  title: 'Component/TagList',
  component: TagList,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return (
    <CourseSearchContext.Provider value={{ ...DEFAULT_COURSE_SEARCH_CONTEXT_VALUE, tags: args.tags }}>
      <TagList />
    </CourseSearchContext.Provider>
  )
}

Default.args = {
  tags: ['MO', 'IN', 'SC'],
}
