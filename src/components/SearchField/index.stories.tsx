import React from 'react'
import { SearchField, SeachFieldProp } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { CourseSearchContext } from '@/context/CourseSearch'
import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/context/CourseSearch/constants'

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
