import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { CourseSearchContext } from '@/modules/CourseSearch/context/CourseSearch'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/modules/CourseSearch/context/CourseSearch/constants'

import { SearchField, SeachFieldProp } from '.'

type StoryProps = SeachFieldProp

export default {
  title: 'Component/SeachField',
  component: SearchField,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return (
    <CourseSearchContext.Provider value={DEFAULT_COURSE_SEARCH_CONTEXT_VALUE}>
      <SearchField {...args} />
    </CourseSearchContext.Provider>
  )
}
Default.args = {}
