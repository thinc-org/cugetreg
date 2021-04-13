import React from 'react'
import { CourseCard, CourseCardProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { mockGenEdCourse } from './mockCourse'

export default {
  title: 'Component/CourseCard',
  component: CourseCard,
} as Meta

export const CourseCardStory: Story<CourseCardProps> = (args) => {
  return <CourseCard {...args} />
}

CourseCardStory.args = { course: mockGenEdCourse, rating: 4.54 }
