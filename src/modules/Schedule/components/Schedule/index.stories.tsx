import { Meta } from '@storybook/react/types-6-0'
import React from 'react'

import { Schedule } from '.'
import { mockClasses } from './mockClasses'
import { useScheduleClass } from './utils'

export default {
  title: 'Component/Schedule',
  component: Schedule,
} as Meta

export const ScheduleStory = () => {
  const scheduleClasses = useScheduleClass(mockClasses)
  return <Schedule classes={scheduleClasses} daysCount={5} />
}
