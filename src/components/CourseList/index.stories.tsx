import React from 'react'
import { CourseList, CourseListProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { CourseSearchProvider } from '@/context/CourseSearch'

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
