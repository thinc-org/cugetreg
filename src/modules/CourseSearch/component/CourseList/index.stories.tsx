import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { CourseSearchProvider } from '@/modules/CourseSearch/context/CourseSearch'

import { CourseList, CourseListProps } from '.'

type StoryProps = CourseListProps

export default {
  title: 'Component/CourseList',
  component: CourseList,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return (
    <CourseSearchProvider>
      <CourseList {...args} />
    </CourseSearchProvider>
  )
}

Default.args = {}
