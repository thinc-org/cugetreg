import React from 'react'
import { CourseCard } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { mockGenEdCourse, mockNoGenEdCourse } from './mockCourse'

type CourseCardStoryProps = { courseType: 'gened' | 'noGened'; rating: number }

export default {
  title: 'Component/CourseCard',
  component: CourseCard,
  argTypes: {
    courseType: {
      name: 'Course Type',
      defaultValue: 'gened',
      control: {
        type: 'radio',
        options: ['gened', 'noGened'],
      },
    },
  },
} as Meta<CourseCardStoryProps>

export const CourseCardStory: Story<CourseCardStoryProps> = (args) => {
  const { courseType, rating } = args
  return <CourseCard course={courseType === 'gened' ? mockGenEdCourse : mockNoGenEdCourse} rating={rating} />
}

CourseCardStory.args = { rating: 4.54 }
