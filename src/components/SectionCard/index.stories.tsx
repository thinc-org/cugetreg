import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { SectionCard } from '.'
import { mockGenEdCourse, mockNoGenEdCourse } from '../CourseCard/mockCourse'

type CourseCardStoryProps = { courseType: 'gened' | 'noGened'; availability: 'available' | 'full' | 'closed' }

export default {
  title: 'Component/SectionCard',
  component: SectionCard,
  argTypes: {
    courseType: {
      name: 'Course Type',
      defaultValue: 'gened',
      control: {
        type: 'radio',
        options: ['gened', 'noGened'],
      },
    },
    availability: {
      name: 'Availability',
      defaultValue: 'available',
      control: {
        type: 'radio',
        options: ['available', 'full', 'closed'],
      },
    },
  },
} as Meta<CourseCardStoryProps>

export const SectionCardStory: Story<CourseCardStoryProps> = (args) => {
  const { courseType, availability } = args
  const course = courseType === 'gened' ? mockGenEdCourse : mockNoGenEdCourse
  const section =
    availability === 'closed' ? course.sections[2] : availability === 'full' ? course.sections[1] : course.sections[0]
  return <SectionCard course={course} section={section} />
}
